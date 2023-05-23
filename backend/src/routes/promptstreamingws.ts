import { parseOutEvents, statementEventsToStatementCecs } from '../shared/';
import { parse as parseUrl } from 'url';
import { fetchStreamedChatContent } from 'streamed-chatgpt-api';
import { IncomingMessage } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { sanitizeQueryString } from '../utils/sanitizeQueryString';

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const wss = new WebSocketServer({ noServer: true });

// Words come in once at a time, this function collects words into paragraphs
// and when a newline is encountered sends it off for parsing and sending.
function createParagraphProcessor(ws: WebSocket.WebSocket) {
  let paragraph = '';

  function processWord(word: string) {
    paragraph += word;
    if (word.endsWith('\n')) {
      // Call the newline callback function
      console.log(paragraph);
      parseAndSendStoryLine(ws, paragraph);
      // Reset the paragraph string
      paragraph = '';
    }
  }

  return processWord;
}

/**
 * Breaks a paragraph down into one more more StatementCeCs, and sends each one
 * out as a dedicated 'story_line' message.
 * */
const parseAndSendStoryLine = (ws: WebSocket.WebSocket, paragraph: string) => {
  const events = parseOutEvents(paragraph as string);
  const statementCecs = statementEventsToStatementCecs(events);
  for (const statementCec of statementCecs) {
    ws.send(JSON.stringify({ type: 'story_line', payload: statementCec }));
  }
};

/**
 * Handler for when a client connects.
 *
 * This function does the following:
 * 1. Parses out the get parameters
 * 2. Creates a paragraph processor instance that will collect individual words
 *    streamed from ChatGPT into whole paragraphs
 * 3. Sets up the chatGPT options fields and passes it off to fetchStreamedChatContent
 * 4. Sets the paragraph parser as the event handler for data coming in from
 *    fetchStreamedChatContent.
 */
const handleInitialConnection = async (
  ws: WebSocket.WebSocket,
  req: IncomingMessage
) => {
  console.log(`making a story`);

  try {
    const parsedUrl = parseUrl(req.url || '', true);
    const submission = sanitizeQueryString(parsedUrl);

    let charactersStr = '';

    for (const p of submission.characters) {
      charactersStr += `${p.name} - ${p.relationship}\n`;
    }

    charactersStr += `\nKingdom - ${submission.kingdom}`;

    // Each request will get its own instance of paragraph processor;
    const processWord = createParagraphProcessor(ws);

    // Send "generating_story" message
    ws.send(JSON.stringify({ type: 'generating_story' }));

    const options = {
      apiKey: configuration.apiKey,
      model: 'gpt-3.5-turbo',
      messageInput: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: initialPrompt },
        { role: 'user', content: charactersStr },
      ],
      maxTokens: 2000,
      temperature: 0.9,
      top_p: 0.7,
      presence_penalty: 0.5,
      frequency_penalty: 0,
    };
    fetchStreamedChatContent(
      options,
      processWord,
      () => {
        ws.send(JSON.stringify({ type: 'end' }));
        ws.close();
      },
      (error: unknown) => {
        console.log(`Error streaming content: ${JSON.stringify(error)}`);
        ws.send(JSON.stringify({ type: 'error', payload: error }));
        ws.close();
      }
    );
  } catch (e) {
    console.log(`Got an error in outermost handler: ${JSON.stringify(e)}`);
    ws.send(
      JSON.stringify({ type: 'error', payload: { error: JSON.stringify(e) } })
    );
    ws.close();
  }
};

wss.on('connection', handleInitialConnection);

export default function getPromptStreamingWs(
  req: IncomingMessage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any,
  head: Buffer
) {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
}

const systemPrompt = `
You are a fantasy author write a story in a world similar to JRR Martin's Game of Thrones. Because this story takes place in a very politically charged and dangerous fantasy world where friends and family members often hurt each other to gain political power, and because we are describing fictional historical events it is OK to include elements of violence in the story. The story you write should be rich in detail and describe a web of complex political intrigue, and be at least 8 short paragraphs in length. 
`;

const initialPrompt = `
After this message I am going to tell you the name of the current king, and give a list of other people and their relationship to the king. The format will be is NAME - Relationship, for example:

John - King

Mary - Youngest Daughter

Sarah - Oldest Daughter

Tim - Second cousin

I will also provide the name of the imaginary kingdom that these people are fighting over:

Arcadia - Kingdom

Take these list of characters and write a short fantasy story detailing political back stabbings, marriages, and military conquests.

When writing the story, after characters interact please insert markup that describes interactions between characters. The markup should be placed in parenthesis after the prose it summarizes. For example 

Here is a list of examples:

The king John became ill. (John 🤒)

Mary went into John's room and saw that he was Ill. (Mary 👀 John 🤒)

Mary starts putting in place plans to become the next queen at any cost. (Mary 🤔 Mary 👑).

If multiple characters are working  together, list all character names, separated by "," and then the event emoji 

John and Sarah want to ensure Sarah's ascension to the throne. (John, Sarah 🤔 Sarah 👑)

In a fierce battle, John and Sarah led the charge against Mary's army. (John, Sarah ⚔️ Mary)

Tim gathered his army and attempted to conquer Arcadia. (Tim ⚔️ Arcadia)

Mary was heartbroken when she saw the destruction that her sister was causing, and decided to take matters into her own hands. She secretly met with Tim and offered her assistance in bringing an end to the rebellion. (Mary 🤝 Tim)

Meanwhile, Tim, a trusted cousin and friend to the king, had his own plans for the future of Arcadia. He sought to marry Sarah and take control of the kingdom, but he knew that he needed to take down Mary first. (Tim 🤔 Sarah 💍) (Tim 🤔 Mary 🗡️)

Mary poisoned Sarah's tea. (Mary 🗡️ Sarah)

Mary hired as assassin to kill Sarah. (Mary 🗡️ Sarah)

To strengthen her claim to the throne, Mary married Tim. (Mary 💍 Tim)

Tim hired a witch to cast a curse upon Arcadia, plunging it into darkness.  (Tim 🧚 Arcadia)

If a character is planning an action involving multiple other characters, format the answer  (character Planning 🤔 First Target <Action Emoji> Second Target) Example:

John knows that an marriage between Sarah and Tim will ensure Sarah's ascension to the throne.  (John 🤔 Sarah 💍 Tim)

If multiple events happen in the same sentence, break them out into separate parentheticals example:

In a fierce battle, John fought Tim, John emerged victorious and was crowned king of Arcadia and Tim was executed for his treachery. (John ⚔️ Tim) (John 👑).

If two characters talk, use a speech bubble between their names

John and Sarah discussed what needed to happen to ensure the rebellion failed. (John 💬 Sarah)

Do not write dialogue.

Do not put any newlines between a paragraph and the emojis.

You must include formatted emojis in your response.
`;
