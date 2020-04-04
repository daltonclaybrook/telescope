import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '', 10),
});

const setHashValue = promisify(client.hset).bind(client);
const getHashValue = promisify(client.hget).bind(client);
const getAllHashValues = promisify(client.hgetall).bind(client);

const setChannelField = async (channelId: string, field: string, value: string): Promise<number> =>
    setHashValue(channelId, field, value);

const getChannelField = async (channelId: string, field: string): Promise<string> =>
    getHashValue(channelId, field);

const getAllChannelFields = async (channelId: string): Promise<{[key: string]: string}> =>
    getAllHashValues(channelId);

const deleteAllFieldsForChannel = async (channelId: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        client.del(channelId, (err: Error | null, reply: number) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};

export default {
    setChannelField,
    getChannelField,
    getAllChannelFields,
    deleteAllFieldsForChannel,
};
