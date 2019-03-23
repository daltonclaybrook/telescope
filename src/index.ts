import { APIGatewayProxyResult } from 'aws-lambda';
import { getMessageContext, makeMessage, MessageType } from './message';
import respond from './respond';
import store from './store';

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

    let summary: string;
    switch (context.type) {
        case MessageType.Start:
            console.log('handling start...');
            console.log(`deleting: ${context.summary}`);
            await store.deleteKey(context.summary);
            console.log(`setting current: ${context.summary}`);
            await store.setValueForKey('current', context.summary);
            return respond('Let the scoping begin! Run `/scope stop` to stop scoping.');
        case MessageType.Scope:
            console.log('handling scope...');
            const score = context.score;
            summary = await store.getValueForKey('current');
            if (summary.length <= 0) {
                return respond('You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
            }
            await store.setHashValue(summary, message.userId, score.toString());
            return respond(`Issue: *${summary}*\nYour scope: *${score}*`);
        case MessageType.Stop:
            console.log('handling stop...');
            summary = await store.getValueForKey('current');
            if (!summary || summary.length <= 0) {
                return respond('You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
            }
            const responses = await store.getAllHashValues(summary);
            await store.deleteKey(summary);
            await store.deleteKey('current');

            if (!responses || Object.keys(responses).length === 0) {
                return respond(`No one scoped the issue: ${summary}`);
            }

            const firstValue = parseInt(Object.values(responses)[0], 10);
            const responseString = Object.keys(responses)
                .map((key) => `${mentionUserId(key)}: *${responses[key]}*`)
                .join('\n');

            const allSame = Object.values(responses)
                .reduce((same, current) => parseInt(current, 10) === firstValue && same, true);
            const result = allSame ? `The team agrees! Score: *${firstValue}*` : 'The team does not agree on the score.';
            const finalString = `${responseString}\n\n${result}`;
            return respond(finalString, false);
        case MessageType.Help:
            console.log('handling help...');
            return respond('help coming soon...');
        default:
            return respond(dontUnderstand);
    }
};

const mentionUserId = (userId: string): string => {
    return `<@${userId}>`;
};

if (process.env.DEBUG) {
    const user = encodeURIComponent('dalton');
    // const user = encodeURIComponent('carolyn');

    const userId = encodeURIComponent('abc123');
    // const userId = encodeURIComponent('def456');

    // const text = encodeURIComponent('start Do the thing');
    // const text = encodeURIComponent('8');
    const text = encodeURIComponent('stop');

    const testBody = `team_id=abc123&channel_id=abc123&user_id=${userId}&user_name=${user}&command=%2Fscope&text=${text}`;

    console.log('calling handler...');
    lambdaHandler({ body: testBody }).then((result: APIGatewayProxyResult) => {
        console.log(JSON.stringify(result, null, 2));
        store.quit();
    }).catch((reason) => {
        console.log(`failed with reason: ${reason}`);
        store.quit();
    });
}

exports.handler = lambdaHandler;
