import { Response } from 'express';
import { Message, ScopeMessageContext } from '../helpers/message';
import { respond, respondEmpty, sendDelayedResponse } from '../helpers/respond';
import { fetchSummaryForChannel, setUserScopeForChannel } from '../helpers/channel';

export default async (res: Response, message: Message, context: ScopeMessageContext): Promise<void> => {
    const summary = await fetchSummaryForChannel(context.channelId);
    if (!summary || summary.length <= 0) {
        return respond(res, 'You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }
    await setUserScopeForChannel(context.channelId, message.userId, context.score);
    await sendDelayedResponse(`<@${message.userId}> has added a score!`, message.responseURL, false);
    return respondEmpty(res);
};
