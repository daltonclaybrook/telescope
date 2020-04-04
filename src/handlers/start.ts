import { Response } from 'express';
import { StartMessageContext } from '../helpers/message';
import { respond } from '../helpers/respond';
import { recreateChannelWithSummary } from '../helpers/channel';

export default async (res: Response, context: StartMessageContext): Promise<void> => {
    console.log(`deleting: ${context.summary}\nsetting current: ${context.summary}`);
    await recreateChannelWithSummary(context.channelId, context.summary)
    const response = `Scoping has started for: *${context.summary}*\n` +
        'Add your scope with `/scope <score>`\n' +
        'Check progress with `/scope check`\n' +
        'Finished? run `/scope stop` to see the results.\n' +
        '_Happy scoping!_';
    return respond(res, response, false);
};
