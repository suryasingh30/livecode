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
    linkedIn: 'https://www.linkedin.com/in/prabhjot-singh-39a4a1231/',
    description: 'Hello! I am Prabjhot, a Web Developer and a programmer.',
  },
];

// TeamMember component definition
const TeamMember: React.FC<TeamMemberComponentProps> = ({ member }) => (
  <div className="flex flex-col items-center justify-center bg-gray-800 p-4 sm:p-6 rounded-lg transition-all duration-300 hover:shadow-lg">
    <Image 
      src={member.image} 
      alt={member.name}
      style={{
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover'
      }}
      width={128}
      height={128}
      priority
    />
    <p className="text-white mt-4 text-lg sm:text-xl">{member.name}</p>
    <a 
      href={member.linkedIn} 
      target="_blank"
      className="text-blue-500 hover:underline mt-2 text-base sm:text-lg"
      rel="noopener noreferrer"
    >
      LinkedIn
    </a>
    <p className="text-white text-center mt-2 text-sm sm:text-base">{member.description}</p>
  </div>
);

// AboutPage component definition
const AboutPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
