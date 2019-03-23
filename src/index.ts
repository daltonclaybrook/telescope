import { APIGatewayProxyResult } from 'aws-lambda';
import debug from './debug';
import handlers from './handlers';
import { getMessageContext, makeMessage, MessageType } from './message';
import { respond } from './respond';

interface Event {
    body?: string;
}

const lambdaHandler = async (event: Event): Promise<APIGatewayProxyResult> => {
    console.log('handling...');
    const message = makeMessage(event.body || '');
    if (!message) {
        return respond(`invalid message payload`, true, 400);
    }

    const dontUnderstand = 'I don\'t understand. Try typing `/scope help` for suggestions.';
    const context = getMessageContext(message);
    if (!context) {
        return respond(dontUnderstand);
    }

    switch (context.type) {
        case MessageType.Start:
            console.log('handling start...');
            return handlers.start(context);
        case MessageType.Scope:
            console.log('handling scope...');
            return handlers.scope(message, context);
        case MessageType.Check:
            console.log('handling check...');
            return handlers.check();
        case MessageType.Stop:
            console.log('handling stop...');
            return handlers.stop();
        case MessageType.Help:
            console.log('handling help...');
            return handlers.help();
        default:
            return respond(dontUnderstand);
    }
};

if (process.env.DEBUG) {
    debug(lambdaHandler);
}

exports.handler = lambdaHandler;
