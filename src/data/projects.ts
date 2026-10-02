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
  contribution?: { title: string; description: string };
  featureGroups?: { title: string; items: string[] }[];
  note?: string;
  images: ProjectImage[];
  website?: string;
  technologies: string[];
  repository?: string;
}

export const projects: Project[] = [
  {
    id: 'pmma-enrollment',
    title: 'PMMA Graduate School Enrollment System',
    category: 'Seaversity client project',
    type: 'professional',
    description: 'An enrollment system developed at Seaversity for the Philippine Merchant Marine Academy Graduate School. It connects online applications, document review, admission decisions, payments, and Moodle classroom access in one workflow.',
    contribution: {
      title: 'Sole Full-Stack Developer',
      description: 'I designed and developed the frontend, backend, database, and deployment as part of my role at Seaversity. My work covered the applicant portal, staff tools, Moodle integration, automated tests, and server setup.',
    },
    note: 'Developed at Seaversity for PMMA Graduate School. This page presents my contribution as the developer.',
    images: projectImages['pmma-enrollment'],
    highlights: ['Online applications and staff review workflows.', 'Fee assessment and payment recording.', 'Automated Moodle account and course provisioning.'],
    featureGroups: [
      {
        title: 'Applications & student portal',
        items: [
          'Account registration, email verification, password recovery, and a step-by-step application saved as a draft.',
          'Program and course selection, personal information, Philippine address selection, education and employment history, document uploads, surveys, and consent records.',
          'Application status, requested corrections, resubmission, withdrawal, and enrollment for continuing students in later terms.',
        ],
      },
      {
        title: 'Document review & admission',
        items: [
          'Registrar queues with separate checks for uploaded scans and paper originals, configurable requirements, and application endorsement or return.',
          'Dean approval, decline, and return workflows, with a generated Notice of Admission PDF.',
          'Printable student information sheets, document revision history, and recorded responses to returned applications.',
        ],
      },
      {
        title: 'Courses & academic terms',
        items: [
          'Management of programs, curricula, courses, prerequisites, instructors, class sections, schedules, and capacity.',
          'Term setup and rollover, course eligibility by program, student categories, and course prices for each term.',
          'Course selection and drop workflows, plus a staff-assisted enrollment flow for authorized exceptions.',
        ],
      },
      {
        title: 'Assessment & payments',
        items: [
          'Automatic assessments with tuition and general fees. Bills retain a snapshot of the prices used when they were created.',
          'Bank-deposit proof uploads, payment review, counter-payment recording, refunds, and balance tracking.',
          'Configurable fee schedules and bank accounts, with payment monitoring and collection summaries for Accounting.',
        ],
      },
      {
        title: 'Moodle integration',
        items: [
          'Background jobs create or match student accounts and enroll students in the correct Moodle courses.',
          'A classroom page shows course access and provisioning status, with a Moodle password reset flow.',
          'Retry controls, failed-job monitoring, course withdrawal handling, and reconciliation checks for differences between the portal and Moodle.',
        ],
      },
      {
        title: 'Staff dashboards & reports',
        items: [
          'Separate workspaces for applicants, the Registrar, Dean, Accounting, and administrators, with dashboards scoped by academic term.',
          'Course enrollment, student load, survey, payment, and collection reports, with filtered CSV exports.',
          'Staff account management, school settings, and a readable audit log of administrative actions.',
        ],
      },
      {
        title: 'Notifications & document storage',
        items: [
          'Editable email templates, SMTP settings, delivery history, and retries for application, payment, and classroom notifications.',
          'Private MinIO document storage with access-controlled, expiring file links and upload validation.',
          'Lossless upload optimization that keeps the original file when a smaller verified version cannot be produced.',
        ],
      },
      {
        title: 'Architecture & deployment',
        items: [
          'A TypeScript monorepo with a Next.js frontend, NestJS API and background worker, shared Zod validation, and Prisma with PostgreSQL.',
          'PostgreSQL-backed jobs through pg-boss, role-based permissions, session authentication, password hashing, and login throttling.',
          'Self-hosted deployment on Rocky Linux using Docker Compose and Nginx, with database migrations, health checks, backup and restore scripts, and deployment documentation.',
          'Automated tests for business rules and user interfaces, plus integration checks for enrollment, billing, and Moodle workflows.',
        ],
      },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NestJS', 'Node.js', 'Zod', 'Prisma', 'PostgreSQL', 'pg-boss', 'MinIO', 'Moodle Web Services', 'PDFKit', 'Nodemailer', 'Sharp', 'Docker Compose', 'Nginx', 'Rocky Linux', 'Vitest', 'pnpm', 'Turborepo'],
  },
  {
    id: 'lms-billing',
    title: 'LMS Billing',
    category: 'Seaversity internal tool',
    type: 'professional',
    description: 'An internal billing support tool developed at Seaversity. It brings together trainee completion data from client Moodle sites so the team can review courses, prepare billing records, and track which courses have been marked paid.',
    contribution: {
      title: 'Sole Full-Stack Developer',
      description: 'I designed and developed the frontend, backend, database, and deployment as part of my role at Seaversity. My work included the Moodle integration, completion checks, reporting, background refreshes, access controls, and server setup.',
    },
    note: 'Developed for internal use at Seaversity. This page presents my contribution as the developer.',
    images: projectImages['lms-billing'],
    highlights: ['Completion-based billing checks across client Moodle sites.', 'Excel, CSV, and PDF supporting records.', 'Scheduled refreshes and restricted client viewer accounts.'],
    featureGroups: [
      {
        title: 'Moodle sites & course catalog',
        items: [
          'Manage multiple client Moodle connections, switch between sites, and test whether the required web service functions are available.',
          'Sync categories and courses into a stored catalog, with a searchable category tree and filters for completion, paid status, and tracking.',
          'Find courses by name, batch code, category, or common abbreviations without making a new Moodle request for every search.',
        ],
      },
      {
        title: 'Trainee completion checks',
        items: [
          'Check trainee progress using Moodle Web Services, with a formula that follows the Completion Progress block and configurable alternatives for each site.',
          'Show active, completed, billable, and suspended counts alongside each trainee\'s progress, status, and last course access.',
          'Exclude non-trainee roles, identify missing progress figures, and retain the last successful result when a refresh fails.',
        ],
      },
      {
        title: 'Billing dashboard & paid tracking',
        items: [
          'Dashboard views for courses ready to bill, courses in progress, paid courses, and items needing attention.',
          'Mark individual courses or a batch\'s ready courses as paid, recording the date and the billable count from the stored check. Paid marks can also be removed.',
          'Filter paid records by month, year, or a custom date range, with summaries of courses, batches, and trainees billed.',
        ],
      },
      {
        title: 'Exports & supporting documents',
        items: [
          'Export completed trainees or the full trainee list to Excel and CSV, including progress, completion status, and last course access.',
          'Generate a billing supporting-data PDF with account, course, batch, date, and preparer details, with reusable account and preparer information per site.',
          'Build exported counts and trainee lists from the same stored check. The PDF export asks for a fresh review if that check changed while the form was open.',
        ],
      },
      {
        title: 'Background refresh & tracking',
        items: [
          'Refresh a course, batch, category, or all tracked courses, with progress indicators and cancellation controls.',
          'Run nightly refreshes within a configurable Manila-time window, with global and per-site switches and a choice of tracked categories.',
          'Exclude individual courses from bulk monitoring and resume them later while keeping stored results and paid history.',
          'Use a PostgreSQL-backed job queue, per-site request limits, and course locks to manage refresh work and avoid duplicate checks.',
        ],
      },
      {
        title: 'Client viewer accounts',
        items: [
          'Create client accounts assigned to one LMS, with read-only access to its stored dashboard, courses, trainee details, and billing status.',
          'Keep exports, refreshes, paid-status changes, settings, and account management restricted to administrators.',
          'Manage assignments, reset passwords, and disable access. Account changes revoke existing client sessions.',
        ],
      },
      {
        title: 'Architecture & access controls',
        items: [
          'A Next.js and TypeScript application with React screens, server-side actions and API routes, Zod validation, and PostgreSQL through Drizzle ORM.',
          'Encrypted Moodle tokens, hashed passwords, signed sessions, login throttling, and server-side checks for each account\'s permitted LMS.',
          'Stored course snapshots keep browsing separate from live Moodle requests; the refresh worker and scheduler run within the application process.',
        ],
      },
      {
        title: 'Deployment & verification',
        items: [
          'Self-hosted deployment using Docker Compose, PostgreSQL, and Nginx, with NPMplus and Cloudflare for the HTTPS entry point.',
          'Versioned container releases, non-root containers, database health checks, controlled application promotion, and compatible code rollback.',
          'Vitest and PGlite tests cover application and database behavior. A separate comparison tool checks progress formulas against Moodle\'s Completion Progress block.',
        ],
      },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Zod', 'PostgreSQL', 'Drizzle ORM', 'Moodle Web Services', 'PDFKit', 'write-excel-file', 'Docker Compose', 'Nginx', 'NPMplus', 'Cloudflare', 'Vitest', 'PGlite'],
  },
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
