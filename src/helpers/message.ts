import querystring from 'querystring';

interface Message {
    teamId: string;
    channelId: string;
    userId: string;
    userName: string;
    command: string;
    text: string;
    responseURL: string;
}

enum MessageType {
    Start,
    Scope,
    Check,
    Stop,
    Help,
}

interface StartMessageContext {
    type: MessageType.Start;
    summary: string;
}

interface ScopeMessageContext {
    type: MessageType.Scope;
    score: number;
}

interface CheckMessageContext {
    type: MessageType.Check;
}

interface StopMessageContext {
    type: MessageType.Stop;
}

interface HelpMessageContext {
    type: MessageType.Help;
}

type MessageContext = StartMessageContext | ScopeMessageContext | CheckMessageContext | StopMessageContext | HelpMessageContext;

const getMessageContext = (message: Message): MessageContext | null => {
    const components = message.text.split(' ');
    if (components.length < 1) { return null; }
    const command = components[0].toLowerCase();
    const score = parseInt(components[0], 10);

    if (components.length > 1 && command === 'start') {
        const summary = components.slice(1).join(' ');
        return { type: MessageType.Start, summary };
    } else if (command === 'check') {
        return { type: MessageType.Check };
    } else if (command === 'stop') {
        return { type: MessageType.Stop };
    } else if (command === 'help') {
        return { type: MessageType.Help };
    } else if (!isNaN(score)) {
        return { type: MessageType.Scope, score };
    } else {
        return null;
    }
};

const isValidMessage = (message: Message): boolean => {
    return (
        typeof message.teamId === 'string' &&
        typeof message.channelId === 'string' &&
        typeof message.userId === 'string' &&
        typeof message.userName === 'string' &&
        typeof message.command === 'string' &&
        typeof message.text === 'string' &&
        typeof message.responseURL === 'string'
    );
};

const makeMessageFromString = (body: string): Message | null => {
    const object = querystring.parse(body);
    console.log(`parsed slack message: ${JSON.stringify(object)}`);
    return makeMessage(object);
};

const makeMessage = (object: any): Message | null => {
    const message: Message = {
        teamId: object.team_id as string,
        channelId: object.channel_id as string,
        userId: object.user_id as string,
        userName: object.user_name as string,
        command: object.command as string,
        text: object.text as string,
        responseURL: object.response_url as string,
    };
    return isValidMessage(message) ? message : null;
};

export {
    Message,
    MessageType,
    MessageContext,
    StartMessageContext,
    ScopeMessageContext,
    CheckMessageContext,
    StopMessageContext,
    HelpMessageContext,
    makeMessageFromString,
    makeMessage,
    getMessageContext,
};
