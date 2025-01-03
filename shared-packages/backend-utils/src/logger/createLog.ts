import { prisma } from "@competition-manager/prisma"
import { CreateLog, SERVICE } from "@competition-manager/schemas"
import winston from "winston"
import { PrismaTransport } from "./transportPrisma"

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
                return `${dateTime} ${service} [${level.toUpperCase()}]: ${message}\n${JSON.stringify(meta, null, 2)}`
            })
        ),
        transports: [
            new PrismaTransport({ service }),
            
            new winston.transports.Console({ level: "warning" })
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

