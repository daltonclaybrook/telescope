import { APIGatewayProxyResult } from 'aws-lambda';
import respond from '../respond';

export default (): APIGatewayProxyResult => {
    const response = 'To start scoping a new issue, run `/scope start <summary>`\n' +
        'For example: `/scope start Drop Texture Support`\n\n' +
        'To submit your score for the current issue, run `/scope <score>`\n' +
        'For example: `/scope 13`\n\n' +
        'To stop scoping and see results, run `/scope stop`\n\n' +
        'To get help, run... well... you already know how to do that. ;)';
    return respond(response);
};
