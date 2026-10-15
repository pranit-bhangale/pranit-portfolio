import React from 'react';
import type { BlogPost } from '../../assets/data/types';

interface BlogCardProps {
  post: BlogPost;
  onClick: (e: React.MouseEvent, post: BlogPost) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <div
      className="group relative flex flex-col items-stretch glass-card cursor-pointer w-full h-full"
      onClick={(e) => onClick(e, post)}
    >

      <div className="p-6 sm:p-8 relative z-10 flex flex-col w-full h-full">
        {/* Meta Information */}
        <div className="flex items-center mb-4 text-[10px] font-bold text-primary uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
          <span>{post.date}</span>
        </div>

        <h3 className="text-xl font-bold text-text dark:text-zinc-100 mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
          {post.title}
        </h3>

        <p className="text-muted dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 overflow-hidden text-ellipsis font-medium">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-bold rounded-full uppercase tracking-widest border border-primary/10 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read More Link */}
        <div className="pt-4 flex justify-between items-center w-full border-t border-glass-border">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] flex items-center group-hover:opacity-80 transition-opacity">
            Read Article
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

BlogCard.displayName = 'BlogCard';

export default BlogCard;
