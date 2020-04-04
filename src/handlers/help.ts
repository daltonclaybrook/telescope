import { Response } from 'express';
import { respond } from '../helpers/respond';

export default (res: Response) => {
    const response = '- *Start scoping a new issue*: `/scope start <summary>`\n' +
        '- *Add your score for the current issue*: `/scope <score>`\n' +
        '- *Get info about the current issue*: `/scope check`\n' +
        '- *Stop scoping and see results*: `/scope stop`\n' +
        '- *Get help*: `/scope help`';
    return respond(res, response);
};
