import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Reusable Markdown renderer that applies unified portfolio styling.
 * Follows SOLID principles by decoupling markdown logic from page components.
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content = '', 
  className = "",
  compact = false 
}) => {
  const typographyClasses = compact
    ? `prose prose-sm sm:prose-base dark:prose-invert max-w-none
       prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-100
       prose-h1:text-xl sm:prose-h1:text-2xl prose-h1:mt-6 prose-h1:mb-3 prose-h1:leading-snug
       prose-h2:text-lg sm:prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
       prose-h3:text-base sm:prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
       prose-p:text-sm sm:prose-p:text-[15px] prose-p:leading-relaxed prose-p:my-2.5 prose-p:text-zinc-300
       prose-li:text-sm sm:prose-li:text-[15px] prose-li:my-1 prose-li:text-zinc-300
       prose-ul:my-2 prose-ol:my-2
       prose-strong:text-zinc-100 prose-strong:font-semibold
       prose-hr:my-6 prose-hr:border-white/10
       prose-pre:my-3 prose-pre:p-4 prose-pre:rounded-xl prose-pre:bg-[#121218]/90 prose-pre:border prose-pre:border-white/10 prose-pre:shadow-lg
       prose-code:text-xs sm:prose-code:text-[13px] prose-code:font-mono prose-code:text-indigo-300 prose-code:before:content-none prose-code:after:content-none
       prose-blockquote:border-l-primary prose-blockquote:bg-white/[0.02] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:my-3`
    : `prose prose-lg dark:prose-invert max-w-none
       prose-pre:bg-[#121218]/90 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
       prose-code:font-mono prose-code:text-indigo-300 prose-code:before:content-none prose-code:after:content-none`;

  return (
    <div className={`${typographyClasses} ${className}`}>
      <ReactMarkdown
        components={{
          ul: ({ node: _node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
          ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
          li: ({ node: _node, ...props }) => <li className="text-zinc-300" {...props} />,
          code: ({ node: _node, className: codeClass, children, ...props }) => {
            const isInline = !codeClass && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 text-xs sm:text-[13px] font-mono border border-white/5"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={codeClass} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
