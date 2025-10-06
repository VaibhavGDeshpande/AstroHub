import { useState, useEffect } from 'react';
import axios from 'axios';

type Difficulty = 'easy' | 'medium' | 'hard';
type Tag = 'space' | 'space_exploration' | 'astronomy' | 'astrophysics';

interface TriviaQuestion {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  tags: string[];
  type: string;
  difficulty: string;
  regions: string[];
  isNiche: boolean;
}

interface FetchTriviaParams {
  limit: number;
  difficulty: Difficulty;
  tags: Tag[];
}

export function useFetchTrivia(params: FetchTriviaParams) {
  const { limit, difficulty, tags } = params;
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (limit <= 0 || tags.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tagsParam = tags.join(',');
        const url = `https://the-trivia-api.com/api/questions?categories=science&limit=${limit}&difficulty=${difficulty}&tags=${tagsParam}`;
        const response = await axios.get<TriviaQuestion[]>(url);
        setQuestions(response.data);
      } catch {
        setError('Failed to fetch trivia questions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [limit, difficulty, tags]);

  return { questions, loading, error };
}
