export const experience = [
  {
    id: 'seaversity-full-time',
    role: 'Server Administrator',
    company: 'Seaversity, Inc.',
    logo: '/images/organizations/seaversity.png',
    type: 'Full-time',
    period: 'May 2026 – Present',
    location: 'Philippines · On-site',
    current: true,
    description: 'Keeping production Linux servers and Moodle environments running, and making deployments easier to repeat.',
    details: ['I look after client LMS environments, from provisioning VMs and routing domains to migrations, storage, and troubleshooting. I also build scripts and internal tools to make routine work more manageable.'],
    highlights: [
      'Manage Rocky Linux servers with Nginx, PHP-FPM, PostgreSQL, and Redis.',
      'Built a MinIO repository for shared course content and NFS workflows across LMS instances.',
      'Automate deployment, database, and backup tasks with Bash, and document the process.',
    ],
    skills: ['Rocky Linux', 'Moodle', 'Bash', 'Sangfor MCS', 'MinIO', 'NFS'],
  },
  {
    id: 'seaversity-contract',
    role: 'Server Administrator',
    company: 'Seaversity, Inc.',
    logo: '/images/organizations/seaversity.png',
    type: 'Contract',
    period: 'Nov 2025 – May 2026',
    location: 'Philippines',
    current: false,
    description: 'Moved from my internship into a project-based role supporting production infrastructure and client deployments.',
    details: ['I worked with the IT team to provision Linux environments, maintain Moodle deployments, and troubleshoot application and infrastructure issues.'],
    highlights: [
      'Provisioned virtual machines and configured networking and Cloudflare DNS.',
      'Wrote Bash scripts for repetitive database and deployment tasks.',
      'Helped standardize deployment procedures and day-to-day maintenance.',
    ],
    skills: ['Linux', 'Sangfor MCS', 'Cloudflare', 'PostgreSQL', 'Bash'],
  },
  {
    id: 'seaversity-intern',
    role: 'IT Intern',
    company: 'Seaversity, Inc.',
    logo: '/images/organizations/seaversity.png',
    type: 'Internship',
    period: 'Aug 2025 – Nov 2025',
    location: 'Philippines · On-site',
    current: false,
    description: 'My first hands-on experience supporting production Linux servers and Moodle operations.',
    details: ['I assisted the IT team with daily server operations and learned how the pieces of a production LMS environment fit together.'],
    highlights: [
      'Helped with user management, service monitoring, updates, and backups.',
      'Supported VM provisioning and troubleshooting for web and database services.',
      'Learned deployment documentation and infrastructure maintenance practices.',
    ],
    skills: ['Linux', 'Moodle', 'Nginx', 'PostgreSQL', 'Redis'],
  },
];

export const skillGroups = [
  { label: 'Infrastructure & operations', skills: ['Linux', 'Rocky Linux', 'Sangfor MCS', 'Nginx', 'PostgreSQL', 'Redis', 'Moodle'] },
  { label: 'Development', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Flutter', 'Dart', 'Express', 'MySQL', 'Firebase'] },
  { label: 'Automation & tools', skills: ['Bash', 'Git', 'Cloudflare', 'NPMplus', 'Tailscale', 'MinIO', 'NFS'] },
];

export const education = {
  school: 'St. Dominic College of Asia',
  logo: '/images/organizations/st-dominic.png',
  degree: 'Bachelor of Science in Information Technology',
  period: '2022 – 2026',
};
