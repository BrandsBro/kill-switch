'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const KILL_INFO = {
  dead:    { emoji: '💀', label: 'DEAD',    accent: '#a1a1aa', glow: '#52525b', bg: 'rgba(255,255,255,0.06)',  border: 'rgba(255,255,255,0.1)'  },
  expired: { emoji: '⏰', label: 'EXPIRED', accent: '#fbbf24', glow: '#ca8a04', bg: 'rgba(234,179,8,0.1)',    border: 'rgba(234,179,8,0.3)'    },
  moved:   { emoji: '📦', label: 'MOVED',   accent: '#60a5fa', glow: '#2563eb', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)'   },
  blocked: { emoji: '🚫', label: 'BLOCKED', accent: '#fb923c', glow: '#ea580c', bg: 'rgba(249,115,22,0.1)',   border: 'rgba(249,115,22,0.3)'   },
  nuked:   { emoji: '☢️', label: 'NUKED',   accent: '#4ade80', glow: '#16a34a', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.3)'    },
  private: { emoji: '🔒', label: 'PRIVATE', accent: '#a78bfa', glow: '#7c3aed', bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.3)'   },
}

function SwitchToggle({ isOn }) {
  return (
    <div className="relative flex-shrink-0"
      style={{
        width: '48px', height: '26px', borderRadius: '999px',
        background: isOn ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.06)',
        border: isOn ? '1px solid rgba(220,38,38,0.6)' : '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s',
      }}>
      <div style={{
        position: 'absolute', top: '3px',
        left: isOn ? '24px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: isOn ? '#ef4444' : 'rgba(255,255,255,0.2)',
        boxShadow: isOn ? '0 0 8px rgba(239,68,68,0.8)' : 'none',
        transition: 'all 0.3s',
      }} />
    </div>
  )
}

function PreviewModal({ kill, onClose }) {
  const kt = (kill['Kill Type'] || 'dead').toLowerCase()
  const info = KILL_INFO[kt] || KILL_INFO.dead
  const isOn = (kill['Status'] || 'ON') === 'ON'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.1)', background: '#000', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-3 sticky top-0 z-10"
          style={{ background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70 cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
            <div className="w-3 h-3 rounded-full bg-green-500/40" />
            <div className="ml-3 px-3 py-1 rounded-md text-xs text-zinc-600 font-mono"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {kill['URL']?.substring(0, 45)}{kill['URL']?.length > 45 ? '...' : ''}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold" style={{ color: isOn ? '#f87171' : '#52525b' }}>
              {isOn ? '🔴 ACTIVE' : '⚫ SWITCHED OFF'}
            </span>
            <button onClick={onClose}
              className="text-zinc-600 hover:text-zinc-300 text-xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)' }}>×</button>
          </div>
        </div>

        <div className="relative overflow-hidden flex flex-col items-center justify-center py-14 px-6 text-center"
          style={{ background: isOn ? '#000' : '#0a0a0a', minHeight: '520px', opacity: isOn ? 1 : 0.4 }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 4px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: info.glow, opacity: isOn ? 0.12 : 0.03, filter: 'blur(120px)' }} />

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black mb-8 tracking-widest relative z-10"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: info.accent }}>
            {info.emoji} &nbsp;{info.label}
          </div>
          <div className="text-7xl mb-4 relative z-10"
            style={{ filter: `drop-shadow(0 0 40px ${info.glow})` }}>☠️</div>
          <div className="relative mb-2 z-10">
            <div className="absolute inset-0 font-black"
              style={{ fontSize: 'clamp(40px,8vw,72px)', letterSpacing: '-3px', color: info.accent, opacity: 0.6 }}>
              LINK KILLED
            </div>
            <div className="font-black relative"
              style={{ fontSize: 'clamp(40px,8vw,72px)', letterSpacing: '-3px', background: `linear-gradient(135deg, #fff 0%, ${info.accent} 60%, #ff0000 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LINK KILLED
            </div>
          </div>
          <p className="text-xs tracking-widest uppercase mb-8 relative z-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {kill['Killed At']} &nbsp;·&nbsp; access denied
          </p>
          <div className="w-full max-w-md rounded-2xl overflow-hidden relative z-10"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 px-4 py-2.5"
              style={{ background: 'rgba(255,0,0,0.06)', borderBottom: '1px solid rgba(255,0,0,0.1)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
              <span className="text-xs font-mono ml-2 truncate" style={{ color: 'rgba(255,255,255,0.2)' }}>{kill['URL']}</span>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>⚰️ Killed URL</p>
                <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p className="text-red-400 font-mono text-xs break-all line-through" style={{ textDecorationColor: 'rgba(239,68,68,0.5)' }}>{kill['URL']}</p>
                </div>
              </div>
              {kill['Message'] && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>💬 Message</p>
                  <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-zinc-300 text-xs leading-relaxed">{kill['Message']}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="mt-6 text-xs tracking-widest uppercase relative z-10" style={{ color: 'rgba(255,255,255,0.1)' }}>
            Powered by Link Killer ☠️
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [kills, setKills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [preview, setPreview] = useState(null)
  const [switching, setSwitching] = useState(null)
  const router = useRouter()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
      if (!scriptUrl) { setError('No Google Script URL in .env.local'); setLoading(false); return }
      const res = await fetch(scriptUrl)
      const json = await res.json()
      if (json.success) setKills(json.data.reverse())
      else setError('Failed to load data')
    } catch {
      setError('Could not connect to Google Sheet.')
    }
    setLoading(false)
  }

  const handleSwitchOff = async (kill, i) => {
    setSwitching(i)
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
    const formData = new FormData()
    formData.append('data', JSON.stringify({ action: 'switchOff', url: kill['URL'] }))
    try {
      await fetch(scriptUrl, { method: 'POST', body: formData, mode: 'no-cors' })
      setKills(prev => prev.map((k, idx) => {
        const realIdx = kills.indexOf(kill)
        if (k === kill) return { ...k, Status: 'OFF' }
        return k
      }))
    } catch {}
    setSwitching(null)
  }

  const filtered = kills
    .filter(k => filter === 'all' || (k['Kill Type'] || '').toLowerCase() === filter)
    .filter(k => statusFilter === 'all' || (k['Status'] || 'ON') === statusFilter)
    .filter(k => {
      if (!search) return true
      const s = search.toLowerCase()
      return (k['URL'] || '').toLowerCase().includes(s) || (k['Message'] || '').toLowerCase().includes(s)
    })

  const stats = {
    total: kills.length,
    active: kills.filter(k => (k['Status'] || 'ON') === 'ON').length,
    off: kills.filter(k => k['Status'] === 'OFF').length,
    today: kills.filter(k => {
      try { return new Date(k['Killed At']).toDateString() === new Date().toDateString() }
      catch { return false }
    }).length,
    types: Object.keys(KILL_INFO).reduce((acc, key) => {
      acc[key] = kills.filter(k => (k['Kill Type'] || '').toLowerCase() === key).length
      return acc
    }, {}),
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-10 relative">
      {preview && <PreviewModal kill={preview} onClose={() => setPreview(null)} />}

      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.006) 2px,rgba(255,255,255,0.006) 4px)' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: 'rgba(220,38,38,0.06)' }} />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, #3f0000, #7f1d1d)' }}>☠️</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">Kill Dashboard</h1>
              <p className="text-zinc-600 text-xs mt-0.5">{stats.active} active · {stats.off} switched off</p>
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
              ☠️ Kill New
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-1">Total Killed</p>
            <p className="text-4xl font-black text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
            <p className="text-xs text-red-600 uppercase tracking-widest font-bold mb-1">🔴 Active</p>
            <p className="text-4xl font-black text-red-400">{stats.active}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-1">⚫ Switched Off</p>
            <p className="text-4xl font-black text-zinc-500">{stats.off}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-1">Today</p>
            <p className="text-4xl font-black text-white">{stats.today}</p>
          </div>
        </div>

        {/* Kill type filter */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {Object.entries(KILL_INFO).map(([key, info]) => (
            <button key={key} onClick={() => setFilter(filter === key ? 'all' : key)}
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

        {/* Status filter + search */}
        <div className="flex gap-3 mb-6">
          <div className="flex gap-2">
            {[['all', 'All'], ['ON', '🔴 Active'], ['OFF', '⚫ Off']].map(([val, label]) => (
              <button key={val} onClick={() => setStatusFilter(val)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: statusFilter === val ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.04)',
                  border: statusFilter === val ? '1px solid rgba(220,38,38,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: statusFilter === val ? '#f87171' : '#52525b',
                }}>
                {label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">🔍</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search URL or message..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="text-5xl animate-pulse">☠️</div>
            <p className="text-zinc-600 text-sm">Loading kills...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="text-5xl">⚠️</div>
            <p className="text-red-400 text-sm text-center max-w-md">{error}</p>
            <button onClick={fetchData} className="px-6 py-2 rounded-xl text-sm font-bold text-white mt-2"
              style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}>Try Again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="text-5xl">🔍</div>
            <p className="text-zinc-600 text-sm">No kills found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((kill, i) => {
              const kt = (kill['Kill Type'] || 'dead').toLowerCase()
              const info = KILL_INFO[kt] || KILL_INFO.dead
              const isOn = (kill['Status'] || 'ON') === 'ON'
              return (
                <div key={i} className="rounded-2xl p-5 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: isOn ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,255,255,0.03)',
                    opacity: isOn ? 1 : 0.5,
                  }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-widest"
                          style={{ background: info.bg, border: `1px solid ${info.border}`, color: info.accent }}>
                          {info.emoji} {info.label}
                        </span>
                        <span className="text-zinc-700 text-xs">{kill['Killed At']}</span>
                        {!isOn && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#52525b', border: '1px solid rgba(255,255,255,0.08)' }}>
                            ⚫ SWITCHED OFF
                          </span>
                        )}
                      </div>
                      <p className="text-red-400 font-mono text-sm truncate line-through decoration-red-500/40 mb-1">
                        {kill['URL']}
                      </p>
                      {kill['Message'] && (
                        <p className="text-zinc-500 text-xs mt-1">💬 {kill['Message']}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setPreview(kill)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        style={{ background: info.bg, border: `1px solid ${info.border}`, color: info.accent }}>
                        👁 Preview
                      </button>

                      {/* THE SWITCH */}
                      <button
                        onClick={() => isOn && handleSwitchOff(kill, i)}
                        disabled={!isOn || switching === i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        style={{
                          background: isOn ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.04)',
                          border: isOn ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.07)',
                          color: isOn ? '#f87171' : '#3f3f46',
                          cursor: isOn ? 'pointer' : 'default',
                        }}>
                        <SwitchToggle isOn={isOn} />
                        <span>{switching === i ? 'Switching...' : isOn ? 'Switch Off' : 'Off'}</span>
                      </button>

                      <a href={kill['URL']} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#52525b' }}>
                        ↗
                      </a>
                    </div>
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
