// components/ArticleList.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSpaceflightArticles, Article } from "@/api_service/space_news";
import ArticleCard from "./ArticleCard";
import LoaderWrapper from "@/components/Loader";
import ErrorMessage from "@/components/Error";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const fetchArticles = (url?: string) => {
    setLoading(true);
    setError(null);
    
    const fetchAction = url
      ? fetch(url, { cache: "no-store" }).then((r) => r.json())
      : getSpaceflightArticles({ limit: 10, offset: 0 });

    Promise.resolve(fetchAction)
      .then((data) => {
        setArticles(data.results);
        setNextPage(data.next ?? null);
        setPrevPage(data.previous ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load articles");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (error && !loading) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => {
          setError(null);
          fetchArticles();
        }}
      />
    );
  }

  return (
    <LoaderWrapper isVisible={loading} minDuration={1000}>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Space News
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Latest articles from spaceflight news
            </p>
          </motion.div>

          {/* Articles Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mb-8"
          >
            <button
              disabled={!prevPage}
              onClick={() => fetchArticles(prevPage!)}
              className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-500/50 disabled:hover:border-slate-600/40"
            >
              <ChevronLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Previous</span>
            </button>
            
            <button
              disabled={!nextPage}
              onClick={() => fetchArticles(nextPage!)}
              className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 backdrop-blur-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:from-slate-800/50 disabled:to-slate-800/50 border border-purple-500/40 disabled:border-slate-600/40"
            >
              <span>Next</span>
              <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </LoaderWrapper>
  );
}