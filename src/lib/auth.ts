import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { toast } from "sonner";

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
        identifier: { label: "Email or Username", type: "text", placeholder: "Email or Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log('credentials', credentials);

        if (!credentials?.identifier || !credentials?.password) {
          console.log('Lefut')
          return null;
        }

        console.log('Left')

        const existingUser = await db.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier }
            ],
          },
        });

        if (!existingUser) {
          toast("Felhasználó nem található");
          return  null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          firstname: existingUser.firstname,
          lastname: existingUser.lastname,
          name: `${existingUser.firstname} ${existingUser.lastname}`,
          email: existingUser.email,
          image: null,
        };
      },    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        return {
          ...token, 
          username: user.username,
          name: user.firstname + ' ' + user.lastname,
          userid: user.id
        }
      }

      return token
    },
    async session({session, token}) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          name: token.name,
          userid: token.userid       
        }
      }
    }
  }
};