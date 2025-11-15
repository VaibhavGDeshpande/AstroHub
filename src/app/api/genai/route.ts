// /app/api/genai/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.NEXT_GEMINI_API_KEY;
if (!API_KEY) {
  console.warn('GENAI_API_KEY is not set.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

type RetryableError = {
  status?: number | string;
  code?: number | string;
  response?: {
    status?: number | string;
  };
  message?: string;
};

const getStatusCode = (err: unknown): number | undefined => {
  if (typeof err === 'object' && err !== null) {
    const { status, code, response } = err as RetryableError;
    const rawStatus = status ?? code ?? response?.status;
    if (typeof rawStatus === 'number') return rawStatus;
    if (typeof rawStatus === 'string') {
      const parsed = Number(rawStatus);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
  }
  return undefined;
};

const getErrorMessage = (err: unknown): string | undefined => {
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const { message } = err as RetryableError;
    if (typeof message === 'string') return message;
  }
  return undefined;
};

async function withBackoff<T>(fn: () => Promise<T>, attempts = 6, baseMs = 300): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const status = getStatusCode(err);
      const isTransient = status ? [429, 500, 502, 503, 504].includes(Number(status)) : false;
      if (!isTransient || i === attempts - 1) throw err;
      const wait = Math.floor(baseMs * Math.pow(2, i) * (0.5 + Math.random() * 0.5));
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw new Error('withBackoff: All attempts failed');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model = 'gemini-2.0-flash-lite', prompt } = body;
    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });

    const result = await withBackoff(() =>
      ai.models.generateContent({
        model,
        contents: prompt,
      }),
    );
    const text =
      (result && (result.text || result?.candidates?.[0]?.content?.parts?.[0]?.text)) ||
      null;

    if (!text) {
      return NextResponse.json({ error: 'No text returned from model' }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (err: unknown) {
    const status = getStatusCode(err) ?? 500;
    const detail = getErrorMessage(err) ?? String(err);
    console.error('GenAI error:', detail);
    return NextResponse.json({ error: 'AI request failed', detail }, { status });
  }
}
