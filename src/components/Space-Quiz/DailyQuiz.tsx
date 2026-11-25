'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Flame, Share2, Trophy } from 'lucide-react';
import {
  applyResult, currentStreak, dayNumber, localDateKey, questionFor,
  EMPTY_STREAK, type StreakState,
} from '@/lib/dailyQuiz';

const STORAGE_KEY = 'astrohub-daily-quiz';

function loadState(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY_STREAK, ...JSON.parse(raw) } : EMPTY_STREAK;
  } catch {
    return EMPTY_STREAK;
  }
}

export default function DailyQuiz() {
  // The date is read on the client only, so the server never renders a different day than the visitor's.
  const [today, setToday] = useState<string | null>(null);
  const [state, setState] = useState<StreakState>(EMPTY_STREAK);
  const [picked, setPicked] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setToday(localDateKey(new Date()));
    setState(loadState());
  }, []);

  if (!today) return <div className="min-h-[28rem]" aria-busy="true" />;

  const question = questionFor(today);
  const number = dayNumber(today);
  const played = today in state.played;
  const won = state.played[today];
  const streak = currentStreak(state, today);
  // A visitor who already answered today sees the reveal, with the correct option highlighted.
  const showResult = played;

  function answer(option: string) {
    if (played || !today) return;
    setPicked(option);
    const next = applyResult(state, today, option === question.answer);
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private mode or blocked storage: the result still shows, it just won't be remembered.
    }
  }

  async function share() {
    const text = `AstroHub Daily Quiz #${number} ${won ? '✅' : '❌'}${streak > 0 ? ` 🔥${streak}` : ''}\nhttps://www.astrohub.live/space-quiz`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // The visitor closed the share sheet; nothing to do.
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6 text-sm">
        <span className="text-slate-400">Puzzle #{number}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-orange-400 font-semibold" title="Current streak">
            <Flame className="w-4 h-4" aria-hidden /> {streak}<span className="sr-only"> day streak</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-300" title="Best streak">
            <Trophy className="w-4 h-4" aria-hidden /> {state.best}<span className="sr-only"> best streak</span>
          </span>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">{question.q}</h2>

        <div className="grid gap-3">
          {question.options.map((option) => {
            const isAnswer = option === question.answer;
            const isPicked = option === picked;
            const style = !showResult
              ? 'border-slate-600/40 bg-slate-900/50 hover:border-blue-400/60 hover:bg-blue-500/10'
              : isAnswer
                ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200'
                : isPicked
                  ? 'border-red-500/60 bg-red-500/15 text-red-200'
                  : 'border-slate-700/40 bg-slate-900/30 text-slate-500';
            return (
              <button
                key={option}
                onClick={() => answer(option)}
                disabled={showResult}
                className={`flex items-center justify-between text-left px-4 py-3 rounded-xl border transition-colors ${style}`}
              >
                <span>{option}</span>
                {showResult && isAnswer && <CheckCircle className="w-5 h-5 shrink-0" aria-label="Correct answer" />}
                {showResult && isPicked && !isAnswer && <XCircle className="w-5 h-5 shrink-0" aria-label="Your answer" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 space-y-4" aria-live="polite">
            <p className={`font-semibold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
              {won
                ? `Correct! ${streak > 1 ? `That's ${streak} days in a row.` : 'Your streak has started.'}`
                : 'Not this time. Your streak resets, so come back tomorrow.'}
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{question.fact}</p>
            <div className="pt-2">
              <button
                onClick={share}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                <Share2 className="w-4 h-4" aria-hidden /> {copied ? 'Copied!' : 'Share result'}
              </button>
            </div>
            <p className="text-xs text-slate-500">A new question appears at midnight, your local time. Want more? Switch to Custom Quiz above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
