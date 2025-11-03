'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FaSun } from 'react-icons/fa'
import { MessageCircleIcon } from 'lucide-react'
import { IoClose } from 'react-icons/io5'
import { GoogleGenAI } from '@google/genai'

type ChatMessage = { sender: 'user' | 'bot'; text: string; ts: number }

const STORAGE_KEY = 'astrobot_session_messages_v1'

export default function AstroBot() {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[]
        if (Array.isArray(parsed)) setMessages(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {}
  }, [messages])

  const ai = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ' '
    return new GoogleGenAI({ apiKey: key })
  }, [])

  const send = async () => {
    const term = input.trim()
    if (!term || loading) return

    const newMessage: ChatMessage = { sender: 'user', text: term, ts: Date.now() }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `You are an astronomy expert.\nExplain the term "${term}" concisely in markdown with sections: Term Name, Definition, Key Facts (bullets), Significance.`,
      })

      const text = (response as any)?.text || (response as any)?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.'
      const botMessage: ChatMessage = { sender: 'bot', text, ts: Date.now() }
      setMessages(prev => [...prev, botMessage])
    } catch (e) {
      const botMessage: ChatMessage = { sender: 'bot', text: 'Something went wrong.', ts: Date.now() }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setLoading(false)
    }
  }

  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // Coordinate with other widgets: add class on <html> and notify
  useEffect(() => {
    if (open) {
      document.documentElement.classList.add('astrobot-open')
      try { window.dispatchEvent(new CustomEvent('astrobot:open')) } catch {}
    } else {
      document.documentElement.classList.remove('astrobot-open')
      try { window.dispatchEvent(new CustomEvent('astrobot:close')) } catch {}
    }
    return () => {
      document.documentElement.classList.remove('astrobot-open')
    }
  }, [open])

  return (
    <>
      {/* Floating launcher (bottom-right, lowest position) */}
      <div
        className="fixed bottom-4 right-4 z-[2147483648]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && (
          <div className="absolute -top-10 right-10  bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-lg pointer-events-none">
            Ask astronomy terms
          </div>
        )}
        <button
          aria-label="Open AstroBot"
          className="relative h-12 w-12 rounded-full bg-amber-400 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          onClick={() => setOpen(true)}
        >
          <span className="absolute inset-0 rounded-full animate-ping bg-amber-300 opacity-30"></span>
          <MessageCircleIcon className="relative text-white text-xl drop-shadow" />
        </button>
      </div>

      {/* Drawer */}
      <div className={`fixed inset-0 z-[2147483648] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside
          className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-gray-900 text-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
          role="dialog"
          aria-modal="true"
          aria-label="AstroBot Chat"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FaSun className="text-amber-300" />
              <h2 className="font-semibold">AstroBot — Terms</h2>
            </div>
            <button aria-label="Close" className="p-2 rounded hover:bg-white/5" onClick={() => setOpen(false)}>
              <IoClose className="text-xl" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={m.ts + '_' + i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-gray-700 text-gray-100 rounded-bl-sm'}`}>
                  {m.sender === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="text-amber-300">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc ml-5 space-y-1">{children}</ul>,
                        li: ({ children }) => <li>{children}</li>,
                        h1: ({ children }) => <h1 className="text-lg font-semibold mb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-semibold mb-1">{children}</h2>,
                        code: ({ children }) => <code className="bg-black/30 rounded px-1 py-0.5">{children}</code>,
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex items-center">
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-typing-dot"></span>
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-typing-dot [animation-delay:120ms]"></span>
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-typing-dot [animation-delay:240ms]"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about any astronomy term..."
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={send} disabled={loading || !input.trim()} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50">Send</button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <button className="hover:text-gray-200" onClick={() => { if (confirm('Clear this session chat?')) { setMessages([]); try { sessionStorage.removeItem(STORAGE_KEY) } catch {} } }}>Clear session chat</button>
              <span>Session saved</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
