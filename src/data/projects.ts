export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  note?: string;
  technologies: string[];
  repository: string;
}

export const projects: Project[] = [
  {
    id: 'betterbacoor',
    title: 'BetterBacoor',
    category: 'Community guide',
    description: 'A place to find Bacoor services, requirements, and local information before heading to a government office. An unofficial, community-run guide for residents.',
    note: 'Built on the BetterLocalGov starter, with original credits preserved in the repository.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    repository: 'https://github.com/0phl/betterbacoor',
  },
  {
    id: 'pulse',
    title: 'PULSE',
    category: 'Community mobile app',
    description: 'A community app that brings announcements, local buying and selling, volunteer activities, and community reports into one place.',
    technologies: ['Flutter', 'Dart', 'Firebase'],
    repository: 'https://github.com/0phl/Pulse-App',
  },
  {
    id: 'iskedyulko',
    title: 'IskedyulKo',
    category: 'Appointment booking',
    description: 'A booking app for small Filipino businesses. Owners manage services and appointments, while customers book a time and track their booking without creating an account.',
    technologies: ['React', 'TypeScript', 'Express', 'MySQL'],
    repository: 'https://github.com/0phl/IskedyulKo',
  },
];
