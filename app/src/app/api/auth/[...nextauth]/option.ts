import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import type { Adapter } from "next-auth/adapters";
import { compare } from "bcrypt";

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
        type: {
          label: "User Type",
          type: "text",
          placeholder: "Type of User",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        let user;
        if (credentials.type == "Organization") {
          user = await db.organization.findUnique({
            where: { email: credentials?.email },
          });
        } else if (credentials.type == "Jobseeker") {
          user = await db.jobSeeker.findUnique({
            where: { email: credentials?.email },
          });
        }
        if (!user) {
          return null;
        }
        const passwordMatch = await compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${user.id}`,
          username: user.username,
          email: user.email,
          role: credentials.type,
          image: user.profilePic ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
        token.id = user.id;
        token.picture = user.image;
      }
      if (trigger === "update" && session.user) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.username = session.user.username;
        token.role = session.user.role;
        token.id = session.user.id;
        token.picture = session.user.image;
      }
      return token;
    },
    async session({ trigger, newSession, session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      if (trigger === "update" && newSession?.name) {
        // You can update the session in the database if it's not already updated.
        // await adapter.updateUser(session.user.id, { name: newSession.name })
        // Make sure the updated value is reflected on the client
        session.user.username = newSession.user.role;
        session.user.role = newSession.user.role;
        session.user.id = newSession.user.role;
        session.user.image = newSession.user.role;
      }
      return session;
    },
  },
};
