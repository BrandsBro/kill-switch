'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const KILL_INFO = {
  dead:    { emoji: '💀', label: 'DEAD',    glow: '#52525b', badge: 'rgba(255,255,255,0.06)', badgeBorder: 'rgba(255,255,255,0.1)',  text: '#a1a1aa' },
  expired: { emoji: '⏰', label: 'EXPIRED', glow: '#ca8a04', badge: 'rgba(234,179,8,0.1)',   badgeBorder: 'rgba(234,179,8,0.3)',   text: '#fbbf24' },
  moved:   { emoji: '📦', label: 'MOVED',   glow: '#2563eb', badge: 'rgba(59,130,246,0.1)',  badgeBorder: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
  blocked: { emoji: '🚫', label: 'BLOCKED', glow: '#ea580c', badge: 'rgba(249,115,22,0.1)', badgeBorder: 'rgba(249,115,22,0.3)', text: '#fb923c' },
  nuked:   { emoji: '☢️', label: 'NUKED',   glow: '#16a34a', badge: 'rgba(34,197,94,0.1)',  badgeBorder: 'rgba(34,197,94,0.3)',  text: '#4ade80' },
  private: { emoji: '🔒', label: 'PRIVATE', glow: '#7c3aed', badge: 'rgba(139,92,246,0.1)', badgeBorder: 'rgba(139,92,246,0.3)', text: '#a78bfa' },
}

function generateKillCode(url, killType, message) {
  const info = KILL_INFO[killType] || KILL_INFO.dead
  const killedAt = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  return `<!-- ☠️ LINK KILLER — paste before </body> -->
<script>
(function() {
  var cfg = {
    url: "${url}",
    killType: "${killType}",
    label: "${info.label}",
    emoji: "${info.emoji}",
    message: ${message ? `"${message.replace(/"/g, '\\"')}"` : 'null'},
    killedAt: "${killedAt}",
    glow: "${info.glow}",
    text: "${info.text}",
    badge: "${info.badge}",
    badgeBorder: "${info.badgeBorder}",
  };
  var overlay = document.createElement('div');
  overlay.id = 'link-killer-overlay';
  overlay.style.cssText = [
    'position:fixed','top:0','left:0','width:100%','height:100%',
    'background:#09090b','z-index:999999',
    'display:flex','flex-direction:column',
    'align-items:center','justify-content:center',
    'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
    'padding:24px','box-sizing:border-box',
  ].join(';');

  overlay.innerHTML = \`
    <div style="position:fixed;inset:0;pointer-events:none;overflow:hidden">
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:600px;height:600px;border-radius:50%;
        background:\${cfg.glow};opacity:0.15;filter:blur(120px)"></div>
    </div>
    <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 18px;
      border-radius:999px;margin-bottom:28px;font-size:12px;font-weight:700;
      letter-spacing:0.1em;background:\${cfg.badge};
      border:1px solid \${cfg.badgeBorder};color:\${cfg.text}">
      \${cfg.emoji} \${cfg.label}
    </div>
    <div style="font-size:72px;margin-bottom:20px">☠️</div>
    <h1 style="font-size:52px;font-weight:900;letter-spacing:-2px;margin:0 0 8px;
      background:linear-gradient(135deg,#fff 0%,#f87171 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent">
      LINK KILLED
    </h1>
    <p style="color:#52525b;font-size:13px;margin:0 0 32px">\${cfg.killedAt}</p>
    <div style="width:100%;max-width:480px;border-radius:20px;padding:24px;
      background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08)">
      <p style="font-size:10px;font-weight:600;color:#52525b;
        text-transform:uppercase;letter-spacing:0.12em;margin:0 0 8px">Killed URL</p>
      <div style="padding:12px 16px;border-radius:12px;
        background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15)">
        <p style="color:#f87171;font-family:monospace;font-size:13px;
          word-break:break-all;text-decoration:line-through;
          text-decoration-color:rgba(239,68,68,0.5);margin:0">\${cfg.url}</p>
      </div>
      \${cfg.message ? \`
        <p style="font-size:10px;font-weight:600;color:#52525b;
          text-transform:uppercase;letter-spacing:0.12em;margin:16px 0 8px">Kill Message</p>
        <div style="padding:12px 16px;border-radius:12px;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07)">
          <p style="color:#d4d4d8;font-size:13px;margin:0;line-height:1.6">\${cfg.message}</p>
        </div>
      \` : ''}
    </div>
  \`;

  document.body.style.overflow = 'hidden';
  document.body.appendChild(overlay);
})();
<\/script>`
}

function KilledContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const url      = params.get('url') || ''
  const message  = params.get('message') || ''
  const killType = params.get('killType') || 'dead'
  const info     = KILL_INFO[killType] || KILL_INFO.dead
  const now      = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  const killCode = generateKillCode(url, killType, message)

  const copyCode = () => {
    navigator.clipboard.writeText(killCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2500)
  }

  const copyReport = () => {
    const text = `☠️ LINK KILLED\n\nURL: ${url}\nStatus: ${info.label}\nTime: ${now}${message ? `\nMessage: ${message}` : ''}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 py-16">

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
          style={{ background: info.glow }} />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-8 relative z-10"
        style={{ background: info.badge, border: `1px solid ${info.badgeBorder}`, color: info.text }}>
        {info.emoji} {info.label}
      </div>

      {/* Title */}
      <div className="text-center mb-10 relative z-10">
        <div className="text-7xl mb-5">☠️</div>
        <h1 className="text-6xl font-black tracking-tighter mb-2"
          style={{ background: 'linear-gradient(135deg, #fff 0%, #f87171 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LINK KILLED
        </h1>
        <p className="text-zinc-600 text-sm">{now}</p>
      </div>

      {/* Info */}
      <div className="w-full max-w-xl relative z-10 rounded-3xl p-6 space-y-4 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Killed URL</p>
          <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-red-400 font-mono text-sm break-all line-through decoration-red-500/50 decoration-2">{url}</p>
          </div>
        </div>
        {message && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">Kill Message</p>
            <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-zinc-300 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        )}
      </div>

      {/* THE CODE BOX */}
      <div className="w-full max-w-xl relative z-10 rounded-3xl overflow-hidden mb-5"
        style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>

        {/* Code header */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-2">
            <span className="text-sm">📋</span>
            <span className="text-red-300 text-xs font-bold uppercase tracking-widest">Your Kill Code</span>
          </div>
          <span className="text-zinc-500 text-xs">Paste before &lt;/body&gt; in your site</span>
        </div>

        {/* Code content */}
        <pre className="p-5 text-xs text-zinc-400 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all"
          style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {killCode}
        </pre>

        {/* Copy button */}
        <div className="px-5 pb-5">
          <button onClick={copyCode}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: codeCopied ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #dc2626, #991b1b)',
              border: codeCopied ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(220,38,38,0.3)',
              color: codeCopied ? '#4ade80' : 'white',
              boxShadow: codeCopied ? 'none' : '0 0 30px rgba(220,38,38,0.2)',
            }}>
            {codeCopied ? '✅ Code Copied! Paste it into your website' : '📋 Copy Kill Code'}
          </button>
        </div>
      </div>

      {/* How to use */}
      <div className="w-full max-w-xl relative z-10 rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">How to use</p>
        <ol className="space-y-2 text-zinc-400 text-sm">
          <li className="flex gap-2"><span className="text-red-500 font-bold">1.</span> Copy the kill code above</li>
          <li className="flex gap-2"><span className="text-red-500 font-bold">2.</span> Open your website's HTML file</li>
          <li className="flex gap-2"><span className="text-red-500 font-bold">3.</span> Paste the code just before the <code className="text-red-400 bg-zinc-800 px-1 rounded">&lt;/body&gt;</code> tag</li>
          <li className="flex gap-2"><span className="text-red-500 font-bold">4.</span> Save and deploy — your site is now killed ☠️</li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-xl relative z-10">
        <button onClick={copyReport}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa' }}>
          {copied ? '✅ Copied!' : '📄 Copy Report'}
        </button>
        <button onClick={() => router.push('/')}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 text-white"
          style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 30px rgba(220,38,38,0.25)' }}>
          ☠️ Kill Another
        </button>
      </div>

    </main>
  )
}

export default function KilledPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-600 text-sm">Loading...</div>
    }>
      <KilledContent />
    </Suspense>
  )
}
