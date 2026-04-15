'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const KILL_INFO = {
  dead:    { emoji: '💀', label: 'DEAD',    glow: '#52525b', accent: '#a1a1aa', from: '#1c1c1e', to: '#09090b' },
  expired: { emoji: '⏰', label: 'EXPIRED', glow: '#ca8a04', accent: '#fbbf24', from: '#1c1500', to: '#09090b' },
  moved:   { emoji: '📦', label: 'MOVED',   glow: '#2563eb', accent: '#60a5fa', from: '#00101c', to: '#09090b' },
  blocked: { emoji: '🚫', label: 'BLOCKED', glow: '#ea580c', accent: '#fb923c', from: '#1c0800', to: '#09090b' },
  nuked:   { emoji: '☢️', label: 'NUKED',   glow: '#16a34a', accent: '#4ade80', from: '#001c08', to: '#09090b' },
  private: { emoji: '🔒', label: 'PRIVATE', glow: '#7c3aed', accent: '#a78bfa', from: '#0e0018', to: '#09090b' },
}

function generateKillCode(url, killType, message, info, now) {
  return `<!-- ☠️ LINK KILLER — paste before </body> -->
<script>
(function() {
  var cfg = {
    url: "${url}",
    label: "${info.label}",
    emoji: "${info.emoji}",
    message: ${message ? `"${message.replace(/"/g, '\\"')}"` : 'null'},
    killedAt: "${now}",
    glow: "${info.glow}",
    accent: "${info.accent}",
  };
  var s = document.createElement('style');
  s.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:0.15}50%{opacity:0.3}} .lk-fade{animation:fadeIn 0.8s ease forwards} .lk-fade-2{animation:fadeIn 0.8s ease 0.2s both} .lk-fade-3{animation:fadeIn 0.8s ease 0.4s both} .lk-fade-4{animation:fadeIn 0.8s ease 0.6s both} .lk-pulse{animation:pulse 3s ease-in-out infinite}';
  document.head.appendChild(s);
  var o = document.createElement('div');
  o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:#09090b;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:24px;box-sizing:border-box;overflow:hidden';
  o.innerHTML=\`
    <div class="lk-pulse" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;border-radius:50%;background:\${cfg.glow};filter:blur(160px);pointer-events:none"></div>
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.01) 2px,rgba(255,255,255,0.01) 4px);pointer-events:none"></div>
    <div class="lk-fade" style="display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border-radius:999px;margin-bottom:32px;font-size:11px;font-weight:800;letter-spacing:0.15em;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:\${cfg.accent}">\${cfg.emoji} &nbsp;\${cfg.label}</div>
    <div class="lk-fade-2" style="font-size:80px;margin-bottom:16px;filter:drop-shadow(0 0 40px \${cfg.glow})">☠️</div>
    <h1 class="lk-fade-2" style="font-size:clamp(40px,8vw,72px);font-weight:900;letter-spacing:-3px;margin:0 0 8px;background:linear-gradient(135deg,#ffffff 0%,\${cfg.accent} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center">LINK KILLED</h1>
    <p class="lk-fade-2" style="color:rgba(255,255,255,0.2);font-size:12px;margin:0 0 40px;letter-spacing:0.05em">\${cfg.killedAt}</p>
    <div class="lk-fade-3" style="width:100%;max-width:520px;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);backdrop-filter:blur(20px)">
      <div style="padding:6px 20px;background:rgba(255,0,0,0.08);border-bottom:1px solid rgba(255,0,0,0.12);display:flex;align-items:center;gap:8px">
        <div style="width:10px;height:10px;border-radius:50%;background:#ff5f57"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:#febc2e"></div>
        <div style="width:10px;height:10px;border-radius:50%;background:#28c840"></div>
        <span style="color:rgba(255,255,255,0.2);font-size:11px;margin-left:8px;font-family:monospace">\${cfg.url}</span>
      </div>
      <div style="padding:28px">
        <p style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.2);text-transform:uppercase;letter-spacing:0.15em;margin:0 0 10px">Killed URL</p>
        <p style="color:#f87171;font-family:monospace;font-size:13px;word-break:break-all;text-decoration:line-through;text-decoration-color:rgba(239,68,68,0.4);margin:0 0 20px;padding:12px 16px;background:rgba(239,68,68,0.06);border-radius:10px;border:1px solid rgba(239,68,68,0.12)">\${cfg.url}</p>
        \${cfg.message ? \`<p style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.2);text-transform:uppercase;letter-spacing:0.15em;margin:0 0 10px">Message</p><p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;line-height:1.7;padding:14px 16px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.07)">\${cfg.message}</p>\` : ''}
      </div>
    </div>
    <p class="lk-fade-4" style="margin-top:32px;color:rgba(255,255,255,0.12);font-size:11px;letter-spacing:0.1em">POWERED BY LINK KILLER ☠️</p>
  \`;
  document.body.style.overflow='hidden';
  document.body.appendChild(o);
})();
<\/script>`
}

function KilledContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [codeCopied, setCodeCopied] = useState(false)
  const [reportCopied, setReportCopied] = useState(false)

  const url      = params.get('url') || ''
  const message  = params.get('message') || ''
  const killType = params.get('killType') || 'dead'
  const info     = KILL_INFO[killType] || KILL_INFO.dead
  const now      = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  const killCode = generateKillCode(url, killType, message, info, now)

  const copyCode = () => {
    navigator.clipboard.writeText(killCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 3000)
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)' }} />

      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[180px]"
          style={{ background: info.glow, opacity: 0.12 }} />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black mb-10 relative z-10 tracking-widest"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.1)`, color: info.accent }}>
        {info.emoji} &nbsp;{info.label}
      </div>

      {/* Big skull */}
      <div className="relative z-10 mb-6" style={{ filter: `drop-shadow(0 0 60px ${info.glow})` }}>
        <div className="text-8xl text-center">☠️</div>
      </div>

      {/* Title */}
      <h1 className="text-7xl font-black tracking-tighter mb-2 relative z-10 text-center"
        style={{ background: `linear-gradient(135deg, #ffffff 0%, ${info.accent} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        LINK KILLED
      </h1>
      <p className="text-zinc-700 text-xs mb-12 relative z-10 tracking-widest uppercase">{now}</p>

      {/* Browser mockup card */}
      <div className="w-full max-w-xl relative z-10 mb-6 rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <div className="flex-1 mx-3 py-1 px-3 rounded-md text-xs text-zinc-600 font-mono truncate"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {url}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Killed URL</p>
            <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <p className="text-red-400 font-mono text-sm break-all line-through decoration-red-500/40 decoration-2">{url}</p>
            </div>
          </div>
          {message && (
            <div>
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-2">Kill Message</p>
              <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-zinc-300 text-sm leading-relaxed">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code box */}
      <div className="w-full max-w-xl relative z-10 rounded-2xl overflow-hidden mb-4"
        style={{ border: `1px solid rgba(255,255,255,0.08)`, background: 'rgba(0,0,0,0.4)' }}>
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: info.accent }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: info.accent }}>Kill Code</span>
          </div>
          <span className="text-zinc-600 text-xs font-mono">paste before &lt;/body&gt;</span>
        </div>
        <pre className="p-5 text-xs text-zinc-500 font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed"
          style={{ maxHeight: '180px', overflowY: 'auto' }}>
          {killCode}
        </pre>
        <div className="px-5 pb-5">
          <button onClick={copyCode}
            className="w-full py-3.5 rounded-xl text-sm font-black tracking-wide transition-all duration-300 active:scale-95"
            style={{
              background: codeCopied
                ? 'rgba(34,197,94,0.15)'
                : `linear-gradient(135deg, ${info.glow}, ${info.glow}cc)`,
              border: codeCopied ? '1px solid rgba(34,197,94,0.4)' : `1px solid ${info.accent}33`,
              color: codeCopied ? '#4ade80' : '#fff',
              boxShadow: codeCopied ? 'none' : `0 0 40px ${info.glow}44`,
            }}>
            {codeCopied ? '✅ COPIED! Paste into your website' : '📋 COPY KILL CODE'}
          </button>
        </div>
      </div>

      {/* How to use */}
      <div className="w-full max-w-xl relative z-10 rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-3">How to use</p>
        <div className="space-y-2">
          {[
            'Copy the kill code above',
            'Open your website HTML file',
            `Paste just before the </body> tag`,
            'Save & deploy — site is now killed ☠️',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: `${info.glow}33`, color: info.accent }}>
                {i + 1}
              </div>
              <span className="text-zinc-400 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-xl relative z-10">
        <button onClick={() => router.push('/')}
          className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 text-white"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          ← Kill Another
        </button>
        <button onClick={copyCode}
          className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, #dc2626, #991b1b)`,
            color: 'white',
            boxShadow: '0 0 30px rgba(220,38,38,0.25)',
          }}>
          ☠️ Copy Code
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
