"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
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



export const useUserInfo = (id: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get(`/api/user/profile/${id}`);
                setUser(res.data.user);
                setLoading(false);
            } catch (err:any) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchUser();
    }, [id]);

    return { user, loading, error };
};
