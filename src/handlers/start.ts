import { APIGatewayProxyResult } from 'aws-lambda';
import { StartMessageContext } from '../message';
import respond from '../respond';
import store from '../store';

export default async (context: StartMessageContext): Promise<APIGatewayProxyResult> => {
    console.log(`deleting: ${context.summary}`);
    await store.deleteKey(context.summary);
    console.log(`setting current: ${context.summary}`);
    await store.setValueForKey('current', context.summary);
    return respond('Let the scoping begin! Run `/scope stop` to stop scoping.');
};
