import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '', 10),
});

const setHashValue = promisify(client.hset).bind(client);
const setValueForKey = promisify(client.set).bind(client);
const getValueForKey = promisify(client.get).bind(client);
const getAllHashValues = promisify(client.hgetall).bind(client);
const quit = client.quit.bind(client);

const deleteKey = async (key: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        client.del(key, (err: Error | null, reply: number) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};

export default {
    setHashValue,
    setValueForKey,
    getValueForKey,
    getAllHashValues,
    deleteKey,
    quit,
};
