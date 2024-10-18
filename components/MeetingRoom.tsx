import { cn } from '@/lib/utils';
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import Socketwrapper from '@/components/SocketWrapper';
import Room from '@/components/Room';
import { useUser } from '@clerk/nextjs';
import { Loader, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Image from 'next/image';

interface MeetingRoomProps {
  meetingId: string;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ meetingId }) => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isPersonalRoom = Boolean(searchParams.get('personal'));
  const [showParticipants, setShowParticipants] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false); // State for animation
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  const username = user?.username || 'Guest';

  useEffect(() => {
    // Add a delay to trigger animation for Users button
    const timeout = setTimeout(() => setButtonVisible(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (callingState !== CallingState.JOINED) return <Loader />;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 p-3 flex items-center justify-between z-10">
        <div className="flex items-center ml-4 space-x-3">
          <Image
            src="/icons/logo1.svg"
            alt="Logo"
            height={38}
            width={38}
            className="object-contain"
          />
          <span className="text-xl font-semibold">Interview Nest</span>
        </div>
      </header>

      <div className="relative flex flex-col md:flex-row h-[calc(100vh-86px)]">
        {/* Left Side (Socketwrapper) - 3/4 width with margin */}
        <div className="w-full md:w-3/4 bg-gray-800 rounded-lg p-4 mt-8 ml-2">
          <Socketwrapper username={username} meetingId={meetingId}>
            <Room socket={Socketwrapper} username={username} meetingId={meetingId} />
          </Socketwrapper>
        </div>

        {/* Right Side (PaginatedGridLayout) */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <PaginatedGridLayout />
        </div>
      </div>

      {/* Call controls at the bottom */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={() => router.push('/')} />
        <CallStatsButton />
        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className={`p-2 transition-transform duration-500 ${
            buttonVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>

      {/* Participants list overlay with sliding effect */}
      <div
        className={cn(
          'absolute top-0 right-0 h-full w-full md:w-1/4 bg-gray-800 z-20 transition-transform duration-500',
          {
            'translate-x-0': showParticipants,
            'translate-x-full': !showParticipants,
          }
        )}
      >
        <CallParticipantsList onClose={() => setShowParticipants(false)} />
      </div>
    </section>
  );
};

export default MeetingRoom;
