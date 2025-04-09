import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { toast } from "sonner";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Email or Username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          },
        });

        if (!existingUser) {
          throw new Error("Felhasználó nem található");
          return null;
        }

        if (!existingUser.password) {
          return null;
        }

        console.log(existingUser)
        if (!existingUser.verified) {
          // toast("Az email cím nincs megerősítve!")
          throw new Error("Az email cím nincs megerősítve");
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        const activeBan = await db.bans.findFirst({
          where: {
            user_id: existingUser.id,
          },
        });

        if (activeBan) {
          throw new Error(`Ki vagy tiltva az oldalról ezzel az indokkal: ${activeBan.reason}`);

        }


        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          firstname: existingUser.firstname,
          lastname: existingUser.lastname,
          name: `${existingUser.firstname} ${existingUser.lastname}`,
          email: existingUser.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        return {
          ...token,
          username: user.username,
          name: user.firstname + " " + user.lastname,
          userid: user.id,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          name: token.name,
          id: token.userid,
        },
      };
    },
  },
};


export async function getDiscordToken(code: string) {
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(
      Object.entries({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/discord`,
      }).filter(([_, value]) => value !== undefined) as [string, string][]
    ),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    throw new Error(`Discord token error: ${tokenData.error}`);
  }

  return tokenData;
}

export async function getDiscordUser(accessToken: string) {
  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userData = await userResponse.json();

  if (!userResponse.ok) {
    throw new Error(`Discord user data error: ${userData.error}`);
  }

  return userData;
}

export function createJwtToken(userData: any) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(
    {
      id: userData.id,
      email: userData.email,
      username: userData.username,
      avatar: userData.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

