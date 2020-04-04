import { Response } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';

const respond = (res: Response, text: string, ephemeral?: boolean, statusCode?: number) => {
    const isEphemeral = (ephemeral !== undefined) ? ephemeral : true;
    const type = (isEphemeral) ? 'ephemeral' : 'in_channel';
    res.status(statusCode || 200)
        .json({
            response_type: type,
            text,
        });
};

const respondEmpty = (res: Response) => {
    res.status(200).send('');
};

const sendDelayedResponse = (text: string, url: string, ephemeral?: boolean): Promise<FetchResponse> => {
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
