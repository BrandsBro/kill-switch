'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const KILL_INFO = {
  dead:    { emoji: '💀', label: 'DEAD',    glow: '#52525b', accent: '#a1a1aa' },
  expired: { emoji: '⏰', label: 'EXPIRED', glow: '#ca8a04', accent: '#fbbf24' },
  moved:   { emoji: '📦', label: 'MOVED',   glow: '#2563eb', accent: '#60a5fa' },
  blocked: { emoji: '🚫', label: 'BLOCKED', glow: '#ea580c', accent: '#fb923c' },
  nuked:   { emoji: '☢️', label: 'NUKED',   glow: '#16a34a', accent: '#4ade80' },
  private: { emoji: '🔒', label: 'PRIVATE', glow: '#7c3aed', accent: '#a78bfa' },
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

  var styles = \`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

    #lk-root * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes lk-glitch1 {
      0%,100% { clip-path: inset(0 0 98% 0); transform: translate(-4px,0); }
      25%      { clip-path: inset(30% 0 50% 0); transform: translate(4px,0); }
      50%      { clip-path: inset(60% 0 20% 0); transform: translate(-2px,0); }
      75%      { clip-path: inset(80% 0 5% 0);  transform: translate(2px,0); }
    }
    @keyframes lk-glitch2 {
      0%,100% { clip-path: inset(50% 0 30% 0); transform: translate(4px,0); }
      33%      { clip-path: inset(10% 0 70% 0); transform: translate(-4px,0); }
      66%      { clip-path: inset(85% 0 2% 0);  transform: translate(3px,0); }
    }
    @keyframes lk-flicker {
      0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
      20%,24%,55% { opacity: 0.4; }
    }
    @keyframes lk-scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes lk-fadein {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes lk-pulse {
      0%,100% { opacity: 0.08; transform: translate(-50%,-50%) scale(1); }
      50%      { opacity: 0.18; transform: translate(-50%,-50%) scale(1.1); }
    }
    @keyframes lk-border {
      0%,100% { opacity: 0.4; }
      50%      { opacity: 1; }
    }
    @keyframes lk-typing {
      from { width: 0; }
      to   { width: 100%; }
    }
    @keyframes lk-blink {
      0%,100% { opacity: 1; } 50% { opacity: 0; }
    }
    @keyframes lk-shake {
      0%,100% { transform: translateX(0); }
      10%,30%,50%,70%,90% { transform: translateX(-3px); }
      20%,40%,60%,80% { transform: translateX(3px); }
    }

    #lk-root {
      position: fixed; inset: 0; z-index: 2147483647;
      background: #000;
      font-family: 'Inter', -apple-system, sans-serif;
      overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }

    .lk-noise {
      position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: 0.35;
    }

    .lk-scanline-wrap {
      position: absolute; inset: 0; pointer-events: none; overflow: hidden;
    }
    .lk-scanline-line {
      position: absolute; left: 0; right: 0; height: 120px;
      background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.03), transparent);
      animation: lk-scanline 4s linear infinite;
    }

    .lk-lines {
      position: absolute; inset: 0; pointer-events: none;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px);
    }

    .lk-glow {
      position: absolute; top: 50%; left: 50%;
      width: 900px; height: 900px; border-radius: 50%;
      filter: blur(180px); pointer-events: none;
      animation: lk-pulse 4s ease-in-out infinite;
    }

    .lk-center {
      position: relative; z-index: 2;
      display: flex; flex-direction: column; align-items: center;
      padding: 24px; text-align: center; width: 100%; max-width: 600px;
    }

    .lk-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 20px; border-radius: 999px;
      font-size: 11px; font-weight: 800; letter-spacing: 0.2em;
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.05);
      margin-bottom: 36px;
      animation: lk-fadein 0.6s ease both;
    }

    .lk-skull {
      font-size: 100px; line-height: 1;
      margin-bottom: 20px;
      animation: lk-fadein 0.6s ease 0.1s both, lk-flicker 5s ease 2s infinite;
      filter: drop-shadow(0 0 60px var(--accent));
    }

    .lk-title-wrap {
      position: relative; margin-bottom: 6px;
      animation: lk-fadein 0.6s ease 0.2s both;
    }
    .lk-title {
      font-size: clamp(52px, 10vw, 96px);
      font-weight: 900; letter-spacing: -4px; line-height: 1;
      background: linear-gradient(135deg, #fff 0%, var(--accent) 60%, #ff0000 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      position: relative; z-index: 1;
    }
    .lk-title-ghost {
      position: absolute; inset: 0;
      font-size: clamp(52px, 10vw, 96px);
      font-weight: 900; letter-spacing: -4px; line-height: 1;
      color: var(--accent); opacity: 0.7;
      animation: lk-glitch1 3s infinite linear;
    }
    .lk-title-ghost2 {
      position: absolute; inset: 0;
      font-size: clamp(52px, 10vw, 96px);
      font-weight: 900; letter-spacing: -4px; line-height: 1;
      color: #ff0000; opacity: 0.5;
      animation: lk-glitch2 3.5s infinite linear;
    }

    .lk-subtitle {
      font-size: 11px; letter-spacing: 0.3em; font-weight: 700;
      color: rgba(255,255,255,0.25); margin-bottom: 40px;
      text-transform: uppercase;
      animation: lk-fadein 0.6s ease 0.3s both;
    }

    .lk-card {
      width: 100%; border-radius: 20px; overflow: hidden;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
      animation: lk-fadein 0.8s ease 0.4s both;
      margin-bottom: 16px;
    }

    .lk-card-top {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 18px;
      background: rgba(255,0,0,0.06);
      border-bottom: 1px solid rgba(255,0,0,0.1);
    }
    .lk-dot { width: 10px; height: 10px; border-radius: 50%; }

    .lk-url-bar {
      flex: 1; padding: 4px 12px; border-radius: 6px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.07);
      font-size: 11px; font-family: monospace;
      color: rgba(255,255,255,0.2);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .lk-card-body { padding: 24px; }

    .lk-field-label {
      font-size: 10px; font-weight: 800; letter-spacing: 0.2em;
      text-transform: uppercase; color: rgba(255,255,255,0.2);
      margin-bottom: 8px;
    }

    .lk-url-box {
      padding: 14px 16px; border-radius: 12px;
      background: rgba(239,68,68,0.07);
      border: 1px solid rgba(239,68,68,0.15);
      margin-bottom: 20px;
    }
    .lk-url-text {
      font-family: monospace; font-size: 13px; color: #f87171;
      text-decoration: line-through; text-decoration-color: rgba(239,68,68,0.5);
      word-break: break-all; line-height: 1.6;
    }

    .lk-msg-box {
      padding: 14px 16px; border-radius: 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .lk-msg-text {
      font-size: 14px; color: rgba(255,255,255,0.75);
      line-height: 1.8;
    }

    .lk-terminal {
      width: 100%; border-radius: 14px; overflow: hidden;
      background: #000; border: 1px solid rgba(255,255,255,0.08);
      animation: lk-fadein 0.8s ease 0.55s both;
      margin-bottom: 24px;
    }
    .lk-terminal-top {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 14px; background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .lk-terminal-body { padding: 16px 18px; }
    .lk-terminal-line {
      font-family: monospace; font-size: 12px;
      color: rgba(255,255,255,0.3); line-height: 2; display: flex; gap: 8px;
    }
    .lk-terminal-line .p { color: #4ade80; }
    .lk-terminal-line .e { color: #f87171; }
    .lk-terminal-line .w { color: #fbbf24; }
    .lk-terminal-line .a { color: var(--accent); }

    .lk-footer {
      font-size: 10px; letter-spacing: 0.2em; font-weight: 700;
      color: rgba(255,255,255,0.1); text-transform: uppercase;
      animation: lk-fadein 0.8s ease 0.7s both;
    }

    .lk-border-anim {
      position: absolute; inset: 0; pointer-events: none; border-radius: 20px;
      border: 1px solid var(--accent); opacity: 0;
      animation: lk-border 2s ease-in-out 1s infinite;
    }
  \`;

  var styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  var root = document.createElement('div');
  root.id = 'lk-root';
  root.style.setProperty('--accent', cfg.accent);
  root.style.setProperty('--glow', cfg.glow);

  root.innerHTML = \`
    <div class="lk-noise"></div>
    <div class="lk-lines"></div>
    <div class="lk-scanline-wrap"><div class="lk-scanline-line"></div></div>
    <div class="lk-glow" style="background:\${cfg.glow}"></div>

    <div class="lk-center">
      <div class="lk-badge" style="color:\${cfg.accent}">
        \${cfg.emoji} &nbsp; \${cfg.label} &nbsp; \${cfg.emoji}
      </div>

      <div class="lk-skull">☠️</div>

      <div class="lk-title-wrap">
        <div class="lk-title-ghost">LINK KILLED</div>
        <div class="lk-title-ghost2">LINK KILLED</div>
        <div class="lk-title">LINK KILLED</div>
      </div>

      <div class="lk-subtitle">\${cfg.killedAt} &nbsp;·&nbsp; access denied</div>

      <div class="lk-card" style="position:relative">
        <div class="lk-border-anim"></div>
        <div class="lk-card-top">
          <div class="lk-dot" style="background:#ff5f57"></div>
          <div class="lk-dot" style="background:#febc2e"></div>
          <div class="lk-dot" style="background:#28c840"></div>
          <div class="lk-url-bar">\${cfg.url}</div>
        </div>
        <div class="lk-card-body">
          <div class="lk-field-label">⚰️ &nbsp; Killed URL</div>
          <div class="lk-url-box">
            <div class="lk-url-text">\${cfg.url}</div>
          </div>
          \${cfg.message ? \`
            <div class="lk-field-label">💬 &nbsp; Message</div>
            <div class="lk-msg-box">
              <div class="lk-msg-text">\${cfg.message}</div>
            </div>
          \` : ''}
        </div>
      </div>

      <div class="lk-terminal">
        <div class="lk-terminal-top">
          <div class="lk-dot" style="background:#ff5f57"></div>
          <div class="lk-dot" style="background:#febc2e"></div>
          <div class="lk-dot" style="background:#28c840"></div>
          <span style="font-size:11px;font-family:monospace;color:rgba(255,255,255,0.2);margin-left:8px">kill.log</span>
        </div>
        <div class="lk-terminal-body">
          <div class="lk-terminal-line"><span class="p">›</span><span>Initializing kill sequence...</span><span class="p">done</span></div>
          <div class="lk-terminal-line"><span class="p">›</span><span>Target URL:</span><span class="e">\${cfg.url.substring(0,40)}\${cfg.url.length>40?'...':''}</span></div>
          <div class="lk-terminal-line"><span class="p">›</span><span>Kill type:</span><span class="a">\${cfg.label}</span></div>
          <div class="lk-terminal-line"><span class="p">›</span><span>Timestamp:</span><span class="w">\${cfg.killedAt}</span></div>
          <div class="lk-terminal-line"><span class="e">✗</span><span style="color:#f87171;font-weight:700">ACCESS TERMINATED — THIS SITE HAS BEEN KILLED</span></div>
        </div>
      </div>

      <div class="lk-footer">Powered by Link Killer ☠️</div>
    </div>
  \`;

  document.body.style.overflow = 'hidden';
  document.body.appendChild(root);
})();
<\/script>`
}

function KilledContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [codeCopied, setCodeCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const url      = params.get('url') || ''
  const message  = params.get('message') || ''
  const killType = params.get('killType') || 'dead'
  const info     = KILL_INFO[killType] || KILL_INFO.dead
  const now      = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  const killCode = generateKillCode(url, killType, message, info, now)

  useEffect(() => {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
    if (!scriptUrl || !url || saved) return
    setSaved(true)
    fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, killType, message, country: 'Unknown' }),
      mode: 'no-cors',
    }).catch(() => {})
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(killCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 3000)
  }

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.008) 2px,rgba(255,255,255,0.008) 4px)' }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[180px]"
          style={{ background: info.glow, opacity: 0.12 }} />
      </div>

      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black mb-10 relative z-10 tracking-widest"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: info.accent }}>
        {info.emoji} &nbsp;{info.label}
      </div>

      <div className="relative z-10 mb-6" style={{ filter: `drop-shadow(0 0 60px ${info.glow})` }}>
        <div className="text-8xl text-center">☠️</div>
      </div>

      <h1 className="text-7xl font-black tracking-tighter mb-2 relative z-10 text-center"
        style={{ background: `linear-gradient(135deg, #ffffff 0%, ${info.accent} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        LINK KILLED
      </h1>
      <p className="text-zinc-700 text-xs mb-12 relative z-10 tracking-widest uppercase">{now}</p>

      <div className="w-full max-w-xl relative z-10 mb-6 rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
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

      <div className="w-full max-w-xl relative z-10 rounded-2xl overflow-hidden mb-4"
        style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)' }}>
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
              background: codeCopied ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #dc2626, #991b1b)',
              border: codeCopied ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(220,38,38,0.3)',
              color: codeCopied ? '#4ade80' : '#fff',
              boxShadow: codeCopied ? 'none' : '0 0 40px rgba(220,38,38,0.25)',
            }}>
            {codeCopied ? '✅ COPIED! Paste into your website' : '📋 COPY KILL CODE'}
          </button>
        </div>
      </div>

      <div className="w-full max-w-xl relative z-10 rounded-2xl p-5 mb-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-3">How to use</p>
        <div className="space-y-2">
          {['Copy the kill code above', 'Open your website HTML file', 'Paste just before the </body> tag', 'Save & deploy — site is now killed ☠️'].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: `${info.glow}33`, color: info.accent }}>{i + 1}</div>
              <span className="text-zinc-400 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 w-full max-w-xl relative z-10">
        <button onClick={() => router.push('/')}
          className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa' }}>
          ← Kill Another
        </button>
        <button onClick={() => router.push('/dashboard')}
          className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 text-white"
          style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)', boxShadow: '0 0 30px rgba(220,38,38,0.25)' }}>
          📊 Dashboard
        </button>
      </div>
    </main>
  )
}

export default function KilledPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-600 text-sm">Loading...</div>}>
      <KilledContent />
    </Suspense>
  )
}
