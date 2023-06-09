import { IncomingMessage } from 'http';
import { Configuration, OpenAIApi } from 'openai';
import { parse as parseUrl } from 'url';
import { Server as WebSocketServer } from 'ws';
import { parseOutEvents, statementEventsToStatementCecs } from '../shared/';
import { sanitizeQueryString } from '../utils/sanitizeQueryString';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialize a WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (ws, req) => {
  try {
    console.log('making a story');

    const parsedUrl = parseUrl(req.url || '', true);
    const submission = sanitizeQueryString(parsedUrl);

    let charactersStr = '';

    for (const p of submission.characters) {
      charactersStr += `${p.name} - ${p.relationship}\n`;
    }

    charactersStr += `\nKingdom - ${submission.kingdom}`;

    // Send "generating_story" message
    ws.send(JSON.stringify({ type: 'generating_story' }));
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: initialPrompt },
        { role: 'user', content: charactersStr },
      ],
      temperature: 0.8,
      top_p: 0.7,
      presence_penalty: 0.5,
      frequency_penalty: 0,
    });

    const result = completion.data.choices[0].message?.content;
    console.log(result);

    // Send the story result
    const events = parseOutEvents(result as string);
    const statementPePs = statementEventsToStatementCecs(events);
    ws.send(JSON.stringify({ type: 'story', payload: statementPePs }));
  } catch (e) {
    console.log(`got error: ${e}`);

    // Send the error
    ws.send(
      JSON.stringify({ type: 'error', payload: { error: JSON.stringify(e) } })
    );
  } finally {
    // Close the WebSocket connection
    ws.close();
  }
});

/**
 * Basically this updates the connection to a full websocket connection and
 * emits the `connection` event to the server, which then causes the
 * .on('connection) handler to be called.
 */
export default function getPromptws(
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
You are a fantasy author write a story in a world similar to JRR Martin's Game of Thrones. Because this story takes place in a very politically charged and dangerous fantasy world where friends and family members often hurt each other to gain political power, and because we are describing fictional historical events it is OK to include elements of violence in the story. 
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

Mary wanted to be crowned Queen, but needed her older sister removed from the line of succession, so Mary hired an assassin to kill her sister (Mary 🗡️ Sarah)

Here is a list of examples:

The king John became ill (John 🤒).

Mary went into John's room and saw that he was Ill (Mary 👀 John 🤒)

Mary starts putting in place plans to become the next queen at any cost (Mary 🤔 Mary 👑).

If multiple characters are plotting something together, list all character names, separated by "," and then 🤔 

John and Sarah want to ensure Sarah's ascension to the throne (John, Sarah 🤔 Sarah 👑)

Tim gathered his army and attempted to conquer Arcadia (Tim ⚔️ Arcadia)

Mary poisoned Sarah's tea (Mary 🗡️ Sarah)

Mary hired as assassin to kill Sarah (Mary 🗡️ Sarah)

To strengthen her claim to the throne, Mary married Tim (Mary 💍 Tim)

Tim hired a witch to cast a curse upon Arcadia, plunging it into darkness  (Tim 🧚 Arcadia)

If a character is planning an action involving multiple other characters, format the answer  (character Planning 🤔 First Target <Action Emoji> Second Target) Example:

John knows that an marriage between Sarah and Tim will ensure Sarah's ascension to the throne  (John 🤔 Sarah 💍 Tim)

If multiple events happen in the same sentence, break them out into separate parentheticals example:

In a fierce battle, John fought Tim, John emerged victorious and was crowned king of Arcadia and Tim was executed for his treachery.
(John ⚔️ Tim) (John 👑).

If two characters talk, use a speech bubble between their names

John and Sarah discussed what needed to happen to ensure the rebellion failed. (John 💬 Sarah)
`;
