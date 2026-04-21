/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaSun } from 'react-icons/fa'
import { MessageCircleIcon } from 'lucide-react'
import { IoClose } from 'react-icons/io5'
import { useNightMode } from './Hooks/useNightMode'

type ChatMessage = { sender: 'user' | 'bot'; text: string; ts: number }
type MarkdownComponent = (typeof import('react-markdown'))['default']

const STORAGE_KEY = 'astrobot_session_messages_v1'

export default function AstroBot() {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const nightMode = useNightMode()
  const [MarkdownRenderer, setMarkdownRenderer] = useState<MarkdownComponent | null>(null)

  const launcherPalette = nightMode
    ? 'bg-red-900/80 border border-red-500/40 shadow-[0_0_15px_rgba(255,0,0,0.45)] text-red-100'
    : 'bg-amber-400 text-white'
  const overlayClass = nightMode ? 'bg-black/70' : 'bg-black/40'
  const drawerPalette = nightMode
    ? 'bg-[#120107] text-red-50 shadow-[0_0_35px_rgba(255,0,0,0.35)] border-l border-red-500/30'
    : 'bg-gray-900 text-white'
  const headerIconClass = nightMode ? 'text-red-300' : 'text-amber-300'
  const tooltipPalette = nightMode
    ? 'bg-red-950 text-red-100 border border-red-500/30'
    : 'bg-gray-900 text-white'
  const pulsePalette = nightMode ? 'bg-red-500/40' : 'bg-amber-300'
  const headerBorderClass = nightMode ? 'border-red-500/20' : 'border-white/10'
  const userBubbleClass = nightMode
    ? 'bg-red-900/70 text-red-50 border border-red-500/30 rounded-br-sm'
    : 'bg-emerald-600 text-white rounded-br-sm'
  const botBubbleClass = nightMode
    ? 'bg-red-950/70 text-red-100 border border-red-500/30 rounded-bl-sm'
    : 'bg-gray-700 text-gray-100 rounded-bl-sm'
  const inputClass = nightMode
    ? 'flex-1 px-3 py-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-50 placeholder-red-200/40 focus:outline-none focus:ring-2 focus:ring-red-400/60'
    : 'flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500'
  const sendButtonClass = nightMode
    ? 'px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-50'
    : 'px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
  const clearButtonClass = nightMode ? 'text-red-200 hover:text-red-100' : 'text-gray-400 hover:text-gray-200'
  const sessionTextClass = nightMode ? 'text-red-200/70' : 'text-gray-400'
  const typingDotClass = nightMode ? 'bg-red-200' : 'bg-gray-300'
  const accentStrongClass = nightMode ? 'text-red-300' : 'text-amber-300'
  const codeBlockClass = nightMode
    ? 'bg-red-950/40 border border-red-500/30 text-red-200 rounded px-1 py-0.5'
    : 'bg-black/30 rounded px-1 py-0.5'
  const closeButtonPalette = nightMode ? 'hover:bg-red-500/10 text-red-200' : 'hover:bg-white/5 text-white'
  const loadingShellClass = nightMode
    ? 'border border-red-500/30 bg-red-950/40'
    : 'border border-white/10 bg-white/5'

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

  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])


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

  // For the popover-style modal, keep the page scrollable.

  const send = async () => {
    const term = input.trim()
    if (!term || loading) return

    const newMessage: ChatMessage = { sender: 'user', text: term, ts: Date.now() }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setLoading(true)

    try {
      const prompt = [
        `You are AstroBot inside a space/astronomy app.`,
        `Reply in the most appropriate length for the user's question.`,
        ``,
        `Output rules:`,
        `- If it's a quick fact/definition/yes-no: answer in 1 line (max ~20 words).`,
        `- If the user says \"explain\", \"how\", \"why\", \"compare\", or \"tell me about\": answer in 12–20 short lines.`,
        `- If the user asks for steps: use a numbered list (3–8 steps).`,
        `- If unclear: ask exactly 1 clarifying question.`,
        `- Keep it factual; no filler; astronomy-focused.`,
        ``,
        `User: ${term}`,
      ].join('\n')

      const res = await fetch('/api/genai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemma-4-26b-a4b-it:free',
          prompt,
          temperature: 0.4,
        }),
      })

      if (!res.ok) {
        let payload = null
        try { payload = await res.json() } catch {}
        const errMsg = payload?.detail || payload?.error || `${res.status} ${res.statusText}`
        throw new Error(errMsg)
      }

      const payload = await res.json()
      const text = payload?.text ?? 'Sorry, no response.'
      const botMessage: ChatMessage = { sender: 'bot', text, ts: Date.now() }
      setMessages(prev => [...prev, botMessage])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('send error', e)
      const botMessage: ChatMessage = { sender: 'bot', text: `Error: ${e?.message ?? 'Something went wrong.'}`, ts: Date.now() }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || MarkdownRenderer) return
    let mounted = true
    import('react-markdown')
      .then(mod => {
        if (mounted) {
          setMarkdownRenderer(() => mod.default)
        }
      })
      .catch(err => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load Markdown renderer', err)
        }
      })
    return () => {
      mounted = false
    }
  }, [open, MarkdownRenderer])

  return (
    <>
      {/* Floating launcher (bottom-right, lowest position) */}
      <div
        id="astrobot-widget-trigger" className="fixed bottom-4 right-4 z-[2147483648]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && (
          <div className={`absolute -top-10 right-10 text-xs px-3 py-1 rounded-md shadow-lg pointer-events-none ${tooltipPalette}`}>
            Ask astronomy related questions
          </div>
        )}
        <button
          aria-label="Open AstroBot"
          className={`relative h-12 w-12 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg ${launcherPalette}`}
          onClick={() => setOpen(true)}
        >
          <span className={`absolute inset-0 rounded-full animate-ping opacity-30 ${pulsePalette}`}></span>
          <MessageCircleIcon className="relative text-xl drop-shadow text-white" />
        </button>
      </div>

      {/* Popover Modal (above launcher) */}
      <div className={`fixed inset-0 z-[2147483648] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        {/* click-outside catcher (no dim overlay) */}
        <div
          className="absolute inset-0"
          onClick={() => setOpen(false)}
        />

        <aside
          onClick={(e) => e.stopPropagation()}
          className={`fixed bottom-20 right-4 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[75vh] rounded-3xl shadow-2xl border border-white/10 overflow-hidden transition-all duration-200 origin-bottom-right ${
            open ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
          } flex flex-col ${drawerPalette}`}
          role="dialog"
          aria-modal="true"
          aria-label="AstroBot Chat"
        >
          <div className={`flex items-center justify-between px-4 py-3 border-b ${headerBorderClass}`}>
            <div className="flex items-center gap-2">
              <FaSun className={headerIconClass} />
              <h2 className="font-semibold">AstroBot</h2>
            </div>
            <button aria-label="Close" className={`p-2 rounded transition-colors ${closeButtonPalette}`} onClick={() => setOpen(false)}>
              <IoClose className="text-xl" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={m.ts + '_' + i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${m.sender === 'user' ? userBubbleClass : botBubbleClass}`}>
                  {m.sender === 'bot' ? (
                    MarkdownRenderer ? (
                      <MarkdownRenderer
                        components={{
                          p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className={accentStrongClass}>{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc ml-5 space-y-1">{children}</ul>,
                          li: ({ children }) => <li>{children}</li>,
                          h1: ({ children }) => <h1 className="text-lg font-semibold mb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-semibold mb-1">{children}</h2>,
                          code: ({ children }) => <code className={codeBlockClass}>{children}</code>,
                        }}
                      >
                        {m.text}
                      </MarkdownRenderer>
                    ) : (
                      <span className="leading-relaxed mb-2 last:mb-0 whitespace-pre-wrap">{m.text}</span>
                    )
                  ) : (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-3 py-2 max-w-[78%] ${botBubbleClass} ${loadingShellClass}`} aria-live="polite">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-2xl bg-black/20 border border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-[shimmer_1.2s_linear_infinite]" />
                      <div className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${nightMode ? 'text-red-200' : 'text-white/80'}`}>
                        AI
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className={`text-xs font-semibold ${nightMode ? 'text-red-100/90' : 'text-white/80'}`}>AstroBot is thinking…</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="relative inline-flex items-center" aria-hidden="true">
                          <span className={`w-2 h-2 rounded-full mr-1 animate-typing-dot ${typingDotClass}`}></span>
                          <span className={`w-2 h-2 rounded-full mr-1 animate-typing-dot [animation-delay:120ms] ${typingDotClass}`}></span>
                          <span className={`w-2 h-2 rounded-full animate-typing-dot [animation-delay:240ms] ${typingDotClass}`}></span>
                        </span>
                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                          <span className={`block h-full w-1/3 rounded-full ${nightMode ? 'bg-red-300/70' : 'bg-emerald-300/70'} animate-[pulsebar_1.1s_ease-in-out_infinite]`} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`border-t p-3 ${headerBorderClass}`}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Your astro question here..."
                className={inputClass}
              />
              <button onClick={send} disabled={loading || !input.trim()} className={sendButtonClass}>Send</button>
            </div>
            <div className={`mt-2 flex items-center justify-between text-xs ${sessionTextClass}`}>
              <button className={clearButtonClass} onClick={() => { if (confirm('Clear this session chat?')) { setMessages([]); try { sessionStorage.removeItem(STORAGE_KEY) } catch {} } }}>Clear session chat</button>
              <span>Session saved</span>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulsebar {
          0% { transform: translateX(-20%); opacity: 0.5; }
          50% { transform: translateX(140%); opacity: 1; }
          100% { transform: translateX(-20%); opacity: 0.5; }
        }
      `}</style>
    </>
  )
}
