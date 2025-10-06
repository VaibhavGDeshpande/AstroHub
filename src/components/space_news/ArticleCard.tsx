// components/ArticleCard.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Article } from "@/api_service/space_news";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative rounded-lg overflow-hidden bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-900">
        <img
          src={article.image_url}
          alt={article.title}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="224" viewBox="0 0 400 224"%3E%3Crect fill="%231e293b" width="400" height="224"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23475569" font-family="sans-serif" font-size="14"%3ENo Image Available%3C/text%3E%3C/svg%3E';
          }}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient Overlay - Lighter for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="font-semibold text-xl mb-3 text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
          {article.title}
        </h2>
        
        <div className="text-sm text-slate-400 mb-3 flex items-center gap-2">
          <span className="text-purple-400">✦</span>
          <span className="line-clamp-1">
            {article.authors.length > 0 
              ? article.authors.map((a) => a.name).join(", ")
              : "Unknown Author"}
          </span>
        </div>
        
        <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-4">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-700/50">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(article.published_at).toLocaleDateString()}
          </span>
          <span className="text-purple-400 font-medium">{article.news_site}</span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5" />
      </div>
    </motion.a>
  );
}