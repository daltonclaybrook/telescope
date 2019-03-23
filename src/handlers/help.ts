import { APIGatewayProxyResult } from 'aws-lambda';
import respond from '../respond';

export default (): APIGatewayProxyResult => {
    const response = '- *Start scoping a new issue*: `/scope start <summary>`\n' +
        '- *Add your score for the current issue*: `/scope <score>`\n' +
        '- *Get info about the current issue*: `/scope check`\n' +
        '- *Stop scoping and see results*: `/scope stop`\n' +
        '- *Get help*: `/scope help`';
    return respond(response);
};
