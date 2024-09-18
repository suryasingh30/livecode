"use client";

import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import { ReactNode, use, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0pvcnV1c19DX0Jhb3RoIiwidXNlcl9pZCI6IkpvcnV1c19DX0Jhb3RoIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MjY0ODMxNjYsImV4cCI6MTcyNzA4Nzk2Nn0.4NBRId14kF-H0Gob6xuGW-UMpx2R6NX9-BV3WNEpXBg';
// const userId = 'Joruus_C_Baoth';
// const callId = 'nZbDbyX4j9ir';

export default function StreamVideoProvider({children} : {children:ReactNode}) {

  const [videoClient, setVideoClient] = useState<StreamVideoClient>()
  const {user, isLoaded} = useUser();

  useEffect(() => {
    if(!isLoaded || !user)
        return;
    
    if(!apiKey)
        throw new Error('Stream API key missing');

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl
      },
      tokenProvider,
    })

    setVideoClient(client);
  }, [user, isLoaded]);

  if(!videoClient)
    return <Loader/>

  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  );
}
