import jailSearch from 'scrapers/jail-search';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { S3 } from '@aws-sdk/client-s3';
import { marshall } from '@esmodule/dynamodb-type-marshall';

const dynamo = new DynamoDB({});
const s3 = new S3({});
const { TableName, Bucket } = process.env;

export async function handler({ inmateRid, facility }, context) {
    let curId = inmateRid;
    const proms = [];
    do {
        try {
            const res = await jailSearch({ inmateRid: curId, facility });
            const { picture: Body, inmateRid: rid, ...item } = res;
            proms.push(dynamo.putItem({ TableName, Item: marshall(Object.assign({ facility, rid }, item)) }));
            if (Body) {
                proms.push(s3.putObject({ Bucket, Body, Key: `${facility}/${rid}.jpg` }));
            }
        } catch (e) {
            console.log('Error retrieving arrest record');
            console.log(e);
        } finally {
            curId++;
        }
    } while (context.getRemainingTimeInMillis() > 1200);
    await Promise.all(proms);
}
