"use client";
import MeetingTypeList from '@/components/MeetingTypeList';
import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  // State for time and date
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Function to update time and date
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now));
    };

    // Update time and date immediately and set an interval to update every minute
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <section className="flex size-full flex-col gap-5 text-black">
      <div className="h-[250px] w-full mt-0 rounded-[20px] bg-hero bg-cover" style={{ margin: '-40px 2px -30px 2px' }}>
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <div></div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-4xl">{currentTime}</h1>
            <p className="text-lg pl-3 font-medium text-sky-900 lg:text-xl mb--5">{currentDate}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;
