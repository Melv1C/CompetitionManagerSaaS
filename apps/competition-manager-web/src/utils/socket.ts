import { io, Socket } from 'socket.io-client';
import { env } from '@/env';
import { Result } from '@competition-manager/schemas';

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
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            autoConnect: true,
        });

        socket.on('connect', () => {
            console.log('Socket connected', socket?.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error', error);
        });

        socket.on('reconnect', (attempt) => {
            console.log(`Socket reconnected after ${attempt} attempts`);
        });
    }

    return socket;
};

/**
 * Join a competition room to receive all result updates for that competition
 * @param competitionEid Competition entity ID
 * @returns Promise that resolves when the server acknowledges the join
 */
export const joinCompetitionRoom = (
    competitionEid: string
): Promise<{ timestamp: number }> => {
    const socket = getSocket();
    socket.emit('join:competition', competitionEid);

    return new Promise((resolve) => {
        socket.once('competition:joined', (data) => {
            console.log(
                'Joined competition room',
                competitionEid,
                'at',
                new Date(data.timestamp)
            );
            resolve(data);
        });
    });
};

/**
 * Join an event room to receive result updates for a specific event
 * @param eventEid Event entity ID
 * @returns Promise that resolves when the server acknowledges the join
 */
export const joinEventRoom = (
    eventEid: string
): Promise<{ timestamp: number }> => {
    const socket = getSocket();
    socket.emit('join:event', eventEid);

    return new Promise((resolve) => {
        socket.once('event:joined', (data) => {
            console.log('Joined event room', eventEid);
            resolve(data);
        });
    });
};

/**
 * Subscribe to new result events
 * @param callback Function to call when a new result is received
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToNewResults = (
    callback: (result: Result) => void
): (() => void) => {
    const socket = getSocket();

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
