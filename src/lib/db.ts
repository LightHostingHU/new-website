import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if  (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const db = prisma

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserBan(userId: number) {
    return await prisma.bans.findFirst({
        where: {
            user_id: userId
        }
    })
}
