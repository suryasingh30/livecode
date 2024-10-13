"use client";

import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="p-8 font-sans bg-gray-900 min-h-screen">
      <h1 className="text-center text-white font-bold text-4xl mb-8">
        About Interview Nest
      </h1>

      <p className="text-white text-lg mb-6 transition-transform">
        Interview Nest is designed to streamline technical interviews by combining 
        video conferencing with a multi-language coding environment. With real-time 
        collaboration powered by <strong>Socket.io</strong> and <strong>WebRTC</strong>, 
        interviewers and candidates can engage in live coding sessions, testing, and 
        instant review of code.
      </p>

      <h2 className="text-white text-xl mb-4">Features</h2>

      <ul className="list-disc list-inside">
        {['Live coding environment with real-time collaboration', 'Video conferencing for face-to-face communication', 'Instant meeting setup and scheduling', 'Session recording for later review'].map((feature, index) => (
          <li
            key={index}
            className="text-white text-lg mb-2 transition-transform"
          >
            {feature}
          </li>
        ))}
      </ul>

      <p className="text-white text-lg mt-8 mb-4 transition-transform">
        Built using <strong>Next.js</strong>, <strong>TypeScript</strong>, and <strong>Node.js</strong>, 
        Interview Nest is both robust and highly scalable. We’ve integrated 
        <strong> Clerk</strong> for seamless authentication, making it easy for 
        users to create and join meetings securely.
      </p>

      <p className="text-white text-lg mb-6 transition-transform">
        Whether you’re conducting technical interviews or working on collaborative coding projects, 
        Interview Nest offers a powerful, all-in-one solution for your needs.
      </p>
    </div>
  );
};

export default AboutPage;
