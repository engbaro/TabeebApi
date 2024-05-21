import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';
import config from '../config/index';

import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';


const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
 credentials: {accessKeyId: config.dynamoAccessKeyId ||'',
     secretAccessKey: config.dynamoSecretAccessKey||''}
});

const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "Tabeeb";
export {client, dynamo, tableName};