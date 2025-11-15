import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

if (!OPENROUTER_API_KEY) {
  console.warn('OPENROUTER_API_KEY is not set.');
}

const DEFAULT_SYSTEM_PROMPT =
  'You are an astronomy expert. Explain concepts clearly with short, factual responses.Give in 20-30 sentences';

type RetryableError = {
  status?: number | string;
  code?: number | string;
  response?: {
    status?: number | string;
  };
  message?: string;
};

type OpenRouterChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    } | null;
  }> | null;
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
    const {
      model = 'deepseek/deepseek-chat-v3.1:free',
      prompt,
      systemPrompt = DEFAULT_SYSTEM_PROMPT,
      temperature = 0.5,
    } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API key missing' }, { status: 500 });
    }

    const extraHeaders: Record<string, string> = {};

    const completion = await withBackoff(async () => {
      const res = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          ...extraHeaders,
        },
        body: JSON.stringify({
          model,
          temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        }),
      });

      const payload = (await res.json().catch(() => null)) as
        | (OpenRouterChatResponse & { error?: string; message?: string })
        | null;

      if (!res.ok) {
        const message =
          (payload && (typeof payload.error === 'string' ? payload.error : undefined)) ||
          (payload && (typeof payload.message === 'string' ? payload.message : undefined)) ||
          `${res.status} ${res.statusText}`;
        const err: RetryableError = { status: res.status, message };
        throw err;
      }

      if (!payload) {
        throw { status: res.status, message: 'Empty response from OpenRouter' } as RetryableError;
      }

      return payload;
    });

    const rawText = completion?.choices?.[0]?.message?.content ?? null;
    const text = rawText
      ? rawText.replace(/<｜begin▁of▁sentence｜>/g, '').trim()
      : null;

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
