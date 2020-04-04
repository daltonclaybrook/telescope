import { APIGatewayProxyResult } from 'aws-lambda';
import { StartMessageContext } from '../helpers/message';
import { respond } from '../helpers/respond';
import store from '../helpers/store';

export default async (context: StartMessageContext): Promise<APIGatewayProxyResult> => {
    console.log(`deleting: ${context.summary}`);
    await store.deleteKey(context.summary);
    console.log(`setting current: ${context.summary}`);
    await store.setValueForKey('current', context.summary);
    const response = `Scoping has started for: *${context.summary}*\n` +
        'Add your scope with `/scope <score>`\n' +
        'Check progress with `/scope check`\n' +
        'Finished? run `/scope stop` to see the results.\n' +
        '_Happy scoping!_';
    return respond(response, false);
};
