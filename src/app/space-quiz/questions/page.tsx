'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFetchTrivia } from '@/api_service/space_quiz_mcq';
import { Trophy, RotateCcw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import LoaderWrapper from '@/components/Loader';

type Tag = 'space' | 'space_exploration' | 'astronomy' | 'astrophysics';

interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function QuizQuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize parameters to prevent infinite re-renders
  const quizParams = useMemo(() => {
    const limit = parseInt(searchParams.get('limit') || '10');
    const difficulty = (searchParams.get('difficulty') || 'hard') as 'easy' | 'medium' | 'hard';
    const tags = (searchParams.get('tags')?.split(',') || ['space']) as Tag[];
    
    return { limit, difficulty, tags };
  }, [searchParams]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Use memoized params to prevent unnecessary API calls
  const { questions, loading, error } = useFetchTrivia(quizParams);

  // Memoize shuffled answers to prevent re-shuffling on every render
  const allAnswers = useMemo(() => {
    if (!questions[currentQuestionIndex]) return [];
    
    const current = questions[currentQuestionIndex];
    return [current.correctAnswer, ...current.incorrectAnswers].sort(
      () => Math.random() - 0.5
    );
  }, [questions, currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  function handleAnswerSubmit() {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };

    setUserAnswers([...userAnswers, answer]);
    setShowAnswer(true);
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  }

  function resetQuiz() {
    router.push('/space-quiz');
  }

  const score = userAnswers.filter((a) => a.isCorrect).length;

  if (loading) {
    return <LoaderWrapper />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg p-8 max-w-md">
          <p className="text-red-400 text-center text-lg font-semibold mb-4">Error: {error}</p>
          <button
            onClick={resetQuiz}
            className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300"
          >
            Back to Quiz Setup
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const getMessage = () => {
      if (percentage === 100) return "Perfect! You're a space expert! 🚀";
      if (percentage >= 80) return "Excellent work! 🌟";
      if (percentage >= 60) return "Great job! Keep exploring! 🌙";
      return "Keep learning about the cosmos! ⭐";
    };

    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        </div>

        {/* Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">New Quiz</span>
          </button>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-10">
          <div className="max-w-3xl mx-auto">
            {/* Trophy Section */}
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
                Quiz Complete!
              </h1>
              <p className="text-xl text-gray-400">{getMessage()}</p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-slate-600/40 rounded-lg p-8 mb-8 text-center">
              <p className="text-lg text-gray-300 mb-2">Your Score</p>
              <p className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                {score}/{questions.length}
              </p>
              <p className="text-3xl font-semibold text-pink-400">{percentage.toFixed(0)}%</p>
            </div>

            {/* Review Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6">Review Your Answers</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {userAnswers.map((answer, index) => (
                  <div
                    key={answer.questionId}
                    className={`p-5 rounded-lg border-2 ${
                      answer.isCorrect
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {answer.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white mb-2">
                          Question {index + 1}: {questions[index].question}
                        </p>
                        <p className="text-sm text-gray-300 mb-1">
                          <span className="font-medium">Your answer:</span> {answer.selectedAnswer}
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-sm text-green-400 font-medium">
                            <span className="font-semibold">Correct answer:</span> {answer.correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Take Another Quiz</span>
            </button>
          </div>
        </div>
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

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={resetQuiz}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Exit</span>
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-10">
        <div className="max-w-3xl mx-auto">
          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-blue-400">
                Score: {score}/{currentQuestionIndex}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-600/40">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/40 rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-white leading-relaxed mb-8">
              {currentQuestion?.question}
            </h2>

            <div className="space-y-3 mb-8">
              {allAnswers.map((answer, index) => {
                const isSelected = selectedAnswer === answer;
                const isCorrect = answer === currentQuestion.correctAnswer;
                const showCorrectStyle = showAnswer && isCorrect;
                const showIncorrectStyle = showAnswer && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !showAnswer && setSelectedAnswer(answer)}
                    disabled={showAnswer}
                    className={`w-full p-5 text-left rounded-lg border-2 font-medium transition-all duration-200 ${
                      showCorrectStyle
                        ? 'bg-green-500/20 border-green-500/50 text-green-300'
                        : showIncorrectStyle
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : isSelected
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                        : 'bg-slate-900/50 border-slate-600/40 text-gray-300 hover:border-slate-500/60 hover:bg-slate-900/70'
                    } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{answer}</span>
                      {showCorrectStyle && <CheckCircle className="w-6 h-6 text-green-400" />}
                      {showIncorrectStyle && <XCircle className="w-6 h-6 text-red-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {!showAnswer ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
              >
                Submit Answer
              </button>
            ) : (
              <div className="text-center">
                <div
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-lg mb-4 ${
                    userAnswers[userAnswers.length - 1].isCorrect
                      ? 'bg-green-500/20 text-green-300 border-2 border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border-2 border-red-500/30'
                  }`}
                >
                  {userAnswers[userAnswers.length - 1].isCorrect ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6" />
                      <span>Incorrect</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'View Results 🎉'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
