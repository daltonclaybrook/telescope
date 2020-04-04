import { Response } from 'express';
import { respond } from '../helpers/respond';
import { CheckMessageContext } from '../helpers/message';
import { fetchScopesForChannel } from '../helpers/channel';

export default async (res: Response, context: CheckMessageContext): Promise<void> => {
    const channelScopes = await fetchScopesForChannel(context.channelId);
    if (!channelScopes) {
        return respond(res, 'You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }

    let result = `Scoping issue: *${channelScopes.summary}*\n\n`;
    const users = Object.keys(channelScopes.userScopes);

    if (users.length === 0) {
        result += 'No one has added a score yet.';
        return respond(res, result);
    }

    const folks = users.join(', ');
    result += `These folks have added scores:\n${folks}`;
    return respond(res, result);
};
