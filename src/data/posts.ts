export interface PostImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Post {
  id: string;
  content: string;
  title?: string;
  publishedAt: string;
  images?: PostImage[];
  blogPostId?: string;
  projectId?: string;
  engagement?: { likes: number; comments: number; shares: number };
  preview?: boolean;
}

export const posts: Post[] = [
  {
    id: 'automating-lms-provisioning',
    title: 'Automating LMS provisioning with Ansible',
    publishedAt: '2026-03',
    content: "Just automated something I used to do manually\n\nI've been managing LMS servers for clients, and every time we provision a new one, it meant SSH-ing in, editing config files, updating databases, restarting services... the same steps every single time.\n\nThis week I finally tried Ansible for the first time.\n\nOne playbook. One command. Done.\n\nStill a lot to learn, but this is a huge step up from manual configs.",
    images: [{
      src: '/images/posts/ansible-provisioning/playbook-run.png',
      alt: 'Ansible playbook output showing Moodle post-clone provisioning tasks for PostgreSQL, Moodle configuration, Nginx, and PHP-FPM, ending with zero failed or unreachable tasks.',
      width: 787,
      height: 739,
    }],
    engagement: { likes: 36, comments: 5, shares: 3 },
  },
  {
    id: 'building-betterbacoor',
    publishedAt: '2026-09-28',
    content: "I built BetterBacoor, inspired by BetterGov.ph and the BetterLGU community.\n\nI wanted to make it easier to find what you need before visiting a government office in Bacoor. It brings service requirements, office contacts, and official links into one place.\n\nIt's an unofficial, community-run guide and it's open source. You can find the website and code in the project below.",
    projectId: 'betterbacoor',
    engagement: { likes: 42, comments: 6, shares: 8 },
  },
  {
    id: 'a-portfolio-with-personality',
    title: 'A portfolio with personality',
    publishedAt: '2026-09-24',
    content: "Hot take: The best portfolio is one that doesn't look like a portfolio. Show your thinking, your process, and your personality, not just polished final screenshots.",
    engagement: { likes: 89, comments: 12, shares: 5 },
  },
  {
    id: 'building-social-portfolio',
    title: 'Building my social portfolio',
    publishedAt: '2026-08-03',
    engagement: { likes: 27, comments: 4, shares: 2 },
    content: "I'm building my own portfolio to showcase my projects and share what I'm learning. I wanted it to feel a bit more like me, so I went with a social media style.\n\nThere will be posts, project updates, and blogs about my experience. A place where I can share the work and the things that happen along the way.\n\nI'm also making it open source so others can use it too.",
  },
  {
    id: 'starting-before-i-felt-ready',
    publishedAt: '2026-08-18',
    content: '',
    blogPostId: 'starting-before-i-felt-ready',
    engagement: { likes: 64, comments: 9, shares: 7 },
  },
];
