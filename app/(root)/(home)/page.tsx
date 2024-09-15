import MeetingTypeList from '@/components/MeetingTypeList';
import React from 'react'

function Home() {

  const now = new Date();

  const time = now.toLocaleDateString('en-US', {hour: '2-digit', minute: '2-digit'});
  const date = (new Intl.DateTimeFormat('en-US', {dateStyle: 'full'})).format(now);

  return (
    <section className="flex size-full flex-col gap-5 text-black">
      <div className="h-[250px] w-full mt-0 rounded-[20px] bg-hero bg-cover" 
        style={{ margin: '-40px 2px -30px 2px' }}>
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded pt-0 py-2 text-center text-base font-normal">
            Upcoming Meeting at: 12:30 PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-4xl">{time}</h1>
            <p className="text-lg pl-3 font-medium text-sky-900 lg:text-xl mb--5">{date}</p>
          </div>
        </div>
      </div>
    <MeetingTypeList/>
    </section>
  )
}

export default Home