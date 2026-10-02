export interface Project {
  id: string;
  title: string;
  category: string;
  type: 'personal' | 'professional';
  description: string;
  note?: string;
  image?: { src: string; alt: string; width: number; height: number };
  website?: string;
  technologies: string[];
  repository?: string;
}

export const projects: Project[] = [
  {
    id: 'adj-automotive',
    title: 'ADJ Automotive',
    category: 'Freelance project',
    type: 'professional',
    description: 'A freelance web application for ADJ Automotive Repair Services, with service bookings, quote requests, cars-for-sale listings, and an admin dashboard for appointments and vehicle inventory.',
    image: {
      src: '/images/projects/adj-automotive.jpg',
      alt: 'ADJ Automotive home page with repair services, appointment booking, and cars-for-sale links.',
      width: 1920,
      height: 1080,
    },
    website: 'https://adjauto.com/',
    technologies: ['React', 'TypeScript', 'Laravel', 'MySQL', 'Tailwind CSS'],
  },
  {
    id: 'betterbacoor',
    title: 'BetterBacoor',
    category: 'Community guide',
    type: 'personal',
    description: 'A place to find Bacoor services, requirements, and local information before heading to a government office. An unofficial, community-run guide for residents.',
    note: 'Built on the BetterLocalGov starter, with original credits preserved in the repository.',
    image: {
      src: '/images/projects/betterbacoor.jpg',
      alt: 'BetterBacoor home page with service search and guides for business permits, civil records, and working permits.',
      width: 1280,
      height: 720,
    },
    website: 'https://www.betterbacoor.org/',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    repository: 'https://github.com/0phl/betterbacoor',
  },
  {
    id: 'pulse',
    title: 'PULSE',
    category: 'College capstone',
    type: 'personal',
    description: 'My college capstone project: a community mobile app that brings announcements, local buying and selling, volunteer activities, and community reports into one place.',
    technologies: ['Flutter', 'Dart', 'Firebase'],
    repository: 'https://github.com/0phl/Pulse-App',
  },
  {
    id: 'iskedyulko',
    title: 'IskedyulKo',
    category: 'Appointment booking',
    type: 'personal',
    description: 'A booking app for small Filipino businesses. Owners manage services and appointments, while customers book a time and track their booking without creating an account.',
    technologies: ['React', 'TypeScript', 'Express', 'MySQL'],
    repository: 'https://github.com/0phl/IskedyulKo',
  },
];
