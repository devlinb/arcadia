import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { Request, Response } from 'express';

const s3Client = new S3Client({
  endpoint: 'https://ewr1.vultrobjects.com',
  region: 'ewr1', // your desired region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export default async function getStory(req: Request, res: Response) {
  const { uniqueId } = req.params;
  console.log(`getstory: ${uniqueId}`);

  const params = {
    Bucket: 'stories',
    Key: `${uniqueId}`,
  };

  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command);
    console.log(`signed url is: ${signedUrl}`);
    const response = await axios.get(signedUrl);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error while fetching: ${error}`);
    res.status(500).send('An error occurred while fetching the JSON object.');
  }
}
