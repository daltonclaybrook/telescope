import { Response } from 'express';
import { Message, ScopeMessageContext } from 'src/helpers/message';
import { respond, respondEmpty, sendDelayedResponse } from '../helpers/respond';
import store from '../helpers/store';

export default async (res: Response, message: Message, context: ScopeMessageContext): Promise<void> => {
    const summary = await store.getValueForKey('current');
    if (!summary || summary.length <= 0) {
        return respond(res, 'You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }
    await store.setHashValue(summary, message.userId, context.score.toString());
    await sendDelayedResponse(`<@${message.userId}> has added a score!`, message.responseURL, false);
    return respondEmpty(res);
};
