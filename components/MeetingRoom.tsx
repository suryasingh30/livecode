import { cn } from '@/lib/utils';
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import React, { useState } from 'react';
import Socketwrapper from '@/components/SocketWrapper';
import Room from '@/components/Room';
import { useUser } from '@clerk/nextjs'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import { LayoutList, Loader, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';

// type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  // const [layout, setLayout] = useState<CallLayoutType>('grid')
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  const username = user?.username ? user.username : 'Guest';
  const meetingId = user?.id || 'Guest';

  if (callingState !== CallingState.JOINED) return <Loader />;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        {/* Grid layout for meeting room */}
        <div className="flex size-full max-w-[1000px] items-center grid grid-cols-5 gap-4">
          {/* Left Side (4x3 Grid) IDE */}
          <div className="col-span-3 row-span-4 bg-gray-800 rounded-lg p-4">
            {/* ide here */}
            <div>
              {/* <img
                src="/icons/logo.svg"
                alt="Your Photo"
                className="h-full w-full object-cover rounded-lg"
              /> */}
              <Socketwrapper username={username} meetingId={meetingId}>
                <Room socket={Socketwrapper} username={username} meetingId={meetingId}/>
              </Socketwrapper>
            </div>
          </div>

          {/* Right Side (5x2 Grid) for participants */}
          <div className="col-span-2 row-span-5 flex flex-wrap gap-4">
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
