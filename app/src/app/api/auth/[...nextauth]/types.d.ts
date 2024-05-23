import { DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: number;
        email: string;
        profilePic: string | null;
        password: string | null;
        onboarded: boolean;
        type: number;
        provider: string;
    }
}