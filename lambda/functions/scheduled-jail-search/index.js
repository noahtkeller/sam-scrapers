import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@esmodule/dynamodb-type-marshall';

const dynamo = new DynamoDB({});
const { TableName } = process.env;

export async function handler({ facility = 'jail.marionso.com' }) {
  const query = {
    TableName,
    ReturnConsumedCapacity: 'TOTAL',
    Limit: 1,
    KeyConditionExpression: '#kn0 = :kv0 AND #kn1 > :kv1',
    ScanIndexForward: false,
    ExpressionAttributeNames: { '#kn0': 'facility', '#kn1': 'rid' },
    ExpressionAttributeValues: {
      ':kv0': { S: facility },
      ':kv1': { N: '0' },
    },
  };
  const { Items: [lastDoc] } = await dynamo.query(query);
  const { rid = 3898955 } = unmarshall(lastDoc);
  return { inmateRid: rid + 1, facility };
}
