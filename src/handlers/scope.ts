import { APIGatewayProxyResult } from 'aws-lambda';
import { Message, ScopeMessageContext } from 'src/message';
import respond from '../respond';
import store from '../store';

export default async (message: Message, context: ScopeMessageContext): Promise<APIGatewayProxyResult> => {
    const summary = await store.getValueForKey('current');
    if (summary.length <= 0) {
        return respond('You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }
    await store.setHashValue(summary, message.userId, context.score.toString());
    return respond(`<@${message.userId}> has recorded a score!`, false);
};
