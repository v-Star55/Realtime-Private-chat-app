import { Redis } from "@upstash/redis"

export const redis=Redis.fromEnv();


// setting up redis 