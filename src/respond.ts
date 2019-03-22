import { APIGatewayProxyResult } from 'aws-lambda';

export default (text: string, ephemeral?: boolean, statusCode?: number): APIGatewayProxyResult => {
    const type = (ephemeral || true) ? 'ephemeral' : 'in_channel';
    const payload = {
        response_type: type,
        text,
    };
    return {
        statusCode: statusCode || 200,
        body: JSON.stringify(payload),
    };
};