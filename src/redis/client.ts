import { createClient } from 'redis';

// const REDIS_HOST = process.env.REDIS_HOST ?? '';
const redisClient = createClient();

export { redisClient };
