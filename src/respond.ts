import { APIGatewayProxyResult } from 'aws-lambda';
import fetch, { Response } from 'node-fetch';

const respond = (text: string, ephemeral?: boolean, statusCode?: number): APIGatewayProxyResult => {
    const isEphemeral = (ephemeral !== undefined) ? ephemeral : true;
    const type = (isEphemeral) ? 'ephemeral' : 'in_channel';
    const payload = {
        response_type: type,
        text,
    };
    return {
        statusCode: statusCode || 200,
        body: JSON.stringify(payload),
    };
};

const respondEmpty = (): APIGatewayProxyResult => {
    return { statusCode: 200, body: '' };
};

const sendDelayedResponse = (text: string, url: string, ephemeral?: boolean): Promise<Response> => {
    console.log(`sending response to url: ${url}`);
    const isEphemeral = (ephemeral !== undefined) ? ephemeral : true;
    const type = (isEphemeral) ? 'ephemeral' : 'in_channel';
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            response_type: type,
        }),
    });
};

export { respond, respondEmpty, sendDelayedResponse };
