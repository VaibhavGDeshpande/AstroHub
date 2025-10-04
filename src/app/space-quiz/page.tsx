'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Star } from 'lucide-react';
import LoaderWrapper from '@/components/Loader';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

type Tag = 'space' | 'space_exploration' | 'astronomy' | 'astrophysics';

const allTags: Tag[] = ['space', 'space_exploration', 'astronomy', 'astrophysics'];
const difficulties = ['easy', 'medium', 'hard'] as const;

export default function QuizSelectionPage() {
  const router = useRouter();
  const [limit, setLimit] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('hard');
  const [tags, setTags] = useState<Tag[]>(['space']);
  const [isLoading, setIsLoading] = useState(false);

  function toggleTag(tag: Tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function startQuiz() {
    if (tags.length === 0) {
      alert('Please select at least one tag');
      return;
    }

    setIsLoading(true);
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      difficulty: difficulty,
      tags: tags.join(','),
    });
    router.push(`/space-quiz/questions?${queryParams.toString()}`);
  }

  if (isLoading) return <LoaderWrapper />;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-20 w-72 h-72 bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-36 right-20 w-64 h-64 bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-36 bg-pink-500/20 blur-[100px]" />
      </div>

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300 text-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <HomeIcon className="h-4 w-4 hidden sm:block" />
            <span>Back</span>
          </Link>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-8">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-7 h-7 text-yellow-400 mr-2 animate-pulse" />
            <Rocket className="w-10 h-10 text-blue-400" />
            <Star className="w-7 h-7 text-yellow-400 ml-2 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            Space Science Trivia
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Test your cosmic knowledge!
          </p>
        </div>

        {/* Settings Card */}
        <div className="max-w-xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg p-6 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Number of Questions (1-20)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={limit}
                onChange={(e) =>
                  setLimit(Math.min(20, Math.max(1, Number(e.target.value))))
                }
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/40 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/40 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d} className="bg-slate-900">
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Select Topics
              </label>
              <div className="grid grid-cols-2 gap-3">
                {allTags.map((tag) => (
                  <label
                    key={tag}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                      tags.includes(tag)
                        ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                        : 'bg-slate-900/50 border border-slate-600/40 text-gray-300 hover:border-slate-500/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-1 focus:ring-blue-500/50 bg-slate-700 border-slate-500"
                    />
                    <span className="ml-3 font-medium capitalize text-sm">
                      {tag.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              <Rocket className="w-5 h-5" />
              <span>Launch Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
