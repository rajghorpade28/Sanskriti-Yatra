'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, Sparkles } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

// Curated mock responses for demo reliability
const HERITAGE_QA: Record<string, string> = {
  default: "The Ellora Caves represent a stunning convergence of three great Indian religions — Hinduism, Buddhism, and Jainism — carved between the 6th and 11th centuries CE. The site is a UNESCO World Heritage Site and a testament to the artistic mastery of medieval Indian craftsmen.",
  "represent": "The Kailasa Temple represents Mount Kailash — the sacred abode of Lord Shiva in Hindu cosmology. Its vertical excavation from a single basalt cliff, working top-down, makes it one of the greatest feats of ancient Indian engineering.",
  "carved": "These caves were carved using the 'remove and reveal' technique — removing rock to expose the sculpture within. Craftsmen worked with chisels and mallets with extraordinary precision, removing an estimated 200,000 tonnes of rock for the Kailasa Temple alone.",
  "religion": "The Ellora cave complex contains 100 caves spanning Hindu, Buddhist, and Jain traditions, demonstrating the religious tolerance of the Rashtrakuta and Yadava rulers who patronized their construction.",
  "tradition": "The carving traditions of Ellora continue in Maharashtra today through stone masonry guilds and temple craft communities. The Paithani weaving of Paithan echoes the same pattern vocabulary — peacocks, lotuses, and geometric motifs — in thread rather than stone.",
  "interesting": "The Kailasa Temple at Ellora is larger than the Parthenon in Athens, yet it was carved entirely from a single rock over approximately 150 years. It contains no seams, no joins — just one continuous piece of sculpted basalt.",
  "paint": "While Ellora is primarily known for sculpture, several caves show traces of original paintings. The nearby Ajanta Caves (UNESCO World Heritage Site) are famous for their extraordinary murals depicting Buddhist narratives from the 2nd century BCE to 6th century CE.",
}

function getResponse(question: string): string {
  const lower = question.toLowerCase()
  for (const keyword of Object.keys(HERITAGE_QA)) {
    if (keyword !== 'default' && lower.includes(keyword)) {
      return HERITAGE_QA[keyword]
    }
  }
  return HERITAGE_QA.default
}

interface AskSanskritiProps {
  objectName: string
  onClose: () => void
}

export default function AskSanskriti({ objectName, onClose }: AskSanskritiProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Namaste! I am the Sanskriti Guide. I can help you understand the cultural and historical significance of **${objectName}**. What would you like to know?`,
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const SUGGESTED = [
    "What does this represent?",
    "How was this carved?",
    "Tell me something interesting.",
    "What traditions are still practiced?",
  ]

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    
    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response with curated data
    await new Promise(resolve => setTimeout(resolve, 1200))
    const response = getResponse(text)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setIsLoading(false)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-sandstone">
      {/* Header */}
      <div className="bg-charcoal text-white px-6 py-4 pt-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-bold leading-tight">Sanskriti Guide</h2>
            <p className="text-white/60 text-xs">AI Cultural Companion · Demo Mode</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-saffron flex items-center justify-center mr-2 shrink-0 mt-1">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-charcoal text-white rounded-tr-sm' 
                : 'bg-white text-charcoal shadow-sm border border-sandstone-dark rounded-tl-sm'
            }`}>
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
              <span className="text-xs text-charcoal-light italic">Consulting the cultural archive…</span>
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
              className="text-xs bg-white text-charcoal border border-sandstone-dark px-3 py-2 rounded-full hover:bg-sandstone-dark transition-colors font-medium shadow-sm"
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
            placeholder="Ask about this heritage..."
            className="flex-1 bg-transparent text-charcoal text-sm focus:outline-none"
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
