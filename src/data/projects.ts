import projectImages from './projectImages.json';

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  type: 'personal' | 'professional';
  description: string;
  note?: string;
  images: ProjectImage[];
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
    images: projectImages.adjauto,
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
    images: [{
      src: '/images/projects/betterbacoor.png',
      alt: 'BetterBacoor home page with service search and guides for business permits, civil records, and working permits.',
      width: 1898,
      height: 919,
    }],
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
    images: projectImages.pulse,
    technologies: ['Flutter', 'Dart', 'Firebase'],
    repository: 'https://github.com/0phl/Pulse-App',
  },
  {
    id: 'iskedyulko',
    title: 'IskedyulKo',
    category: 'Appointment booking',
    type: 'personal',
    description: 'A booking app for small Filipino businesses. Owners manage services and appointments, while customers book a time and track their booking without creating an account.',
    images: [],
    technologies: ['React', 'TypeScript', 'Express', 'MySQL'],
    repository: 'https://github.com/0phl/IskedyulKo',
  },
  {
    id: 'lutong-bahai',
    title: 'Lutong BahAI',
    category: 'Filipino recipe app',
    type: 'personal',
    description: 'A recipe app that suggests Filipino dishes based on the ingredients you have. It includes an AI cooking assistant, saved recipes, and a cooking timer.',
    images: projectImages.lutongbahai,
    technologies: ['Next.js', 'TypeScript', 'shadcn/ui', 'Google Gemini', 'IndexedDB'],
    repository: 'https://github.com/0phl/LutongBahAI',
    website: 'https://lutong-bahai.vercel.app/',
  },
  {
    id: 'sz-hotpot-haven',
    title: 'S&Z Hot Pot Haven',
    category: 'Online store',
    type: 'personal',
    description: 'An online store for hotpot ingredients in Bacoor. Customers can browse products, add items to a cart, and place orders, with an admin interface for managing the store.',
    images: projectImages.szhotpot,
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    repository: 'https://github.com/0phl/sz-hotpot-store',
    website: 'https://szhotpot.free.nf/',
  },
  {
    id: 'linkfolio',
    title: 'Linkfolio',
    category: 'Bookmark organizer',
    type: 'personal',
    description: 'A personal bookmark organizer for saving and grouping useful websites. Bookmarks stay in the browser with IndexedDB and can be accessed offline.',
    images: projectImages.linkfolio,
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'IndexedDB'],
    repository: 'https://github.com/0phl/Linkfolio',
    website: 'https://linkfolio-iota.vercel.app/',
  },
  {
    id: 'car-rental',
    title: 'Car Rental System',
    category: 'Vehicle booking',
    type: 'personal',
    description: 'A car rental system where customers browse vehicles, book without an account, and track reservations using a reference number. Admins manage the fleet, bookings, and PDF reports.',
    images: projectImages.carrental,
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    repository: 'https://github.com/0phl/Car-Rental-System',
  },
  {
    id: 'aroundu',
    title: 'AroundU',
    category: 'Local business discovery',
    type: 'personal',
    description: 'A web app that helps St. Dominic students find nearby cafes, shops, and services. Students can explore local businesses, read reviews, and find promotions.',
    images: projectImages.aroundu,
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Leaflet.js'],
    repository: 'https://github.com/0phl/AroundU',
  },
  {
    id: 'aroundu-admin',
    title: 'AroundU Admin Dashboard',
    category: 'Community admin tools',
    type: 'personal',
    description: 'The admin side of AroundU, with tools for managing businesses, events, discounts, users, and community alerts.',
    images: projectImages['aroundu-admin'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Leaflet.js'],
    repository: 'https://github.com/0phl/AroundU',
  },
  {
    id: 'lenscraft',
    title: 'LensCraft',
    category: 'Photography portfolio',
    type: 'personal',
    description: 'A photography portfolio for browsing portrait, landscape, street, and nature photos. Built as a frontend project using HTML, CSS, and JavaScript.',
    images: projectImages.lenscraft,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    repository: 'https://github.com/0phl/Photographer-Portfolio',
    website: 'https://lnscrft.netlify.app/',
  },
];
