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
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        // Handle joining competition-specific room
        socket.on('join:competition', (competitionEid: string) => {
            socket.join(`competition:${competitionEid}`);
        });

        // Handle joining event-specific room
        socket.on('join:event', (eventEid: string) => {
            socket.join(`event:${eventEid}`);
        });
    });

    return io;
}; 