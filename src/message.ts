import querystring from 'querystring';

interface Message {
    teamId: string;
    channelId: string;
    userId: string;
    userName: string;
    command: string;
    text: string;
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
        typeof message.text === 'string'
    );
};

const makeMessage = (body: string): Message | null => {
    const query = querystring.parse(body);
    const message: Message = {
        teamId: query.team_id as string,
        channelId: query.channel_id as string,
        userId: query.user_id as string,
        userName: query.user_name as string,
        command: query.command as string,
        text: query.text as string,
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
    makeMessage,
    getMessageContext,
};
