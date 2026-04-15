'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const KILL_INFO = {
  dead:    { emoji: '💀', label: 'DEAD',    accent: '#a1a1aa', bg: 'rgba(255,255,255,0.06)',  border: 'rgba(255,255,255,0.1)'  },
  expired: { emoji: '⏰', label: 'EXPIRED', accent: '#fbbf24', bg: 'rgba(234,179,8,0.1)',    border: 'rgba(234,179,8,0.3)'    },
  moved:   { emoji: '📦', label: 'MOVED',   accent: '#60a5fa', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)'   },
  blocked: { emoji: '🚫', label: 'BLOCKED', accent: '#fb923c', bg: 'rgba(249,115,22,0.1)',   border: 'rgba(249,115,22,0.3)'   },
  nuked:   { emoji: '☢️', label: 'NUKED',   accent: '#4ade80', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.3)'    },
  private: { emoji: '🔒', label: 'PRIVATE', accent: '#a78bfa', bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.3)'   },
}

export default function Dashboard() {
  const [kills, setKills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
      if (!scriptUrl) { setError('No Google Script URL found in .env.local'); setLoading(false); return }
      const res = await fetch(scriptUrl)
      const json = await res.json()
      if (json.success) {
        setKills(json.data.reverse())
      } else {
        setError('Failed to load data from Google Sheet')
      }
    } catch (e) {
      setError('Could not connect to Google Sheet. Check your script URL.')
    }
    setLoading(false)
  }

  const filtered = kills
    .filter(k => filter === 'all' || (k['Kill Type'] || '').toLowerCase() === filter)
    .filter(k => {
      if (!search) return true
      const s = search.toLowerCase()
      return (k['URL'] || '').toLowerCase().includes(s) ||
             (k['Message'] || '').toLowerCase().includes(s)
    })
    .sort((a, b) => {
      if (sort === 'newest') return 0
      if (sort === 'oldest') return 1
      return 0
    })

  const stats = {
    total: kills.length,
    today: kills.filter(k => {
      const d = new Date(k['Killed At'])
      const now = new Date()
      return d.toDateString() === now.toDateString()
    }).length,
    types: Object.keys(KILL_INFO).reduce((acc, key) => {
      acc[key] = kills.filter(k => (k['Kill Type'] || '').toLowerCase() === key).length
      return acc
    }, {}),
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-10 relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.006) 2px,rgba(255,255,255,0.006) 4px)' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: 'rgba(220,38,38,0.06)' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, #3f0000, #7f1d1d)' }}>☠️</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Kill Dashboard</h1>
              <p className="text-zinc-600 text-xs mt-0.5">All killed links in one place</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a' }}>
              🔄 Refresh
            </button>
            <button onClick={() => router.push('/')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 20px rgba(220,38,38,0.2)' }}>
              ☠️ Kill New Link
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-1">Total Killed</p>
            <p className="text-4xl font-black text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-1">Killed Today</p>
            <p className="text-4xl font-black text-red-400">{stats.today}</p>
          </div>
          {Object.entries(KILL_INFO).slice(0, 2).map(([key, info]) => (
            <div key={key} className="rounded-2xl p-5"
              style={{ background: info.bg, border: `1px solid ${info.border}` }}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: info.accent }}>
                {info.emoji} {info.label}
              </p>
              <p className="text-4xl font-black" style={{ color: info.accent }}>{stats.types[key] || 0}</p>
            </div>
          ))}
        </div>

        {/* Kill type breakdown */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {Object.entries(KILL_INFO).map(([key, info]) => (
            <button key={key}
              onClick={() => setFilter(filter === key ? 'all' : key)}
              className="rounded-xl py-3 flex flex-col items-center gap-1 transition-all active:scale-95"
              style={{
                background: filter === key ? info.bg : 'rgba(255,255,255,0.03)',
                border: filter === key ? `1px solid ${info.border}` : '1px solid rgba(255,255,255,0.06)',
              }}>
              <span className="text-lg">{info.emoji}</span>
              <span className="text-xs font-bold" style={{ color: filter === key ? info.accent : '#52525b' }}>
                {stats.types[key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by URL or message..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl text-zinc-300 text-sm focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="text-5xl animate-pulse">☠️</div>
            <p className="text-zinc-600 text-sm">Loading kills...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="text-5xl">⚠️</div>
            <p className="text-red-400 text-sm text-center max-w-md">{error}</p>
            <button onClick={fetchData}
              className="px-6 py-2 rounded-xl text-sm font-bold text-white mt-2"
              style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="text-5xl">🔍</div>
            <p className="text-zinc-600 text-sm">No kills found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((kill, i) => {
              const kt = (kill['Kill Type'] || 'dead').toLowerCase()
              const info = KILL_INFO[kt] || KILL_INFO.dead
              return (
                <div key={i} className="rounded-2xl p-5 transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-widest"
                          style={{ background: info.bg, border: `1px solid ${info.border}`, color: info.accent }}>
                          {info.emoji} {info.label}
                        </span>
                        <span className="text-zinc-700 text-xs">{kill['Killed At']}</span>
                      </div>
                      <p className="text-red-400 font-mono text-sm truncate line-through decoration-red-500/40 mb-1">
                        {kill['URL']}
                      </p>
                      {kill['Message'] && (
                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                          💬 {kill['Message']}
                        </p>
                      )}
                    </div>
                    <a href={kill['URL']} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#52525b' }}>
                      Visit ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-center text-zinc-800 text-xs mt-10">LINK KILLER DASHBOARD ☠️</p>
      </div>
    </main>
  )
}
