import { cn } from '@/lib/utils';
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import React, { useState } from 'react';
import Socketwrapper from '@/components/SocketWrapper';
import Room from '@/components/Room';
import { useUser } from '@clerk/nextjs'
import { Loader, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';

// type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

interface MeetingRoomProps {
  meetingId: string; 
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ meetingId }) => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  // const [layout, setLayout] = useState<CallLayoutType>('grid')
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  const username = user?.username ? user.username : 'Guest';
  // const meetingId = user?.id || 'Guest';

  // console.log("Meeting room: " + meetingId);

  if (callingState !== CallingState.JOINED) return <Loader />;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      {/* top bar */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 p-1  flex items-center justify-between z-10"> 
      <div className="flex items-center ml-4 space-x-3">
          <img
            src="/icons/logo1.svg" 
            alt="Logo"
            className="h-10 w-10 object-contain" // size of the logo here
          />
          <span className="text-xl font-semibold">Interview Nest</span>
        </div>
       
      </header>
      <div className="relative flex size-full items-center mt-5 ">
        {/* Grid layout for meeting room */}
        <div className="flex size-full max-w-[1300px] items-center grid grid-cols-5 gap-4">
          {/* Left Side (4x3 Grid) IDE */}
          <div className="col-span-4 row-span-4 bg-gray-800 rounded-lg p-4">
            {/* ide here */}
            <div>
              {/* <img
                src="/icons/logo1.svg"
                alt="Your Photo"
                className="h-10 w-10 object-contain"
              />
               <span className="text-xl font-semibold">Interview Nest</span> */}
              <Socketwrapper username={username} meetingId={meetingId}>
                <Room socket={Socketwrapper} username={username} meetingId={meetingId}/>
              </Socketwrapper>
            </div>
          </div>

          {/* Right Side (5x2 Grid) for participants */}
          <div className="col-span-1 row-span-5 flex flex-col gap-4">
            {/* Each participant will take a 1x2 grid space */}
            <PaginatedGridLayout />
          </div>
        </div>

        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Call controls at the bottom */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={() => router.push(`/`)} />
        <CallStatsButton />
        <button
          onClick={() => setShowParticipants((prev) => !prev)}
        >
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
