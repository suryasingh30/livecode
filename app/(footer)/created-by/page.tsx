import React from 'react';
import Image from 'next/image';

// Define the type for team members
interface TeamMemberProps {
  name: string;
  image: string;
  linkedIn: string;
  description: string;
}

// Define the props for the TeamMember component
interface TeamMemberComponentProps {
  member: TeamMemberProps;
}

const teamMembers: TeamMemberProps[] = [
  {
    name: 'Shubham Vishwakarma',
    image: '/images/shubham.jpg',
    linkedIn: 'https://www.linkedin.com/in/shubham-vishwakarma-514897202/',
    description: 'Hello there! I am Shubham, a web developer and a programmer.',
  },
  {
    name: 'Arushi Agrawal',
    image: '/images/arushi.jpg',
    linkedIn: 'https://www.linkedin.com/in/arushi-agrawal-a46662228/',
    description: 'Hello! I am Arushi, a Java Developer and a web developer.',
  },
  {
    name: 'Suryanaryan Singh',
    image: '/images/surya.jpg',
    linkedIn: 'https://www.linkedin.com/in/suryanarayan-singh-08aa49224/',
    description: 'I am Surya, a full stack web developer and a programmer.',
  },
  {
    name: 'Prabjhot Singh',
    image: '/images/prabjhot.jpg',
    linkedIn: 'https://www.linkedin.com/in/prabhjot-singh-39a4a1231/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    description: 'Hello! I am Prabjhot, a Web Developer and a programmer.',
  },
];

// TeamMember component definition
const TeamMember: React.FC<TeamMemberComponentProps> = ({ member }) => (
  <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg">
    <Image 
      src={member.image} 
      alt={member.name}
      className="rounded-full"
      width={128}
      height={128}
      priority
    />
    <p className="text-white mt-4 text-xl">{member.name}</p>
    <a 
      href={member.linkedIn} 
      target="_blank"
      className="text-blue-500 hover:underline mt-2 text-xl"
      rel="noopener noreferrer"
    >
      LinkedIn
    </a>
    <p className="text-white text-center mt-4">{member.description}</p>
  </div>
);

// AboutPage component definition
const AboutPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 p-4 sm:grid-cols-1">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
