"use client";

import {
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { ReactNode, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function StreamVideoProvider({children} : {children:ReactNode}) {

  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const {user, isLoaded} = useUser();

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }
    
    if (!apiKey) {
      throw new Error('Stream API key missing');
    }

    // Use getOrCreateInstance to manage the StreamVideoClient instance
    const client = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user: {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [user, isLoaded]);

  if (!videoClient) {
    return <Loader />;
  }

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
}
