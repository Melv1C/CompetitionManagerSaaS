/**
 * File: src/env.ts
 * 
 * Environment configuration for the Results API service.
 * Validates and exports environment variables used throughout the application.
 * Uses zod for runtime validation of environment variables.
 */

import { NODE_ENV } from '@competition-manager/schemas';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.LOCAL),
    PORT: z.string().transform(Number).default('3000'),
    PREFIX: z.string().default('/api'),
    ALLOW_ORIGIN: z.string().default('*'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
}

export const env = parsed.data; 