import { io, Socket } from 'socket.io-client';
import { Result } from '@competition-manager/schemas';
import { env } from '@/env';

/**
 * Socket singleton instance to avoid multiple connections
 */
let socket: Socket | null = null;

/**
 * Get or create a socket.io connection
 * @returns Socket.io client instance
 */
export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(env.VITE_SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Log connection events in development
        socket.on('connect', () => {
            console.log('Socket connected', socket?.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', () => {
            console.error('Socket connection error', );
        });
    }

    return socket;
};

/**
 * Joins a competition room to receive result updates for that competition
 * @param competitionEid Competition unique identifier
 */
export const joinCompetitionRoom = (competitionEid: string): void => {
    const socket = getSocket();
    socket.emit('join:competition', competitionEid);
    console.log(`Joined competition room: ${competitionEid}`);
};

/**
 * Joins an event room to receive result updates for a specific event
 * @param eventEid Event unique identifier
 */
export const joinEventRoom = (eventEid: string): void => {
    const socket = getSocket();
    socket.emit('join:event', eventEid);
    console.log(`Joined event room: ${eventEid}`);
};

/**
 * Subscribe to new result events for a competition
 * @param callback Function to be called when a new result is received
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToNewResults = (
    callback: (result: Result) => void
): (() => void) => {
    const socket = getSocket();

    console.log('Subscribing to new results...');

    socket.on('result:new', callback);

    return () => {
        socket.off('result:new', callback);
    };
};

/**
 * Disconnect socket connection
 */
export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
