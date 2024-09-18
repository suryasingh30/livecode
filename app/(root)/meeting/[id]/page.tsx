"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';
import Loader from '@/components/Loader';

function Meeting({params: {id}} : {params: {id: string}}) {

  const { user, isLoaded } = useUser();
  const [isSetupComplete, setSetUpComplete] = useState(false);
  const {call, isCallLoading} = useGetCallById(id);

  if(!user || isCallLoading)
    return <Loader/>

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
           {!isSetupComplete ? (
            <MeetingSetup setSetUpComplete={setSetUpComplete}/>
           ) : (
            <MeetingRoom/>
           )}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting