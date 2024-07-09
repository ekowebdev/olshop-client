"use client";

import { useEffect, useState } from "react";
import { getSession } from 'next-auth/react';
import pusherPromise from "@/lib/pusher";

const Socket = () => {
    const [totalUnreadData, setTotalUnreadData] = useState(0);
    const [userId, setUserId] = useState(0);

    useEffect(() => {
        const fetchUserId = async () => {
            const session = await getSession();
            if (session && session.user) {
                setUserId(session.user.id);
            }
        };

        fetchUserId();

        if (!userId) return;

        const subscribeToPusher = async () => {
            const pusher = await pusherPromise;
            const channel = pusher.subscribe(`private-Order.User.${userId}`);

            channel.bind('order-user', (e: any) => {
                console.log(e);
                setTotalUnreadData(e.data.total_unread);
            });

            return () => {
                pusher.unsubscribe(`private-Order.User.${userId}`);
            };
        };

        subscribeToPusher();

    }, [userId]);

    return (
        <div>
            <p>{totalUnreadData}</p>
        </div>
    );
};

export default Socket;