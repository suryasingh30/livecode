"use client"
import MeetingTypeList from '@/components/MeetingTypeList';
import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  // Define state for time and date with proper types
  const [time, setTime] = useState<string>(() => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [date, setDate] = useState<string>(() => new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date()));

  useEffect(() => {
    // Function to update time and date
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setDate(new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now));
    };

    // Update the time once every minute
    const intervalId = setInterval(updateTime, 60000);

    // Run the update once on initial render
    updateTime();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="flex size-full flex-col gap-5 text-black">
      <div className="h-[250px] w-full mt-0 rounded-[20px] bg-hero bg-cover"
        style={{ margin: '-40px 2px -30px 2px' }}>
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <div></div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-4xl">{time}</h1>
            <p className="text-lg pl-3 font-medium text-sky-900 lg:text-xl mb--5">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;
