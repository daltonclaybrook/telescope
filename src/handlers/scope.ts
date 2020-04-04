import { APIGatewayProxyResult } from 'aws-lambda';
import { Message, ScopeMessageContext } from 'src/helpers/message';
import { respond, respondEmpty, sendDelayedResponse } from '../helpers/respond';
import store from '../helpers/store';

export default async (message: Message, context: ScopeMessageContext): Promise<APIGatewayProxyResult> => {
    const summary = await store.getValueForKey('current');
    if (!summary || summary.length <= 0) {
        return respond('You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }
    await store.setHashValue(summary, message.userId, context.score.toString());
    await sendDelayedResponse(`<@${message.userId}> has added a score!`, message.responseURL, false);
    return respondEmpty();
};
