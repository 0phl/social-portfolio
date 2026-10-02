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
  highlights: string[];
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
    highlights: ['Service bookings and quote requests.', 'Cars-for-sale listings.', 'Admin tools for appointments and vehicle inventory.'],
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
    highlights: ['Local services and requirements in one place.', 'Guides for residents preparing to visit government offices.', 'Unofficial and community-run.'],
    images: [{
      src: '/images/projects/betterbacoor/betterbacoor.png',
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
    highlights: ['Community announcements and reports.', 'Local buying and selling.', 'Volunteer activities in one mobile app.'],
    technologies: ['Flutter', 'Dart', 'Firebase'],
    repository: 'https://github.com/0phl/Pulse-App',
  },
  {
    id: 'hushmap',
    title: 'HushMap',
    category: 'School IoT project',
    type: 'personal',
    description: 'A school IoT project for monitoring library noise at St. Dominic College of Asia. An ESP32 sensor sends sound readings to a dashboard that shows noise levels on a library floor plan.',
    note: 'The demo uses one live ESP32 sensor and four simulated nodes.',
    images: projectImages.hushmap,
    highlights: ['Live noise readings from an ESP32 and an INMP441 microphone.', 'A floor-plan heatmap with quiet, moderate, and loud noise levels.', 'Firebase keeps the sensor readings and dashboard in sync.'],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'ESP32', 'Arduino C++', 'INMP441'],
    repository: 'https://github.com/0phl/hushmap',
  },
  {
    id: 'iskedyulko',
    title: 'IskedyulKo',
    category: 'Appointment booking',
    type: 'personal',
    description: 'A booking app for small Filipino businesses. Owners manage services and appointments, while customers book a time and track their booking without creating an account.',
    images: [],
    highlights: ['Service and appointment management for small businesses.', 'Booking and tracking without a customer account.'],
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
    highlights: ['Filipino recipe suggestions based on available ingredients.', 'AI cooking assistant.', 'Saved recipes and a cooking timer.'],
    technologies: ['Next.js', 'TypeScript', 'shadcn/ui', 'Google Gemini', 'IndexedDB'],
    repository: 'https://github.com/0phl/LutongBahAI',
    website: 'https://lutong-bahai.vercel.app/',
  },
  {
    id: 'sz-hotpot-haven',
    title: 'S&Z Hot Pot Haven',
    category: 'Freelance project',
    type: 'professional',
    description: 'A freelance online store for hotpot ingredients in Bacoor. Customers can browse products, add items to a cart, and place orders, with an admin interface for managing the store.',
    images: projectImages.szhotpot,
    highlights: ['Product browsing, a shopping cart, and order placement.', 'Admin tools for managing the store.'],
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Bootstrap'],
  },
  {
    id: 'linkfolio',
    title: 'Linkfolio',
    category: 'Bookmark organizer',
    type: 'personal',
    description: 'A personal bookmark organizer for saving and grouping useful websites. Bookmarks stay in the browser with IndexedDB and can be accessed offline.',
    images: projectImages.linkfolio,
    highlights: ['Save and group useful websites.', 'Bookmarks stored locally with IndexedDB.', 'Offline access to saved bookmarks.'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'IndexedDB'],
    repository: 'https://github.com/0phl/Linkfolio',
  },
  {
    id: 'car-rental',
    title: 'Car Rental System',
    category: 'Vehicle booking',
    type: 'personal',
    description: 'A car rental system where customers browse vehicles, book without an account, and track reservations using a reference number. Admins manage the fleet, bookings, and PDF reports.',
    images: projectImages.carrental,
    highlights: ['Vehicle booking without an account.', 'Reservation tracking with a reference number.', 'Fleet management, bookings, and PDF reports.'],
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
    highlights: ['Nearby cafes, shops, and services for St. Dominic students.', 'Business reviews and local promotions.'],
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
    highlights: ['Manage businesses, events, and discounts.', 'Tools for users and community alerts.'],
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
    highlights: ['Portrait, landscape, street, and nature photography.', 'A frontend project built with HTML, CSS, and JavaScript.'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    repository: 'https://github.com/0phl/Photographer-Portfolio',
    website: 'https://lnscrft.netlify.app/',
  },
];
