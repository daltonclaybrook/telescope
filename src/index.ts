import { APIGatewayEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';
import redis from 'redis';
import { promisify } from 'util';
import { getMessageType, makeMessage, MessageType } from './message';

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '', 10),
});

const hget = promisify(client.hget).bind(client);
const hset = promisify(client.hset).bind(client);

interface Event {
    body?: string;
}

const lambdaHandler = async (event: Event): Promise<APIGatewayProxyResult> => {
    console.log('handling...');
    await demonstrateRedis();

    const message = makeMessage(event.body || '');
    if (!message) {
        return respond(`invalid message payload`, true, 400);
    }

    const dontUnderstand = 'I don\'t understand. Try typing `/scope help` for suggestions.';
    const context = getMessageType(message);
    if (!context) {
        return respond(dontUnderstand);
    }

    switch (context.type) {
        case MessageType.Start:
            return respond(`will start scoping with summary: '${context.context}'`);
        case MessageType.Scope:
            return respond(`scope: ${context.context}`);
        case MessageType.Stop:
            return respond('will stop scoping');
        case MessageType.Help:
            return respond('will help');
        default:
            return respond(dontUnderstand);
    }
};

const demonstrateRedis = async () => {
    const existing = await hget('key1', 'field1');
    if (existing) {
        console.log(`key1 - field1: ${existing}`);
    } else {
        console.log('no existing');
    }
    const reply = await hset('key1', 'field1', 'fizzbuzz');
    console.log(`no longer quitting redis: ${reply}`);
};

const respond = (text: string, ephemeral?: boolean, statusCode?: number): APIGatewayProxyResult => {
    const type = (ephemeral || true) ? 'ephemeral' : 'in_channel';
    const payload = {
        response_type: type,
        text,
    };
    return {
        statusCode: statusCode || 200,
        body: JSON.stringify(payload),
    };
};

if (process.env.DEBUG) {
    console.log('calling handler...');
    lambdaHandler({ body: 'test' }).then((result: APIGatewayProxyResult) => {
        console.log(JSON.stringify(result));
    });
}

exports.handler = lambdaHandler;
