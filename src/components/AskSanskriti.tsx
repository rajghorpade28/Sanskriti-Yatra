'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, Sparkles } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface AskSanskritiProps {
  objectName: string
  siteName?: string
  period?: string
  culturalSignificance?: string
  onClose: () => void
}

export default function AskSanskriti({
  objectName,
  siteName = 'Ellora Caves',
  period = '8th Century CE',
  culturalSignificance = '',
  onClose,
}: AskSanskritiProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Namaste! I am the Sanskriti Guide. I can help you explore **${objectName}** at **${siteName}**. What would you like to know?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const SUGGESTED = [
    'What does this represent?',
    'How was this carved?',
    'Tell me something unusual.',
    'Are these traditions still practiced today?',
  ]

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          objectName,
          siteName,
          period,
          culturalSignificance,
        }),
      })

      const data = await res.json()
      const replyText = data.reply || `**${objectName}** is a monumental heritage element in Maharashtra's cultural tapestry.`

      setMessages((prev) => [...prev, { role: 'assistant', content: replyText }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `**${objectName}** is one of Maharashtra's premier heritage monuments. You can also explore nearby living traditions in Paithan to see how ancient techniques survive!`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-sandstone">
      {/* Header */}
      <div className="bg-charcoal text-white px-6 py-4 pt-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center shadow-md">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold leading-tight text-sm">Sanskriti Guide</h2>
            <p className="text-white/60 text-[10px]">Contextual AI Companion • {objectName}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-saffron flex items-center justify-center mr-2 shrink-0 mt-1 shadow-sm">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-charcoal text-white rounded-tr-sm'
                  : 'bg-white text-charcoal shadow-sm border border-sandstone-dark rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-saffron flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-sandstone-dark flex items-center gap-2">
              <Loader2 size={16} className="text-saffron animate-spin" />
              <span className="text-xs text-charcoal-light italic">Consulting heritage archive…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {SUGGESTED.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="text-xs bg-white text-charcoal border border-sandstone-dark px-3 py-2 rounded-full hover:bg-sandstone-dark transition-colors font-medium shadow-sm active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-8 pt-2 bg-white border-t border-sandstone-dark shrink-0">
        <div className="flex gap-3 items-center bg-sandstone rounded-xl px-4 py-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder={`Ask about ${objectName}...`}
            className="flex-1 bg-transparent text-charcoal text-xs focus:outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 bg-saffron rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:bg-saffron-light transition-colors shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
