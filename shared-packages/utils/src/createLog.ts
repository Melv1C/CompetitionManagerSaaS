import { prisma } from "@competition-manager/prisma"
import { CreateLog } from "@competition-manager/schemas"

export const createLog = async (log: CreateLog) => {
    await prisma.log.create({
        data: {
            ...log,
            date: new Date()
        }
    })
}