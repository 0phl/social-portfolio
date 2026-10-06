import type { profile } from '../data/profile';
import type { experience, education, skillGroups } from '../data/about';
import type { Project } from '../data/projects';
import type { Post } from '../data/posts';
import type { BlogPost } from '../data/blog';

interface KnowledgeSource {
  profile: typeof profile;
  experience: typeof experience;
  education: typeof education;
  skillGroups: typeof skillGroups;
  projects: Project[];
  posts: Post[];
  blogPosts: BlogPost[];
}

function newestFirst<T extends { id: string; publishedAt: string }>(items: T[]): T[] {
  const dated = items.map((item) => {
    const time = Date.parse(item.publishedAt);
    if (!Number.isFinite(time)) throw new Error(`Invalid publication date for ${item.id}: ${item.publishedAt}`);
    return { item, time };
  });
  return dated.sort((a, b) => b.time - a.time).map(({ item }) => item);
}

export function buildKnowledge(source: KnowledgeSource) {
  const links: Record<string, string> = {
    '/#projects': 'Projects', '/#posts': 'Posts', '/#blog': 'Blog',
    '/#about/bio': 'About Ronan', '/#about/experience': 'Experience', '/#about/skills': 'Skills',
  };
  const add = (url: string, label: string) => {
    if (Object.prototype.hasOwnProperty.call(links, url) && url.startsWith('/#')) throw new Error(`Duplicate portfolio route: ${url}`);
    if (url.startsWith('/#') || url.startsWith('https://')) links[url] = label;
  };
  for (const [label, url] of Object.entries(source.profile.links)) add(url, label);
  const publicProjects = source.projects.map(({ id, title, category, type, description, contribution, note, highlights, featureGroups, technologies, repository, website }) => {
    const url = `/#projects/${id}`;
    add(url, title);
    if (repository) add(repository, `${title} source`);
    if (website) add(website, `${title} website`);
    return { id, title, url, category, type, description, contribution, note, highlights, featureGroups, technologies, repository, website };
  });
  const publicPosts = newestFirst(source.posts.filter((post) => !post.preview)).map(({ id, title, content, publishedAt, projectId, blogPostId }) => {
    const url = `/#posts/${id}`;
    const displayTitle = title ?? (content.split(/\r?\n/)[0] || source.blogPosts.find((blog) => blog.id === blogPostId)?.title || 'Portfolio post');
    add(url, displayTitle);
    return { id, title: displayTitle, url, content, publishedAt, projectId, blogPostId };
  });
  const blogs = newestFirst(source.blogPosts).map(({ id, title, excerpt, publishedAt, tags, body }) => {
    const url = `/#blog/${id}`;
    add(url, title);
    return { id, title, url, excerpt, publishedAt, tags, text: body.flatMap((block) => block.type === 'image' ? [] : [block.text]) };
  });
  const summarizeLatest = (item?: { id: string; title: string; publishedAt: string; url: string }) => item
    ? { id: item.id, title: item.title, publishedAt: item.publishedAt, url: item.url }
    : null;
  const { name, title, bio, about, location } = source.profile;
  const reference = JSON.stringify({
    profile: { name, title, bio, about, location },
    recency: {
      basis: 'Publication date, newest first. Posts and blogs are separate catalogs. Month-only dates retain month precision; never invent their day. Projects have no publication dates, so their order does not establish recency.',
      latestPost: summarizeLatest(publicPosts[0]),
      latestBlog: summarizeLatest(blogs[0]),
    },
    experience: source.experience.map(({ role, company, type, period, location, current, description, details, highlights, skills }) => ({ role, company, type, period, location, current, description, details, highlights, skills })),
    education: { school: source.education.school, degree: source.education.degree, period: source.education.period },
    skills: source.skillGroups, projects: publicProjects, posts: publicPosts, blogs,
  }, null, 2);
  if (new TextEncoder().encode(reference).length > 200 * 1024) throw new Error('Assistant reference is too large (200 KiB). Review the published content before building.');
  const projectLinks = publicProjects.map(({ title, url, repository, website }) => ({ title, url, repository, website }));
  return { reference, links, projectLinks };
}
