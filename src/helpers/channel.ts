import store from '../helpers/store';

type Scopes = { [key: string]: number };

interface ChannelScopes {
    summary: string;
    userScopes: Scopes;
}

const fetchScopesForChannel = async (channelId: string): Promise<ChannelScopes | null> => {
    const allFields = await store.getAllChannelFields(channelId);
    if (!allFields || Object.keys(allFields).length === 0 || !allFields.summary || allFields.summary.length <= 0) {
        return null;
    }

    const summary = allFields.summary;
    const userScopes: Scopes = {};
    Object.keys(allFields).forEach((key) => {
        if (!key.startsWith('scope.')) { return }
        const userId = key.split('.')[1];
        const scope = parseInt(allFields[key], 10);
        userScopes[userId] = scope;
    });

    return { summary, userScopes };
};

const fetchSummaryForChannel = async (channelId: string): Promise<string | null> => {
    const summary = await store.getChannelField(channelId, 'summary');
    return (summary) ? summary : null;
};

const setUserScopeForChannel = async (channelId: string, userId: string, scope: number): Promise<void> => {
    const key = `scope.${userId}`;
    await store.setChannelField(channelId, key, scope.toString());
};

const recreateChannelWithSummary = async (channelId: string, summary: string): Promise<void> => {
    await store.deleteAllFieldsForChannel(channelId);
    await store.setChannelField(channelId, 'summary', summary);
};

const deleteChannel = async (channelId: string): Promise<void> => {
    await store.deleteAllFieldsForChannel(channelId);
};

export {
    ChannelScopes,
    fetchScopesForChannel,
    fetchSummaryForChannel,
    setUserScopeForChannel,
    recreateChannelWithSummary,
    deleteChannel,
};
