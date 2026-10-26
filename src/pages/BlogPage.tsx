import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, useScroll } from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { BlogResponses } from '../components/blog/BlogResponses';
import { blogPosts, formatBlogDate, type BlogPost } from '../data/blog';
import { profile } from '../data/profile';

export function BlogPage({ post }: { post: BlogPost }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll();
  const related = blogPosts.filter((item) => item.id !== post.id)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [post.id]);

  return (
    <>
      <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-14 z-40 h-0.5 origin-left bg-brand" />
      <article className="mx-auto max-w-[680px] sm:px-6">
        <a href="/blog" className="-ml-1 mb-8 inline-flex min-h-11 items-center gap-2 rounded px-1 py-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
          <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />Back to blog
        </a>
        <header>
          <h1 ref={heading} tabIndex={-1} className="text-[32px] font-bold leading-[1.15] tracking-tight text-gray-900 focus:outline-none sm:text-[42px]">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>
          <div className="mt-8 flex items-center gap-3 border-b border-gray-200 pb-6">
            <img src={profile.avatar} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full border border-gray-200 bg-gray-100 object-cover" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-900">{profile.name}</span>
                <img src={profile.badge} alt="Profile badge" className="h-3.5 w-3.5" />
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><CalendarIcon aria-hidden="true" className="h-3.5 w-3.5" /><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time></span>
                <span aria-hidden="true">•</span>
                <span className="flex items-center gap-1"><ClockIcon aria-hidden="true" className="h-3.5 w-3.5" />{post.readTime}</span>
              </div>
            </div>
          </div>
        </header>
        <img src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} className="mt-8 h-auto w-full rounded-lg" />
        <div className="pt-8">
          {post.body.map((block, index) => block.type === 'image' ? (
            <figure key={index} className="my-8">
              <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" className="h-auto w-full rounded-lg" />
            </figure>
          ) : block.type === 'heading' ? (
            <h2 key={index} className="mb-3 mt-10 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{block.text}</h2>
          ) : (
            <ReactMarkdown key={index} components={{
              p: ({ children }) => <p className="mb-5 text-[17px] leading-[1.75] text-gray-800">{children}</p>,
              ul: ({ children }) => <ul className="my-6 list-disc space-y-2.5 pl-5 text-[17px] leading-relaxed text-gray-800 marker:text-gray-300">{children}</ul>,
              a: ({ href, children }) => <a href={href} className="text-brand underline underline-offset-2 hover:text-blue-700">{children}</a>,
              hr: () => <hr className="my-8 border-gray-200" />,
            }}>{block.text}</ReactMarkdown>
          ))}
        </div>
        <ul className="mt-10 flex flex-wrap gap-2 border-t border-gray-200 pt-6">
          {post.tags.map((tag) => <li key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">{tag}</li>)}
        </ul>
        <BlogResponses key={post.id} postId={post.id} />
      </article>
      {related.length > 0 && (
        <section aria-labelledby="related-blogs-heading" className="mb-16 mt-16 border-t border-gray-200 pt-8">
          <h2 id="related-blogs-heading" className="mb-4 text-sm font-semibold">More blogs</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <a key={item.id} href={`/blog/${item.id}`} className="group min-w-0 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                <div className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <img src={item.cover.src} alt="" width={item.cover.width} height={item.cover.height} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.02]" />
                </div>
                <h3 className="mt-3 text-sm font-semibold transition-colors group-hover:text-brand">{item.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">{item.excerpt}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <time dateTime={item.publishedAt}>{formatBlogDate(item.publishedAt)}</time>
                  <span aria-hidden="true">•</span>
                  <span>{item.readTime}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
