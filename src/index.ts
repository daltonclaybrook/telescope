import { APIGatewayEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import redis from 'redis';
import { promisify } from 'util';
import { makeMessage, Message } from './message';

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '', 10),
});

const hget = promisify(client.hget).bind(client);
const hset = promisify(client.hset).bind(client);

const lambdaHandler = async (event?: APIGatewayEvent, context?: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> => {
    console.log('handling...');
    const existing = await hget('key1', 'field1');
    if (existing) {
        console.log(`key1 - field1: ${existing}`);
    } else {
        console.log('no existing');
    }
    const reply = await hset('key1', 'field1', 'fizzbuzz');
    console.log(`no longer quitting redis: ${reply}`);

    const body = (event && event.body) ? event.body : '';
    const message = makeMessage(body);
    if (!message) {
        throw new Error('invalid message payload');
    }

    return {
        statusCode: 200,
        body: `Thanks for the message, ${message.userName}.`,
    };
};

if (process.env.DEBUG) {
    console.log('calling handler...');
    lambdaHandler().then((result: APIGatewayProxyResult) => {
        console.log(JSON.stringify(result));
    });
}

exports.handler = lambdaHandler;
