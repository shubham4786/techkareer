"use client";

import { useSession } from "next-auth/react";
import axios from "axios";

import useSWR from 'swr';

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
    const { data: user, error } = useSWR(`/api/user/profile/${id}`, async (url: string) => {
        const res = await axios.get(url);
        return res.data.user;
    });

    return {
        user,
        loading: !user && !error,
        error: error,
    };
};
