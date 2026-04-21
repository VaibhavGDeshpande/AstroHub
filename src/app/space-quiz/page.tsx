'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, AlertCircle } from 'lucide-react';
import LoaderWrapper from '@/components/Loader';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';
import SectionTitle from '@/components/SectionTitle';

type Tag = 'space' | 'space_exploration' | 'astronomy' | 'astrophysics';

const allTags: Tag[] = ['space', 'space_exploration', 'astronomy', 'astrophysics'];
const difficulties = ['easy', 'medium', 'hard'] as const;
type Difficulty = typeof difficulties[number];

export default function QuizSelectionPage() {
  const router = useRouter();
  const [limit, setLimit] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [tags, setTags] = useState<Tag[]>(['space']);
  const [isLoading, setIsLoading] = useState(false);

  function toggleTag(tag: Tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleLimitChange(value: string) {
    setLimit(value);
  }

  function getLimitError() {
    if (!limit) return null;
    
    const numLimit = Number(limit);
    if (isNaN(numLimit)) {
      return 'Please enter a valid number';
    }
    if (numLimit < 1) {
      return 'Number must be at least 1';
    }
    if (numLimit > 20) {
      return 'Number cannot exceed 20';
    }
    return null;
  }

  const limitError = getLimitError();
  const isLimitValid = !limitError && limit !== '';

  function startQuiz() {
    if (tags.length === 0) {
      alert('Please select at least one tag');
      return;
    }

    if (!isLimitValid) {
      alert('Please enter a valid number of questions between 1-20');
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
    <LoaderWrapper>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-36 right-20 w-64 h-64 bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-36 bg-pink-500/20 blur-[100px]" />
        </div>

        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50 hidden md:block">
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
          <SectionTitle 
            title="Space Science Trivia" 
            subtitle="Test your cosmic knowledge!"
          />

          {/* Settings Card */}
          <div className="max-w-xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg p-6 sm:p-8">
            <div className="space-y-5">
              {/* Number Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Number of Questions (1-20)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg bg-slate-900/50 border text-sm text-white focus:ring-1 outline-none transition-all ${
                    limitError 
                      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20' 
                      : isLimitValid
                      ? 'border-green-500/60 focus:border-green-500 focus:ring-green-500/20'
                      : 'border-slate-600/40 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter 1-20"
                />
                {limitError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-xs mt-2"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{limitError}</span>
                  </motion.div>
                )}
                {isLimitValid && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-xs mt-2"
                  >
                    ✓ Valid number of questions
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
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
                disabled={isLoading || !isLimitValid || tags.length === 0}
                className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>Launch Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
}