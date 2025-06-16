// src/app/api/auth/[...nextauth]/route.ts
// this file handles authentication using NextAuth.js with Prisma as the adapter and bcrypt for password hashing.
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { prisma } from '@/lib/prisma';


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && credentials?.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.sub = user.id; // Store user ID in the JWT token
        token.role = user.role; // Store user role in the JWT token
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session.user) {
        if (token.sub && session.user) {
          session.user.id = token.sub; // Ensure user ID is set in the session
        }
      }
      if (token.role) {
        session.user.role = token.role as string; // Ensure user role is set in the session
      }
      return session;
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
