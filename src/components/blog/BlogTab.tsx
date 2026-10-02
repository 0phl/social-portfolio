import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import { blogPosts, formatBlogDate } from '../../data/blog';

export function BlogTab({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Blog</h2>
        <p className="mt-1 text-sm text-gray-500">My experiences, things I learn, and life outside the code.</p>
      </div>
      <div className="divide-y divide-gray-100">
        {blogPosts.map((post) => (
          <motion.a
            key={post.id}
            id={`blog-card-${post.id}`}
            href={`#blog/${post.id}`}
            initial={false}
            animate={{ opacity: active ? 1 : 0, x: active || reduceMotion ? 0 : -10 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 24 }}
            className="group flex w-full scroll-mt-36 gap-4 p-5 text-left transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand sm:gap-6"
          >
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-brand">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-gray-600">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1"><ClockIcon aria-hidden="true" className="h-3.5 w-3.5" />{post.readTime}</span>
                <span aria-hidden="true">•</span>
                <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                <span className="ml-1 flex items-center gap-1 text-brand opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Read <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" /></span>
              </div>
            </div>
            <img src={post.cover.src} alt="" width={post.cover.width} height={post.cover.height} loading="lazy" className="hidden h-24 w-32 shrink-0 rounded border border-gray-200 bg-gray-100 object-cover sm:block" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
