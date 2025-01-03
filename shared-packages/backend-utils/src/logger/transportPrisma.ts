import TransportStream from 'winston-transport';
import { prisma } from '@competition-manager/prisma';
import { LogInfo, LogInfo$, SERVICE } from '@competition-manager/schemas';
  
export class PrismaTransport extends TransportStream {
    private service: SERVICE;

    constructor(opts: any) {
        super(opts);
        this.service = opts.service;
    }

    async log(logInfo: LogInfo, callback: () => void) {
        setImmediate(() => this.emit('logged', logInfo));
        const { level, status, message, path, userId, metadata } = LogInfo$.parse(logInfo);
        try {
            await prisma.log.create({
                data: {
                    service: this.service,
                    level: level,
                    status: status || null,
                    message,
                    path: path || null,
                    userId: userId || null,
                    date: new Date(),
                    metadata: metadata || null,
                },
            });
        } catch (error) {
            console.error('Failed to save log to database:', error);
        }
        callback();
    }
}