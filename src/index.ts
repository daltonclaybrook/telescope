import { APIGatewayEvent, APIGatewayEventRequestContext, APIGatewayProxyResult } from 'aws-lambda';

exports.handler = async (event: APIGatewayEvent, context: APIGatewayEventRequestContext): Promise<APIGatewayProxyResult> => {
    const response = JSON.stringify(event);
    return {
        statusCode: 200,
        body: response,
    };
};
