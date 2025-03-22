import NextAuth from "next-auth";

declare module "next-auth"{
    interface User{
        username: string
        firstname: string;
        lastname: string;
    }
    interface Session{
        user: User & {
            username: string
            firstname: string;
            lastname: string;
        }
        token: {
            username: string
            firstname: string;
            lastname: string;
        }
    }
}