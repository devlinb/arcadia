import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from "openai";
import { TStorySubmission } from '../../../shared'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function postPrompt(req: Request, res: Response) {
  console.log(`making a story`);

  const submission = req.body as TStorySubmission;

  let charactersStr = '';

  for( const p of submission.people ) {
    charactersStr += `${p.name} - ${p.relationship}\n`;  
  }

  charactersStr += `\nKingdom - ${submission.kingdom}`;
  
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": systemPrompt },
      { "role": "user", "content": initialPrompt },
      { "role": "user", "content": charactersStr }
    ],
    temperature: 0.8,
    top_p: 1,
    presence_penalty: 0.6,
    frequency_penalty: 0
  });
  
  
  const result = completion.data.choices[0].message?.content;
  console.log(result);
  res.status(200).json({"story": result});
  return;
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

Mary wants to be crowned queen at any cost (Mary 🤔 Mary 👑).

If multiple characters are plotting something together, list all character names, separated by "," and then 🤔 

John and Sarah want to ensure Sarah's ascension to the throne (John, Sarah 🤔 Sarah 👑)

Tim gathered his army and attempted to conquer Arcadia (Tim ⚔️ Arcadia)

Mary poisoned Sarah's tea (Mary 🗡️ Sarah)

Mary hired as assassin to kill Sarah (Mary 🗡️ Sarah)

To strengthen her claim to the throne, Mary married Tim (Mary 💍 Tim)

Tim hired a witch to cast a curse upon Arcadia, plunging it into darkness  (Tim 🧚 Arcadia)

If a character is planning an action involving multiple other characters, format the answer  (character Planning 💭 First Target <Action Emoji> Second Target) Example:

John knows that an marriage between Sarah and Tim will ensure Sarah's ascension to the throne  (John 💭 Sarah 💍 Tim)
`;

const characters = `
Henry IV - King

Queen Mary - Queen

Princess Margaret - Oldest Princess

Prince Timothy - Youngest Prince

Tuck - Advisor

Vance - Bishop

Kingdom - Aragon
`;

const sampleResponse = `The sun had barely risen when King Henry IV awoke to a searing pain in his chest, gasping for air, his body began to convulse as his visor, Tuck, watched in horror (Henry IV 🤒 Tuck). The King's condition worsened, and the news reached the Queen, who was in a meeting with the Bishop Vance. They quickly made their way to the King's bedchamber, where he lay on his deathbed (Mary, Vance 👀 Henry IV 🤒).

With the King's fate uncertain, Princess Margaret and Prince Timothy were called back to the royal palace. The Princess, next in line to the throne, was worried about her younger brother's claim to the throne if their father died (Margaret, Timothy 🤔).

As the days went by, the King's health continued to worsen. The Queen spent hours at his bedside, praying for a miracle, while the Princess and the Prince spent their time preparing for the worst (Mary 👀 Henry IV 🤒, Margaret, Timothy 🗡️ Kingdom).

Meanwhile, Vance was approached by a group of nobles who wanted to seize the throne for themselves. Vance, seeing an opportunity to gain more power, agreed to help them. They began to spread rumors about Princess Margaret's legitimacy, claiming that she was not the King's true daughter (Vance 💭 Margaret <🗣️> Nobles).

The Princess, hearing of the rumors, was horrified. She knew that if they were true, her claim to the throne would be in jeopardy. She confided in her brother, who promised to protect her, no matter what (Margaret 💔 Timothy).

As the King's health deteriorated, the Queen began to make plans to secure her own power. She knew that if the King died, she would have to act fast. She reached out to the nobles, promising them riches and titles if they helped her secure the throne (Mary 💭 Nobles <💰👑>).

However, Vance had other plans. He had secretly hired an assassin to kill the Queen and the Princess, clearing the way for the nobles to take power (Vance 🗡️ Mary, Margaret).

The day after the King's death, chaos erupted in the royal palace.The Queen and the Princess were found dead in their chambers, while Vance and the nobles seized control of the kingdom. Prince Timothy, the only member of the royal family left, fled from the castle, vowing to one day take back what was rightfully his (Timothy 💔 Kingdom).`;
