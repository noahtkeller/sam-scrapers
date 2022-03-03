import newVision from 'scrapers/new-vision';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { S3 } from '@aws-sdk/client-s3';
import { marshall } from '@esmodule/dynamodb-type-marshall';

const dynamo = new DynamoDB({});
const s3 = new S3({});
const { TableName, Bucket } = process.env;

export async function handler({ facility = 'marioncountyclerk.org', id = '5774286' }, context) {
  const proms = [];
  const { meta, pages } = await newVision({ facility, id });
  proms.push(dynamo.putItem({ TableName, Item: marshall(meta) }));
  for (let i = 0; i < pages.length; i++) {
    const Body = Buffer.from(pages[i], 'base64');
    proms.push(s3.putObject({ Bucket, Body, Key: `${facility}/${id}/${i}.png` }));
  }
  await Promise.all(proms);
}
