// src/lib/auth/auth-options.ts
import { NextAuthOptions, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter package may not be installed in this workspace during static analysis.
// If you have `@next-auth/prisma-adapter` or `@auth/prisma-adapter` installed, replace the adapter assignment below.
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // Return a minimal user object accepted by NextAuth (id required)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session, token }) {
      // Map token fields to session.user. Ensure all required fields exist.
      // Ensure all session.user fields are strings to match our type augmentation
      session.user = {
        id: String(token.id ?? ""),
        name: String((token.name as string) ?? session.user?.name ?? ""),
        email: String((token.email as string) ?? session.user?.email ?? ""),
        image: String((token.picture as string) ?? session.user?.image ?? ""),
        role: String((token as JWT).role ?? session.user?.role ?? ""),
      } as Session["user"];

      return session;
    },
    async jwt({ token, user }) {
      const t = token as JWT;

      // If user just signed in, include their id on the token
      if (user) {
        t.id = (user as User).id;
        t.name = (user as User).name ?? t.name;
        t.email = (user as User).email ?? t.email;
        t.picture = (user as User).image ?? t.picture;
      }

      // Try to populate token from database if email exists
      if (t.email) {
        const dbUser = await prisma.user.findFirst({
          where: { email: t.email as string },
        });

        if (dbUser) {
          t.id = dbUser.id;
          t.name = dbUser.name ?? t.name;
          t.picture = dbUser.image ?? t.picture;
          t.role = dbUser.role;
        }
      }

      return t;
    },
  },
};
