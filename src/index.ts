import handlers from './handlers';
import { getMessageContext, makeMessage, MessageType } from './helpers/message';
import { respond } from './helpers/respond';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.urlencoded());

const PORT = 3000;

interface Event {
    body?: string;
}

app.post('/', (req: Request, res: Response) => {
    const body = req.body.urlencoded;

    console.log('handling...');
    const message = makeMessage(body);
    if (!message) {
        return respond(res, `invalid message payload`, true, 400);
    }

    const dontUnderstand = 'I don\'t understand. Try typing `/scope help` for suggestions.';
    const context = getMessageContext(message);
    if (!context) {
        return respond(res, dontUnderstand);
    }

    switch (context.type) {
        case MessageType.Start:
            console.log('handling start...');
            return handlers.start(res, context);
        case MessageType.Scope:
            console.log('handling scope...');
            return handlers.scope(res, message, context);
        case MessageType.Check:
            console.log('handling check...');
            return handlers.check(res);
        case MessageType.Stop:
            console.log('handling stop...');
            return handlers.stop(res);
        case MessageType.Help:
            console.log('handling help...');
            return handlers.help(res);
        default:
            return respond(res, dontUnderstand);
    }
});

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
