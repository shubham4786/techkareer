// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | number;
      role: string;
      email: string;
      username: string;
      image: string | null;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
    username: string;
    id: string | number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string | number;
    role: string;
    username: string;
  }
}
