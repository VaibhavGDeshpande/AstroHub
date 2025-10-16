"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";
import LoaderWrapper from "../Loader";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  creator: string;
  categories: string[];
  imageUrl: string | null;
}

export default function ArticleList() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/spacenews', { cache: "no-store" });
      const result = await response.json();

      if (result.success) {
        setArticles(result.data.items);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to load articles");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedArticles = articles.slice(startIndex, endIndex);
  const hasNextPage = endIndex < articles.length;
  const hasPrevPage = currentPage > 0;

  // Loading State
  if (loading) {
    return (
      <LoaderWrapper/>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border border-red-500/50 rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchArticles();
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
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
            Latest articles from SpaceNews
          </p>
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {displayedArticles.map((article, index) => (
            <ArticleCard key={startIndex + index} article={article} index={index} />
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
            disabled={!hasPrevPage}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple-500/50 disabled:hover:border-slate-600/40"
          >
            <svg className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <button
            disabled={!hasNextPage}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 backdrop-blur-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:from-slate-800/50 disabled:to-slate-800/50 border border-purple-500/40 disabled:border-slate-600/40"
          >
            <span>Next</span>
            <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
