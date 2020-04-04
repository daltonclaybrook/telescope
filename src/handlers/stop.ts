import { Response } from 'express';
import { respond } from '../helpers/respond';
import { fetchScopesForChannel, deleteChannel } from '../helpers/channel';
import { StopMessageContext } from '../helpers/message';

export default async (res: Response, context: StopMessageContext): Promise<void> => {
    const channel = await fetchScopesForChannel(context.channelId);
    if (!channel) {
        return respond(res, 'You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }
    if (Object.keys(channel.userScopes).length === 0) {
        return respond(res, `No one scoped the issue: ${channel.summary}`);
    }

    const firstValue = Object.values(channel.userScopes)[0];
    const allScores = Object.keys(channel.userScopes)
        .map((userId) => `<@${userId}>: *${channel.userScopes[userId]}*`)
        .join('\n');

    const allSame = Object.values(channel.userScopes)
        .reduce((same, current) => same && current === firstValue, true);

    if (allSame) {
        // only delete the issue if scoring has finished successfully
        await deleteChannel(context.channelId);
    }

    const disagreeText = 'The team does not agree on the score. Feel free to update your score with `/scope <score>` and run `/scope stop` again.';
    const result = allSame ? `The team agrees! Score: *${firstValue}*` :  disagreeText;
    const finalString = `Results for: *${channel.summary}*\n\n${allScores}\n\n${result}`;
    return respond(res, finalString, false);
};
