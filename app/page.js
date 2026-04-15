'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const KILL_TYPES = [
  { id: 'dead',    label: 'Dead',    emoji: '💀' },
  { id: 'expired', label: 'Expired', emoji: '⏰' },
  { id: 'moved',   label: 'Moved',   emoji: '📦' },
  { id: 'blocked', label: 'Blocked', emoji: '🚫' },
  { id: 'nuked',   label: 'Nuked',   emoji: '☢️' },
  { id: 'private', label: 'Private', emoji: '🔒' },
]

export default function Home() {
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [killType, setKillType] = useState('dead')
  const [switched, setSwitched] = useState(false)
  const [error, setError] = useState('')
  const [flipping, setFlipping] = useState(false)
  const router = useRouter()

  const isValidUrl = (str) => {
    try { new URL(str); return true } catch { return false }
  }

  const handleSwitch = () => {
    setError('')
    if (!url.trim()) { setError('Please enter a URL first'); return }
    if (!isValidUrl(url.trim())) { setError('Please enter a valid URL (include https://)'); return }

    setFlipping(true)
    setTimeout(() => {
      setSwitched(true)
      setFlipping(false)
    }, 600)

    setTimeout(() => {
      const params = new URLSearchParams({ url: url.trim(), message: message.trim(), killType })
      router.push(`/killed?${params.toString()}`)
    }, 1800)
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 py-16">

      {/* Background glow — changes red when switched */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden transition-all duration-1000">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-1000"
          style={{ background: switched ? 'rgba(220,38,38,0.25)' : 'rgba(220,38,38,0.07)' }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 text-3xl"
          style={{ background: 'linear-gradient(135deg, #3f0000, #7f1d1d)' }}
        >
          ☠️
        </div>
        <h1
          className="text-5xl font-black tracking-tighter mb-2"
          style={{ background: 'linear-gradient(135deg, #fff 0%, #f87171 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          LINK KILLER
        </h1>
        <p className="text-zinc-500 text-sm">Fill in the details, then flip the switch.</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg relative z-10 rounded-3xl p-8 space-y-6 transition-all duration-500"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: switched ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* URL */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Website URL</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">🔗</span>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError('') }}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-4 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: error ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>
          {error && <p className="text-red-400 text-xs pl-1">⚠️ {error}</p>}
        </div>

        {/* Kill Type */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Kill Type</label>
          <div className="grid grid-cols-3 gap-2">
            {KILL_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setKillType(type.id)}
                className="py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1"
                style={{
                  background: killType === type.id ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                  border: killType === type.id ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.07)',
                  color: killType === type.id ? '#fca5a5' : '#71717a',
                  transform: killType === type.id ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <span className="text-lg">{type.emoji}</span>
                <span className="text-xs">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Kill Message <span className="text-zinc-700 normal-case tracking-normal font-normal">(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain why this link is dead..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none transition-all resize-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        {/* KILL SWITCH */}
        <div className="flex flex-col items-center pt-4 pb-2 space-y-5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            {switched ? '☠️ Killing...' : 'Flip to Kill'}
          </p>

          {/* Switch */}
          <div
            onClick={!switched ? handleSwitch : undefined}
            className="relative cursor-pointer select-none transition-all duration-300"
            style={{ opacity: switched ? 0.6 : 1 }}
          >
            {/* Outer ring glow */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-500"
              style={{
                boxShadow: switched || flipping
                  ? '0 0 60px rgba(220,38,38,0.6), 0 0 120px rgba(220,38,38,0.3)'
                  : '0 0 20px rgba(255,255,255,0.05)',
              }}
            />

            {/* Track */}
            <div
              className="w-32 h-16 rounded-full flex items-center transition-all duration-500 relative overflow-hidden"
              style={{
                background: switched || flipping
                  ? 'linear-gradient(135deg, #7f1d1d, #dc2626)'
                  : 'rgba(255,255,255,0.08)',
                border: switched || flipping
                  ? '2px solid rgba(220,38,38,0.8)'
                  : '2px solid rgba(255,255,255,0.12)',
              }}
            >
              {/* OFF label */}
              <span
                className="absolute left-3 text-xs font-black tracking-widest transition-all duration-300"
                style={{ color: switched ? 'transparent' : 'rgba(255,255,255,0.3)' }}
              >
                OFF
              </span>

              {/* ON label */}
              <span
                className="absolute right-3 text-xs font-black tracking-widest transition-all duration-300"
                style={{ color: switched ? 'rgba(255,200,200,0.9)' : 'transparent' }}
              >
                ON
              </span>

              {/* Thumb */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-500 shadow-lg"
                style={{
                  marginLeft: switched || flipping ? '72px' : '4px',
                  background: switched || flipping
                    ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                    : 'rgba(255,255,255,0.15)',
                  boxShadow: switched || flipping
                    ? '0 0 20px rgba(239,68,68,0.8)'
                    : '0 2px 8px rgba(0,0,0,0.5)',
                  transform: flipping ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                {switched ? '☠️' : '⚡'}
              </div>
            </div>
          </div>

          <p className="text-zinc-700 text-xs text-center">
            {switched ? 'Redirecting to kill page...' : 'This cannot be undone once flipped'}
          </p>
        </div>

      </div>

      <p className="mt-8 text-zinc-700 text-xs relative z-10">No data stored · Runs entirely in your browser</p>
    </main>
  )
}
