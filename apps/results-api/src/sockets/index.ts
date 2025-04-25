/**
 * File: src/sockets/index.ts
 *
 * WebSocket setup for real-time result updates.
 * Configures Socket.IO server with CORS and room-based event handling.
 *
 * Rooms:
 * - competition:{eid} - For all results in a competition
 * - event:{eid} - For results in a specific event
 */

import { Server } from 'socket.io';
import { env } from '../env';
import { logger } from '../logger';

/**
 * Initializes Socket.IO server with proper CORS configuration
 * and sets up event handlers for room management.
 *
 * @param server - HTTP server instance to attach Socket.IO to
 * @returns Configured Socket.IO server instance
 */
export const initializeSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: env.ALLOW_ORIGIN,
            methods: ['GET', 'POST'],
        },
        // Add ping timeout for better disconnection detection
        pingTimeout: 10000,
        pingInterval: 5000,
    });

    io.on('connection', (socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        // Handle joining competition-specific room
        socket.on('join:competition', (competitionEid: string) => {
            socket.join(`competition:${competitionEid}`);
            logger.info(
                `Socket ${socket.id} joined competition:${competitionEid}`
            );

            // Send acknowledgment back to client
            socket.emit('competition:joined', {
                competitionEid,
                timestamp: Date.now(),
            });
        });

        // Handle joining event-specific room
        socket.on('join:event', (eventEid: string) => {
            socket.join(`event:${eventEid}`);
            logger.info(`Socket ${socket.id} joined event:${eventEid}`);

            // Send acknowledgment back to client
            socket.emit('event:joined', {
                eventEid,
                timestamp: Date.now(),
            });
        });

        socket.on('disconnect', (reason) => {
            logger.info(`Socket ${socket.id} disconnected: ${reason}`);
        });

        socket.on('error', (error) => {
            logger.error(`Socket ${socket.id} error: ${error}`);
        });
    });

    return io;
};
