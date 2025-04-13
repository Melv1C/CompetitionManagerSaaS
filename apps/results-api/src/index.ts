/**
 * File: src/index.ts
 * 
 * Main application entry point for the Results API service.
 * Sets up Express server with Socket.IO for real-time updates.
 * 
 * Features:
 * - Environment variable validation
 * - CORS middleware
 * - i18n support
 * - Socket.IO integration
 * - API routes for result management
 */

import 'dotenv/config';
import express from "express";
import { createServer } from 'http';
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";

import { corsMiddleware } from '@competition-manager/backend-utils';
import { backendTranslations } from "@competition-manager/translations";

import routes from './routes';
import { env } from "./env";
import { initializeSocket } from './sockets';
import { logger } from './logger';

// Initialize i18next with backend translations
i18next.use(Backend).use(middleware.LanguageDetector).init({
    resources: backendTranslations,
    fallbackLng: 'en'
});

// Create Express app and HTTP server
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Configure Express middleware
app.set('io', io);
app.use(express.json());
app.use(corsMiddleware);
app.use(middleware.handle(i18next));

// Mount API routes
app.use(`${env.PREFIX}/results`, routes);

// Start server
server.listen(env.PORT, () => {
    logger.info(`Results API server is running on port ${env.PORT}`);
}); 