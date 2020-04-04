import { Response } from 'express';
import { respond } from '../helpers/respond';
import store from '../helpers/store';

export default async (res: Response): Promise<void> => {
    const summary = await store.getValueForKey('current');
    if (!summary || summary.length <= 0) {
        return respond(res, 'You\'re not scoping anything right now. Start by running `/scope start <summary>`.');
    }

    let result = `Scoping issue: *${summary}*\n\n`;
    const responses = await store.getAllHashValues(summary);
    if (!responses || Object.keys(responses).length === 0) {
        result += 'No one has added a score yet.';
        return respond(res, result);
    }

    const folks = Object.keys(responses).map((userId) => `<@${userId}>`).join(', ');
    result += `These folks have added scores:\n${folks}`;
    return respond(res, result);
};
