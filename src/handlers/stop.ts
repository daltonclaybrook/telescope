import { APIGatewayProxyResult } from 'aws-lambda';
import respond from '../respond';
import store from '../store';

export default async (): Promise<APIGatewayProxyResult> => {
    const summary = await store.getValueForKey('current');
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
        .map((key) => `<@${key}>: *${responses[key]}*`)
        .join('\n');

    const allSame = Object.values(responses)
        .reduce((same, current) => parseInt(current, 10) === firstValue && same, true);
    const result = allSame ? `The team agrees! Score: *${firstValue}*` : 'The team does not agree on the score.';
    const finalString = `${responseString}\n\n${result}`;
    return respond(finalString, false);
};
