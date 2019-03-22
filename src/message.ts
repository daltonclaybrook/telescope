import querystring from 'querystring';

interface Message {
    teamId: string;
    channelId: string;
    userId: string;
    userName: string;
    command: string;
    text: string;
}

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

export { Message, makeMessage };
