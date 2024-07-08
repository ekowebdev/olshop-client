import Pusher from 'pusher-js';
import { getSession } from 'next-auth/react';

async function createPusherInstance() {
  const session = await getSession();
  const accessToken = session?.access_token ?? null;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    wsHost: process.env.NEXT_PUBLIC_WEBSOCKET_HOST!,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return pusher;
}

const pusherPromise = createPusherInstance();

export default pusherPromise;
