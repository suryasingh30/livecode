"use client"

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React from 'react';

// Table component for displaying meeting details
const Table = ({ title, description }: { title: string, description: string }) => (
  <div>
    <h1>{title}</h1>
    <h3>{description}</h3>
  </div>
);

// Renamed the function to start with an uppercase letter
export default function PersonalRoomPage() {

  const router = useRouter();
  const { user } = useUser();
  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  const client = useStreamVideoClient();
  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {

    if (!client || !user) return;

    const newCall = client?.call("default", meetingId!);
    
    // If no call exists, create a new one
    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`meeting/${meetingId}?personal=true`);
  };

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        Personal Room
      </h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title='Topic' description={`${user?.username}'s Meeting Room`} />
        <Table title='Meeting ID' description={meetingId!} />
        <Table title='Invite' description={meetingLink} />
      </div>
      <div className='flex gap-5'>
        <Button className='bg-blue-1' onClick={startRoom}>
          Start Meeting
        </Button>
        <Button className='bg-dark-3' onClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({ title: "Link Copied" });
        }}>
          Copy Invitation
        </Button>
      </div>
    </section>
  );
}
