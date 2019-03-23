import { APIGatewayProxyResult } from 'aws-lambda';
import { respond } from '../respond';
import store from '../store';

export default async (): Promise<APIGatewayProxyResult> => {
    const summary = await store.getValueForKey('current');
    if (!summary || summary.length <= 0) {
        return respond('You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }
    const responses = await store.getAllHashValues(summary);
    if (!responses || Object.keys(responses).length === 0) {
        return respond(`No one scoped the issue: ${summary}`);
    }

    const firstValue = parseInt(Object.values(responses)[0], 10);
    const allScores = Object.keys(responses)
        .map((userId) => `<@${userId}>: *${responses[userId]}*`)
        .join('\n');

    const allSame = Object.values(responses)
        .reduce((same, current) => parseInt(current, 10) === firstValue && same, true);

    if (allSame) {
        // only delete the issue if scoring has finished successfully
        await store.deleteKey(summary);
        await store.deleteKey('current');
    }

    const disagreeText = 'The team does not agree on the score. Feel free to update your score with `/scope <score>` and run `/scope stop` again.';
    const result = allSame ? `The team agrees! Score: *${firstValue}*` :  disagreeText;
    const finalString = `Results for: *${summary}*\n\n${allScores}\n\n${result}`;
    return respond(finalString, false);
};
