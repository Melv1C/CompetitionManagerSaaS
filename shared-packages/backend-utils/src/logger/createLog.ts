import { prisma } from "@competition-manager/prisma"
import { CreateLog, SERVICE, NODE_ENV } from "@competition-manager/schemas"
import winston from "winston"
import { PrismaTransport } from "./transportPrisma"
import { isNodeEnv } from "../isNodeEnv";

const { combine, timestamp, json } = winston.format;

export const createLogger = (service: SERVICE) => {
    return winston.createLogger({
        level: 'silly',
        format: combine(
            timestamp(),
            json(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
                const dateTime = new Date(timestamp as string).toLocaleString(
                    'fr-BE',
                    {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }
                );
                return `${dateTime} ${service} [${level.toUpperCase()}]: ${message}${Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : ''}`
            })
        ),
        transports: [
            new PrismaTransport({ service }),
            ...(isNodeEnv(NODE_ENV.LOCAL) ? 
                [new winston.transports.Console()] 
            : 
                [
                    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                    new winston.transports.File({ filename: 'logs/silly.log', format: combine(winston.format((info) => info.level === 'silly' ? info : false)(), timestamp(), json(), winston.format.printf(({ level, message, timestamp, ...meta }) => {
                        const dateTime = new Date(timestamp as string).toLocaleString(
                            'fr-BE',
                            {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            }
                        );
                        return `${dateTime} ${service} [${level.toUpperCase()}]: ${message}${Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : ''}`
                    })) })
                ])
            
        ]
    });
}

export const createLog = async (log: CreateLog) => {
    await prisma.log.create({
        data: {
            ...log,
            date: new Date()
        }
    })
}

