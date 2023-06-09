import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import shortid from 'shortid';
import { Request, Response } from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { TStoryData } from '../shared';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// instantiate S3
const s3Client = new S3Client({
  endpoint: 'https://ewr1.vultrobjects.com',
  region: 'ewr1', // your desired region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function saveStoryToS3(storyData: TStoryData): Promise<string> {
  console.log(`saving story`);
  const uniqueId = shortid.generate();
  // Generate a SHA256 hash of the JSON object
  const entireStory = storyData.statements.reduce(
    (accum, cur) => accum + cur.statement + '\n',
    ''
  );

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: initialPrompt },
      {
        role: 'user',
        content: entireStory,
      },
    ],
    top_p: 1,
    presence_penalty: 0.5,
    frequency_penalty: 0,
  });
  const summary = completion.data.choices[0].message?.content;
  console.log(`summary is: ${summary}`);

  const params = {
    Bucket: 'stories', // your bucket name
    Key: uniqueId,
    Body: JSON.stringify({ summary, storyData }),
    ContentType: 'application/json',
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return uniqueId;
}

export default async function savestory(req: Request, res: Response) {
  console.log(`saving story`);
  const jsonObject = req.body;
  try {
    const id = await saveStoryToS3(jsonObject);
    res.status(200).json({ status: 'SUCCESS', id });
  } catch (error) {
    console.log(`error saving to s3: ${error}`);
    res.status(500).json({ status: 'FAILURE' });
  }
}

const systemPrompt = `You are an ad copy writer at a fantasy book publisher known for writing book blurbs that entire readers to buy.`;
const initialPrompt = `I am going to paste in a story you wrote for me. Please write a 1 sentence introduction to the story, in the general form of

"The land of <Kingdom Name> was threatened by <danger>, and broke out into war between <combatants' names>"

Do not reveal the conclusion of the story in the introduction sentence.`;
