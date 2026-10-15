import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SectionWrapper from '../components/common/SectionWrapper';
import ScrollReveal from '../components/common/ScrollReveal';
import { blogData } from '../assets/data/blog';
import SectionHeader from '../components/common/SectionHeader';
import BlogCard from '../components/blog/BlogCard';
import type { BlogPost } from '../assets/data/types';

const Blog: React.FC = () => {
  const navigate = useNavigate();

  const handleReadArticle = useCallback((e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault();
    if (post.content) {
      navigate(`/blog/${post.id}`);
    } else if (post.link && post.link !== '#') {
      window.open(post.link, '_blank');
    } else {
      toast.info("This article will be available soon!", {
        position: "bottom-center",
        theme: "dark",
      });
    }
  }, [navigate]);

  // Duplicate array multiple times for infinite marquee effect
  const marqueeItems = [...blogData, ...blogData, ...blogData, ...blogData];

  return (
    <SectionWrapper id="blog">
      <ScrollReveal className="w-full max-w-[100vw] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <SectionHeader title="Blog" subtitle="Latest Articles & Technical Writing" />
        </div>

        <div className="w-full mt-12 relative overflow-hidden py-4 cursor-grab active:cursor-grabbing">
          <div className="animate-marquee gap-6 sm:gap-8 items-stretch px-4">
            {marqueeItems.map((post, index) => (
              <div key={`${post.id}-${index}`} className="w-[300px] sm:w-[400px] flex-shrink-0 flex flex-col items-stretch h-auto">
                <BlogCard
                  post={post}
                  onClick={(e) => handleReadArticle(e, post)}
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
};

export default Blog;
