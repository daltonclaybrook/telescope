import { APIGatewayProxyResult } from 'aws-lambda';
import store from './store';

type Handler = (event: { body: string; }) => Promise<APIGatewayProxyResult>;

export default (lambdaHandler: Handler) => {
    const user = encodeURIComponent('dalton');
    // const user = encodeURIComponent('carolyn');

    const userId = encodeURIComponent('abc123');
    // const userId = encodeURIComponent('def456');

    const text = encodeURIComponent('start Do the thing');
    // const text = encodeURIComponent('8');
    // const text = encodeURIComponent('stop');

    const testBody = `team_id=abc123&channel_id=abc123&user_id=${userId}&user_name=${user}&command=%2Fscope&text=${text}`;

    console.log('calling handler...');
    lambdaHandler({ body: testBody }).then((result: APIGatewayProxyResult) => {
        console.log(JSON.stringify(result, null, 2));
        store.quit();
    }).catch((reason) => {
        console.log(`failed with reason: ${reason}`);
        store.quit();
    });
};
