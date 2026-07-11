import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FieldNote() {
  const params = useParams<{ slug: string }>();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const { data: article, isLoading, isError } = useQuery<Article>({
    queryKey: ["article", params.slug],
    queryFn: () => fetch(`${base}/api/articles/${params.slug}`).then((r) => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    }),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-stone-600 font-mono text-sm uppercase tracking-widest">Field note not found</p>
        <Link href="/about" className="text-amber-600 text-sm hover:text-amber-500 transition-colors">
          ← Back to About
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pt-28 pb-32">
      {/* Cover image */}
      {article.cover_image_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-[1100px] mx-auto px-6 md:px-12 mb-12"
        >
          <div className="relative w-full aspect-[21/9] overflow-hidden rounded-2xl shadow-sm">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      )}

      <div className="max-w-[720px] mx-auto px-6 md:px-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-600 hover:text-amber-600 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Field Notes
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-amber-600 mb-4">
            {formatDate(article.created_at)}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-semibold tracking-tight leading-tight mb-6 text-stone-900">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-xl text-stone-900 font-normal leading-relaxed border-l-2 border-amber-400 pl-6">
              {article.excerpt}
            </p>
          )}
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="prose-wildpixels"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 pt-10 border-t border-stone-200 flex items-center justify-between"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-600 hover:text-amber-600 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Field Notes
          </Link>
          <p className="text-xs text-stone-500 font-mono">Wildpixels</p>
        </motion.div>
      </div>
    </div>
  );
}
