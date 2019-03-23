import { APIGatewayProxyResult } from 'aws-lambda';
import respond from '../respond';
import store from '../store';

export default async (): Promise<APIGatewayProxyResult> => {
    const summary = await store.getValueForKey('current');
    if (!summary || summary.length <= 0) {
        return respond('You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }

    let result = `Scoping issue: *${summary}*\n\n`;
    const responses = await store.getAllHashValues(summary);
    if (!responses || Object.keys(responses).length === 0) {
        result += 'No one has added a score yet.';
        return respond(result);
    }

    const folks = Object.keys(responses).map((userId) => `<@${userId}>`).join(', ');
    result += `These folks have added scores:\n${folks}`;
    return respond(result);
};
