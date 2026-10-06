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
    id: 'moodle-support-chatbot',
    title: 'Moodle LMS Support Chatbot',
    category: 'Seaversity LMS integration',
    type: 'professional',
    description: 'An embedded support chatbot I developed at Seaversity to help trainees use Moodle without leaving their learning environment. A custom JavaScript widget connects to self-hosted n8n workflows for contextual answers. The project includes a Pinecone-based RAG version and a separate version that selects curated manual and FAQ content through keyword matching.',
    contribution: {
      title: 'Full-Stack Developer',
      description: 'I built the browser chat widget, implemented the n8n chatbot workflows, and integrated the assistant into Moodle. My work included connecting Pinecone retrieval to answer generation in the RAG version. I deployed the widget and tested the complete path from a trainee\'s message through n8n to the reply displayed in the LMS.',
    },
    note: 'Developed as part of my role at Seaversity. This case study describes my contribution; source code and internal deployment details are not published here.',
    images: [],
    highlights: [
      'Custom chat widget embedded directly in Moodle.',
      'Pinecone RAG and a separate curated manual/FAQ workflow.',
      'Contextual answers with links to relevant LMS guidance.',
    ],
    featureGroups: [
      {
        title: 'Support inside the learning platform',
        items: [
          'A floating launcher opens a chat panel for questions about LMS navigation, course activities, account access, technical requirements, and support channels.',
          'Configurable bot name, theme color, screen position, welcome message, and input placeholder let the same widget fit different LMS installations.',
          'Typing feedback, automatic scrolling, Enter-to-send, and a full-screen mobile layout support everyday use. The floating launcher hides while mobile chat is open so it does not cover the conversation.',
        ],
      },
      {
        title: 'Moodle-to-n8n request flow',
        items: [
          'The standalone JavaScript widget sends a JSON POST request to an n8n webhook with the message, application identifier, session identifier, current LMS hostname, and recent conversation context.',
          'The workflow validates input, selects a support topic, builds the answer context, calls the LLM, formats the result, and returns JSON for the widget to display.',
          'The browser interface and workflow remain separate: widget settings select the endpoint, while n8n coordinates the support logic and model call.',
        ],
      },
      {
        title: 'Pinecone RAG version',
        items: [
          'The widget sends a trainee\'s question to a self-hosted n8n webhook, which coordinates retrieval and answer generation.',
          'Pinecone provides vector retrieval over curated FAQ content. The retrieved context is supplied to the LLM to help ground its answer in the support material.',
          'n8n returns the generated response to the Moodle widget. This retrieval-augmented generation flow is a separate implementation from the keyword-based manual and FAQ workflow described below.',
        ],
      },
      {
        title: 'Manual & FAQ matching version',
        items: [
          'The reviewed workflow contains a curated trainee-manual topic map and FAQ answers covering platform features, learning activities, completion guidance, and common technical questions.',
          'A keyword classifier scores matching phrases, giving longer phrases more weight. Manual content wins when its score equals or exceeds the FAQ match; otherwise the strongest FAQ supplies the context.',
          'The selected reference and a short conversation window are passed to an n8n LLM chain for a concise answer. When no topic matches, the assistant is guided to offer general LMS help or refer course-specific questions to the Help Desk or instructor.',
        ],
      },
      {
        title: 'Relevant guidance & support boundaries',
        items: [
          'Successful manual-based answers can include an Official guide link built from the current LMS hostname and the matched manual page, helping trainees continue to the relevant reference.',
          'Workflow guidance focuses the assistant on platform support and navigation, with predefined responses for requests to complete academic assessments or disclose internal instructions.',
          'The workflow rejects empty or overly long messages. Response handling provides a temporary-unavailability message with FAQ and support alternatives when the model call fails.',
        ],
      },
      {
        title: 'Conversation continuity',
        items: [
          'The widget stores the session identifier and conversation in browser local storage, separated by application identifier, so a conversation can be restored after navigation or reload.',
          'A Clear action asks for confirmation before removing the saved conversation and restoring the welcome message.',
          'Only a recent portion of the conversation is sent with each request, and the workflow narrows that context further before building the model prompt.',
        ],
      },
      {
        title: 'Implementation & deployment',
        items: [
          'Plain JavaScript, HTML, and CSS provide a standalone widget that injects its interface into the host page without requiring a frontend framework.',
          'The repository includes Vercel configuration for serving the widget script, while a self-hosted n8n webhook handles the chatbot backend.',
          'I deployed the browser widget and tested the end-to-end Moodle-to-n8n response flow. The widget repository also includes a regression check for the mobile launcher overlap fix.',
        ],
      },
    ],
    technologies: ['JavaScript', 'HTML', 'CSS', 'Moodle', 'n8n', 'Pinecone', 'RAG', 'LLM Integration', 'REST APIs', 'Browser Local Storage', 'Vercel'],
  },
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
    id: 'social-portfolio',
    title: 'Social Portfolio',
    category: 'Personal portfolio & AI assistant',
    type: 'personal',
    description: 'My personal portfolio, built around the feel of a social profile. It brings together projects, quick updates, longer write-ups, and an AI assistant that helps visitors explore my work through conversation. I wanted the site itself to show how I build, not just display the finished projects.',
    contribution: {
      title: 'Full-Stack Developer',
      description: 'I built the portfolio interface, content structure, and server-side chat integration. My work includes the assistant\'s conversational style, generated portfolio reference, verified navigation links, usage controls, and automated tests. The code is open source so others can use it too.',
    },
    note: 'Social interactions and engagement counts are demos; there is no visitor account system. The AI chat makes real API requests. Cloudflare deployment is configured and tested locally; publishing is a separate step.',
    images: projectImages['social-portfolio'],
    repository: 'https://github.com/0phl/social-portfolio',
    highlights: [
      'A social profile with project case studies, posts, and a blog.',
      'A conversational AI assistant grounded in the portfolio content.',
      'Generated knowledge, verified links, and server-side usage limits.',
    ],
    featureGroups: [
      {
        title: 'A portfolio with a social feel',
        items: [
          'Profile, experience, education, and grouped skills sit alongside a post feed, blog, and filterable professional and personal projects.',
          'Project pages combine screenshots, my contribution, feature breakdowns, and grouped technology lists. Direct links open individual projects, posts, and articles.',
          'Demo posting, comments, likes, bookmarks, sharing, and update notifications make the interface feel interactive while keeping the content easy to browse.',
        ],
      },
      {
        title: 'A conversational portfolio assistant',
        items: [
          'Visitors can ask about my projects, experience, skills, or writing and follow links directly to the relevant content.',
          'A voice guide and original conversation examples shape a warm, playful tone in English and casual Filipino or Taglish. The assistant speaks about me in third person and stays clear that it is AI.',
          'Harmless questions outside the portfolio are welcome, with situational humor where appropriate. The guidance avoids jokes for serious conversations and discourages guessing facts about me.',
        ],
      },
      {
        title: 'Knowledge that follows the content',
        items: [
          'A build script reads the same structured profile, experience, skills, projects, posts, and blog content used by the site to generate the assistant\'s reference.',
          'Content changes reach the assistant on the next build and deployment, without manually maintaining a second biography or project list.',
          'The reference is supplied as context, not model training or live web browsing. A generated link catalog keeps navigation tied to published portfolio routes and approved external destinations.',
        ],
      },
      {
        title: 'Chat interface & navigation',
        items: [
          'Quick prompts send immediately. Animated typing dots, a short natural delay, optional message sounds, and reduced-motion support make the chat feel part of the social interface.',
          'Markdown replies support headings, lists, quotations, and code blocks. Project recommendations include verified actions, showing source and live-site links only when they exist in the project data.',
          'Stop and close cancel an active response; New chat clears the conversation. History stays in browser memory until reload, with no server-side conversation history storage.',
        ],
      },
      {
        title: 'API integration & architecture',
        items: [
          'React and TypeScript handle the interface, with Vite, Tailwind CSS, and Framer Motion. A Cloudflare Worker serves static assets and the /api/chat endpoint from the same origin.',
          'A provider adapter separates the chat flow from the AI service, allowing supported providers and models to be selected through server configuration. API keys stay in server-side secrets.',
          'The Worker processes the provider\'s response stream and forwards a common event format to the client, which buffers the answer while showing typing feedback. Timeouts, cancellation, and incomplete-response handling keep failures recoverable.',
        ],
      },
      {
        title: 'Abuse controls & safe rendering',
        items: [
          'Server-side Turnstile verification, origin checks, request validation, and a network-based burst limit run before an AI request is made.',
          'Persistent daily allowances use a SQLite-backed Durable Object to reserve network and site-wide quotas atomically. Starting a new chat or refreshing does not reset them.',
          'The renderer blocks raw HTML, images, and unapproved links. Conversation guidance treats visitor content as untrusted and discourages instruction disclosure or invented portfolio facts; it is not a guarantee against prompt injection.',
        ],
      },
      {
        title: 'Testing & open-source setup',
        items: [
          'Vitest and React Testing Library cover chat state, cancellation, response streams, provider adapters, generated knowledge, link handling, and user interactions.',
          'Quota tests use real SQLite to check concurrent requests, persistence, daily resets, and failures before provider calls. Local Cloudflare runtime checks exercise the Durable Object implementation.',
          'Wrangler runs the frontend and Worker together locally before deployment. The repository includes setup instructions, an assistant guide, environment examples, and an MIT license.',
        ],
      },
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Markdown', 'Cloudflare Workers', 'Durable Objects', 'SQLite', 'Cloudflare Turnstile', 'Vitest', 'React Testing Library', 'Wrangler'],
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
    website: 'https://pulseeapp.vercel.app/',
  },
  {
    id: 'pulse-promotional',
    title: 'PULSE Promotional Website',
    category: 'Capstone companion website',
    type: 'personal',
    description: 'A promotional website I built for our PULSE college capstone, giving visitors a place to explore the community app and find its Android APK download. It presents the resident experience and administrator tools through app screenshots, feature explanations, and an interactive showcase.',
    contribution: {
      title: 'Frontend Developer',
      description: 'I built the website to introduce our capstone beyond the mobile app itself. My work covered the responsive landing page, reusable phone mockups, animated feature sections, interactive administrator preview, and links to the Android installation page.',
    },
    note: 'The companion website for PULSE, our community mobile app capstone. The screens shown here demonstrate the app; community management, accounts, and transactions run in the separate PULSE application.',
    images: projectImages['pulse-promotional'],
    website: 'https://pulseeapp.vercel.app/',
    repository: 'https://github.com/0phl/pulse-web-promotional',
    highlights: [
      'Resident and administrator feature showcases with app screenshots.',
      'Interactive admin preview and responsive phone mockups.',
      'Android APK download entry points through AppsOnAir.',
    ],
    featureGroups: [
      {
        title: 'Introducing the PULSE capstone',
        items: [
          'A single-page introduction to PULSE: Public Updates, Local Services, and Engagement. The hero combines the app\'s login screenshot, community-focused messaging, and a clear Android download action.',
          'Dedicated sections explain community notices, the local marketplace, volunteer opportunities, and community reports using screenshots from the mobile app.',
          'A short How it Works section introduces the journey from downloading the app to creating an account and participating in a community.',
        ],
      },
      {
        title: 'Interactive administrator showcase',
        items: [
          'Visitors can select dashboard, user management, broadcast updates, volunteer programs, and issue-resolution previews.',
          'Selecting a feature updates the active description and phone screenshot, with an animated transition driven by React state and Framer Motion.',
          'The section shows what community administrators can do inside PULSE through a visual walkthrough rather than a live administration interface.',
        ],
      },
      {
        title: 'Android download flow',
        items: [
          'Download actions in the navigation, hero, main download section, and footer point to the app\'s external AppsOnAir installation page.',
          'The website serves as the public entry point for finding the Android APK; the app distribution service handles delivery rather than storing the APK in the website repository.',
          'The download section identifies Android as the supported platform, keeping the next step visible after visitors explore the features.',
        ],
      },
      {
        title: 'Responsive presentation & motion',
        items: [
          'A fixed navigation bar links to page sections and switches to an expandable menu on smaller screens. The hero\'s Learn more action scrolls to the feature showcase.',
          'Reusable phone mockups frame the app screenshots consistently. Alternating feature layouts and responsive grids organize the longer page for desktop and mobile.',
          'Framer Motion provides section entrances, screenshot transitions, and button feedback, while Tailwind CSS carries the PULSE teal color palette and responsive styling.',
        ],
      },
      {
        title: 'Implementation & hosting',
        items: [
          'Built with React, TypeScript, Vite, and Tailwind CSS, with Lucide icons and reusable button and phone-mockup components.',
          'Feature content is defined in arrays and rendered through shared components; the administrator selector uses local component state.',
          'Hosted on Vercel as a frontend website, with public source code in a separate repository from the Flutter and Firebase mobile application.',
        ],
      },
    ],
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lucide', 'Vercel'],
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
