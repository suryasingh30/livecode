"use client"

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import MeetingSetup from '@/components/MeetingSetup';
import MeetingRoom from '@/components/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';
import Loader from '@/components/Loader';
import Alert from '@/components/Alert';

function Meeting({params: {id}} : {params: {id: string}}) {

  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setSetUpComplete] = useState(false);

  console.log("From meeting: " + id);

  if (!isLoaded || isCallLoading) 
    return <Loader />;

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>

        {!isSetupComplete ? (
          <MeetingSetup setSetUpComplete={setSetUpComplete} />
        ) : (
          <MeetingRoom meetingId={id}/>
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting