"use client";

import { useSession } from "next-auth/react";

export const useUser = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return { status: "loading", user: null };
    }

    if (status === "unauthenticated") {
        return { status: false, user: null };
    }

    return {
        status: true,
        user: session?.user || null,
    };
};
