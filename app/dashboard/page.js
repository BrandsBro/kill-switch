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

function SwitchToggle({ isOn, loading }) {
  return (
    <div style={{
      width: '44px', height: '24px', borderRadius: '999px', position: 'relative', flexShrink: 0,
      background: isOn ? 'rgba(220,38,38,0.3)' : 'rgba(34,197,94,0.15)',
      border: isOn ? '1px solid rgba(220,38,38,0.5)' : '1px solid rgba(34,197,94,0.4)',
      transition: 'all 0.3s', opacity: loading ? 0.5 : 1,
    }}>
      <div style={{
        position: 'absolute', top: '3px',
        left: isOn ? '22px' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: isOn ? '#ef4444' : '#4ade80',
        boxShadow: isOn ? '0 0 8px rgba(239,68,68,0.8)' : '0 0 8px rgba(74,222,128,0.8)',
        transition: 'all 0.3s',
      }} />
    </div>
  )
}

function DeleteConfirmModal({ kill, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ background: '#0f0f0f', border: '1px solid rgba(239,68,68,0.3)' }}>
        <div className="text-5xl mb-4">🗑️</div>
        <h2 className="text-xl font-black text-white mb-2">Delete this kill?</h2>
        <p className="text-zinc-500 text-sm mb-2">This will permanently remove it from your sheet.</p>
        <div className="px-3 py-2 rounded-xl mb-6 mt-4"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
          <p className="text-red-400 font-mono text-xs break-all">{kill['URL']}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a' }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 20px rgba(220,38,38,0.3)' }}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function PreviewModal({ kill, onClose }) {
  const kt = (kill['Kill Type'] || 'dead').toLowerCase()
  const info = KILL_INFO[kt] || KILL_INFO.dead
  const isOn = (kill['⚡ Status'] || kill['Status'] || 'ON') === 'ON'

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
            <span className="text-xs font-mono ml-2 text-zinc-600 truncate max-w-xs">{kill['🔗 URL'] || kill['URL']}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold" style={{ color: isOn ? '#f87171' : '#4ade80' }}>
              {isOn ? '🔴 KILL ACTIVE' : '🟢 SITE RESTORED'}
            </span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300"
              style={{ background: 'rgba(255,255,255,0.05)' }}>×</button>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center py-14 px-6 text-center"
          style={{ background: '#000', minHeight: '500px', opacity: isOn ? 1 : 0.3 }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.012) 2px,rgba(255,255,255,0.012) 4px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: info.glow, opacity: isOn ? 0.12 : 0.04, filter: 'blur(120px)' }} />

          {!isOn && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-6xl mb-4">🟢</div>
                <p className="text-green-400 font-black text-2xl tracking-tight">SITE RESTORED</p>
                <p className="text-zinc-600 text-sm mt-2">Kill screen is switched off</p>
                <p className="text-zinc-600 text-xs mt-1">Website loads normally for visitors</p>
              </div>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black mb-8 tracking-widest relative z-10"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: info.accent }}>
            {info.emoji} &nbsp;{info.label}
          </div>
          <div className="text-7xl mb-4 relative z-10" style={{ filter: `drop-shadow(0 0 40px ${info.glow})` }}>☠️</div>
          <div className="relative mb-2 z-10">
            <div className="font-black relative"
              style={{ fontSize: 'clamp(40px,8vw,72px)', letterSpacing: '-3px', background: `linear-gradient(135deg, #fff 0%, ${info.accent} 60%, #ff0000 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LINK KILLED
            </div>
          </div>
          <p className="text-xs tracking-widest uppercase mb-8 relative z-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {kill['🕐 Killed At'] || kill['Killed At']} · access denied
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
  const [deleting, setDeleting] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
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
    } catch { setError('Could not connect to Google Sheet.') }
    setLoading(false)
  }

  const getUrl = (kill) => kill['🔗 URL'] || kill['URL'] || ''
  const getStatus = (kill) => kill['⚡ Status'] || kill['Status'] || 'ON'
  const getKillType = (kill) => kill['💀 Kill Type'] || kill['Kill Type'] || 'dead'
  const getMessage = (kill) => kill['💬 Message'] || kill['Message'] || ''
  const getKilledAt = (kill) => kill['🕐 Killed At'] || kill['Killed At'] || ''

  const toggleSwitch = async (kill, i) => {
    const isOn = getStatus(kill) === 'ON'
    const action = isOn ? 'switchOff' : 'switchOn'
    setSwitching(i)
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
    const formData = new FormData()
    formData.append('data', JSON.stringify({ action, url: getUrl(kill) }))
    try {
      await fetch(scriptUrl, { method: 'POST', body: formData, mode: 'no-cors' })
      setKills(prev => prev.map(k =>
        k === kill ? { ...k, '⚡ Status': isOn ? 'OFF' : 'ON', 'Status': isOn ? 'OFF' : 'ON' } : k
      ))
    } catch {}
    setSwitching(null)
  }

  const handleDelete = async (kill) => {
    setDeleting(kill)
    setConfirmDelete(null)
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
    const formData = new FormData()
    formData.append('data', JSON.stringify({ action: 'delete', url: getUrl(kill) }))
    try {
      await fetch(scriptUrl, { method: 'POST', body: formData, mode: 'no-cors' })
      setKills(prev => prev.filter(k => k !== kill))
    } catch {}
    setDeleting(null)
  }

  const filtered = kills
    .filter(k => filter === 'all' || getKillType(k).toLowerCase() === filter)
    .filter(k => statusFilter === 'all' || getStatus(k) === statusFilter)
    .filter(k => {
      if (!search) return true
      const s = search.toLowerCase()
      return getUrl(k).toLowerCase().includes(s) || getMessage(k).toLowerCase().includes(s)
    })

  const stats = {
    total: kills.length,
    active: kills.filter(k => getStatus(k) === 'ON').length,
    off: kills.filter(k => getStatus(k) === 'OFF').length,
    today: kills.filter(k => { try { return new Date(getKilledAt(k)).toDateString() === new Date().toDateString() } catch { return false } }).length,
    types: Object.keys(KILL_INFO).reduce((acc, key) => {
      acc[key] = kills.filter(k => getKillType(k).toLowerCase() === key).length
      return acc
    }, {}),
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-10 relative">
      {preview && <PreviewModal kill={preview} onClose={() => setPreview(null)} />}
      {confirmDelete && (
        <DeleteConfirmModal
          kill={confirmDelete}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

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
              <p className="text-zinc-600 text-xs mt-0.5">{stats.active} active · {stats.off} restored</p>
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
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold mb-1">Total</p>
            <p className="text-4xl font-black text-white">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
            <p className="text-xs text-red-600 uppercase tracking-widest font-bold mb-1">🔴 Active</p>
            <p className="text-4xl font-black text-red-400">{stats.active}</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: 'rgba(74,222,128,0.6)' }}>🟢 Restored</p>
            <p className="text-4xl font-black text-green-400">{stats.off}</p>
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
          <div className="flex gap-2 flex-shrink-0">
            {[['all', 'All'], ['ON', '🔴 Active'], ['OFF', '🟢 Restored']].map(([val, label]) => (
              <button key={val} onClick={() => setStatusFilter(val)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
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
              const kt = getKillType(kill).toLowerCase()
              const info = KILL_INFO[kt] || KILL_INFO.dead
              const isOn = getStatus(kill) === 'ON'
              const isDeleting = deleting === kill
              return (
                <div key={i} className="rounded-2xl p-5 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: isOn ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(34,197,94,0.1)',
                    opacity: isDeleting ? 0.4 : 1,
                  }}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-widest"
                          style={{ background: info.bg, border: `1px solid ${info.border}`, color: info.accent }}>
                          {info.emoji} {info.label}
                        </span>
                        <span className="text-zinc-700 text-xs">{getKilledAt(kill)}</span>
                        {!isOn && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                            🟢 RESTORED
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-sm truncate mb-1"
                        style={{ color: isOn ? '#f87171' : '#52525b', textDecoration: isOn ? 'line-through' : 'none' }}>
                        {getUrl(kill)}
                      </p>
                      {getMessage(kill) && (
                        <p className="text-zinc-600 text-xs mt-1">💬 {getMessage(kill)}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Preview */}
                      <button onClick={() => setPreview(kill)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        style={{ background: info.bg, border: `1px solid ${info.border}`, color: info.accent }}>
                        👁
                      </button>

                      {/* Switch ON/OFF */}
                      <button
                        onClick={() => switching !== i && toggleSwitch(kill, i)}
                        disabled={switching === i}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        style={{
                          background: isOn ? 'rgba(220,38,38,0.1)' : 'rgba(34,197,94,0.1)',
                          border: isOn ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(34,197,94,0.3)',
                          color: isOn ? '#f87171' : '#4ade80',
                          minWidth: '120px',
                        }}>
                        <SwitchToggle isOn={isOn} loading={switching === i} />
                        <span>{switching === i ? 'Updating...' : isOn ? 'Switch OFF' : 'Switch ON'}</span>
                      </button>

                      {/* Visit */}
                      <a href={getUrl(kill)} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#52525b' }}>
                        ↗
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => setConfirmDelete(kill)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                        🗑️
                      </button>
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
