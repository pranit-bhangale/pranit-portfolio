import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogData } from '../assets/data/blog';
import { cardVariants } from '../constants/animations';
import MarkdownRenderer from '../components/common/MarkdownRenderer';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = useMemo(() => blogData.find(p => p.id === (id ? parseInt(id, 10) : -1)), [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-text mb-4">Post Not Found</h2>
        <Link to="/#blog" className="text-primary hover:underline">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <motion.article
      className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 pt-28 pb-16 sm:pb-20"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Link to="/#blog" className="inline-flex items-center text-primary text-xs font-bold uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity group">
        <span className="mr-2 transform transition-transform group-hover:-translate-x-1">←</span> Back to Portfolio
      </Link>

      <header className="mb-8 border-b border-glass-border pb-6">
        <div className="flex items-center mb-2 text-[11px] font-bold text-primary uppercase tracking-[0.2em]">
          <span>{post.date}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text dark:text-white mb-4 tracking-tight leading-snug">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <MarkdownRenderer content={post.content} compact />
    </motion.article>
  );
};

export default BlogPostPage;
