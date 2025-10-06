
import { Suspense } from 'react';
import QuizContent from '@/components/Space-Quiz/QuizContent';
import LoaderWrapper from '@/components/Loader';

export default function QuizQuestionsPage() {
  return (
    <Suspense fallback={<LoaderWrapper />}>
      <QuizContent />
    </Suspense>
  );
}
