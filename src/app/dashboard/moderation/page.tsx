'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Check, X, Play, Loader2 } from 'lucide-react'

// Defined inline for simplicity in prototype
type Contribution = {
  id: string
  title: string
  status: string
  language: string
  transcript: string
  createdAt: string
}

export default function ModerationPage() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/contribute/list')
      .then(res => res.json())
      .then(data => {
        setContributions(data.contributions || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/contribute/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (res.ok) {
        setContributions(prev => prev.map(c => c.id === id ? { ...c, status: action } : c))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal">Verification Queue</h2>
        <p className="text-charcoal-light">Review and approve cultural contributions submitted by tourists.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-saffron" size={32} />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-sandstone-dark/30 border-b border-sandstone-dark text-xs uppercase tracking-wider text-charcoal-light font-semibold">
                <tr>
                  <th className="px-6 py-4">Contribution</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark bg-white">
                {contributions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-charcoal-light">No contributions found.</td>
                  </tr>
                ) : (
                  contributions.map((contribution) => (
                    <tr key={contribution.id} className="hover:bg-sandstone/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-charcoal">{contribution.title}</p>
                        <p className="text-xs text-charcoal-light mt-1 truncate max-w-xs">{contribution.transcript}</p>
                        <div className="mt-2 flex items-center gap-2">
                           <button className="flex items-center gap-1 text-[10px] bg-charcoal/5 px-2 py-1 rounded text-charcoal-light font-semibold uppercase tracking-wider hover:bg-charcoal/10 transition-colors">
                             <Play size={12} fill="currentColor" /> Play Audio
                           </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal">{contribution.language}</td>
                      <td className="px-6 py-4">
                        <Badge variant={contribution.status === 'PENDING' ? 'warning' : contribution.status === 'APPROVED' ? 'success' : 'default'}>
                          {contribution.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {contribution.status === 'PENDING' && (
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 text-muted-green border-muted-green hover:bg-muted-green hover:text-white" onClick={() => handleAction(contribution.id, 'APPROVED')}>
                              <Check size={16} />
                            </Button>
                            <Button variant="outline" size="sm" className="w-8 h-8 p-0 text-red-500 border-red-500 hover:bg-red-500 hover:text-white" onClick={() => handleAction(contribution.id, 'REJECTED')}>
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                        {contribution.status !== 'PENDING' && (
                          <span className="text-xs text-charcoal-light uppercase tracking-wider font-semibold">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
