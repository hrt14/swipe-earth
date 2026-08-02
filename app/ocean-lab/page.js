'use client';

import { useState } from 'react';
import sceneData from '../../data/ocean/midnight-scene.json';

const { zone, species, instances } = sceneData;

function SafeImage({ src, className = '', alt = '' }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <img src={src} className={className} alt={alt} draggable="false" onError={() => setFailed(true)} />;
}

function Creature({ item, selected, onSelect }) {
  const creature = species[item.species];
  const decorative = item.layer === 'silhouette';
  return (
    <button
      type="button"
      className={`creature creature-${item.layer} ${selected ? 'is-selected' : ''}`}
      style={{
        '--x': `${item.x}%`, '--y': `${item.y}%`, '--size': `${item.size}%`,
        '--delay': `${item.delay}s`, '--duration': `${item.duration}s`, '--flip': item.flip ? -1 : 1
      }}
      onClick={() => !decorative && onSelect(item.species)}
      aria-label={decorative ? undefined : `${creature.jp}の詳細を開く`}
      aria-pressed={decorative ? undefined : selected}
      tabIndex={decorative ? -1 : 0}
    >
      {!decorative && <span className="target-ring" />}
      <SafeImage src={creature.image} />
    </button>
  );
}

export default function OceanLab() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = selectedId ? species[selectedId] : null;

  return (
    <main className="lab-shell">
      <section className="phone-stage" aria-label={`SWIPE EARTH OCEAN ${zone.nameEn}`}>
        <SafeImage className="depth-background" src={zone.background} />
        <SafeImage className="particle-layer particles-a" src="/ocean/ocean-particles.svg" />
        <SafeImage className="particle-layer particles-b" src="/ocean/ocean-particles.svg" />
        <div className="vignette" />

        <header className="top-hud">
          <a href="/ocean" className="brand">SWIPE EARTH <span>/ OCEAN</span></a>
          <div className="depth-readout"><small>DEPTH</small><strong>{zone.depthDisplay}</strong><span>{zone.nameEn}</span></div>
        </header>

        <aside className="depth-scale" aria-hidden="true">
          <span>1,000</span><i style={{ '--p': '18%' }} /><i style={{ '--p': '42%' }} />
          <b style={{ '--p': '56%' }} /><i style={{ '--p': '78%' }} /><span>2,000</span>
        </aside>

        <div className="scene-label">
          <small>PRODUCTION PREVIEW</small>
          <strong>光の届かない海を観察する</strong>
          <span>生き物をタップすると詳細を表示</span>
        </div>

        <div className="creature-field">
          {instances.map((item) => <Creature key={item.id} item={item} selected={item.species === selectedId} onSelect={setSelectedId} />)}
        </div>

        <div className={`tap-guide ${selected ? 'is-hidden' : ''}`} aria-hidden="true"><span /> TAP A CREATURE</div>

        {selected && (
          <section className="detail-card" aria-live="polite">
            <div className="detail-thumb"><SafeImage src={selected.image} /></div>
            <div className="detail-copy">
              <div className="detail-topline"><span>{selected.tag}</span><b>{selected.depth}</b></div>
              <h1>{selected.name}</h1><h2>{selected.jp}</h2><p>{selected.note}</p>
            </div>
            <button type="button" className="close-card" onClick={() => setSelectedId(null)} aria-label="詳細を閉じる">×</button>
          </section>
        )}
      </section>

      <style jsx global>{`
        *{box-sizing:border-box}html,body{margin:0;background:#01040a;color:#f4fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button{font:inherit}
        .lab-shell{min-height:100svh;display:grid;place-items:center;background:radial-gradient(circle at 50% 18%,#10233f 0,#01040a 62%);overflow:hidden}
        .phone-stage{position:relative;width:min(100vw,520px);height:100svh;min-height:680px;overflow:hidden;background:#020916;isolation:isolate}
        .depth-background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.08) contrast(1.05)}
        .particle-layer{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;mix-blend-mode:screen;opacity:.24;animation:particle-drift 24s linear infinite}.particles-b{opacity:.11;transform:scaleX(-1);animation-duration:37s;animation-direction:reverse}
        .vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,rgba(0,5,15,.78),transparent 25%,transparent 69%,rgba(0,2,9,.9)),radial-gradient(circle at 48% 42%,transparent 32%,rgba(0,2,9,.52) 100%)}
        .top-hud{position:absolute;z-index:20;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:flex-start;padding:18px 18px 30px;background:linear-gradient(180deg,rgba(1,5,14,.94),rgba(1,5,14,.42) 68%,transparent)}
        .brand{color:white;text-decoration:none;font-size:11px;letter-spacing:.16em;font-weight:850}.brand span{color:#7bdcff;font-weight:600}
        .depth-readout{text-align:right}.depth-readout small{display:block;font-size:8px;letter-spacing:.18em;opacity:.58}.depth-readout strong{display:block;font-size:24px;line-height:1.05}.depth-readout span{display:inline-block;margin-top:5px;padding:4px 7px;border:1px solid rgba(126,106,255,.42);border-radius:999px;background:rgba(52,34,119,.38);color:#cec8ff;font-size:8px;letter-spacing:.11em;font-weight:800}
        .depth-scale{position:absolute;z-index:15;top:120px;bottom:86px;left:14px;width:32px;border-left:1px solid rgba(151,219,255,.22)}.depth-scale span{position:absolute;left:7px;font-size:8px;letter-spacing:.08em;opacity:.44}.depth-scale span:first-child{top:-4px}.depth-scale span:last-child{bottom:-4px}.depth-scale i,.depth-scale b{position:absolute;left:-3px;top:var(--p);width:6px;height:1px;background:rgba(158,217,255,.48)}.depth-scale b{width:10px;height:10px;left:-5px;border:2px solid #a77cff;border-radius:50%;background:#071025;box-shadow:0 0 15px #845bff}
        .scene-label{position:absolute;z-index:12;top:106px;left:58px;right:18px;pointer-events:none}.scene-label small{display:block;font-size:7px;letter-spacing:.18em;color:#7edfff}.scene-label strong{display:block;margin-top:4px;font-size:13px}.scene-label span{display:block;margin-top:3px;font-size:10px;opacity:.55}
        .creature-field{position:absolute;z-index:8;inset:130px 0 64px}.creature{position:absolute;left:var(--x);top:var(--y);width:var(--size);min-width:44px;min-height:44px;aspect-ratio:1.25;border:0;padding:0;background:transparent;cursor:pointer;transform:translate(-50%,-50%) scaleX(var(--flip));filter:drop-shadow(0 12px 16px rgba(0,0,0,.42));animation:creature-float var(--duration) ease-in-out var(--delay) infinite;transition:filter .25s ease,z-index .25s ease,opacity .25s ease}.creature img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none}.creature-far{opacity:.42;filter:blur(.35px) drop-shadow(0 8px 13px rgba(0,0,0,.38))}.creature-mid{opacity:.78}.creature-near{z-index:3}.creature-silhouette{opacity:.16;filter:brightness(.42) saturate(.45) blur(1.8px);pointer-events:none;animation:giant-pass var(--duration) ease-in-out var(--delay) infinite}
        .target-ring{position:absolute;left:50%;top:50%;width:66%;aspect-ratio:1;border:1px solid rgba(136,203,255,.38);border-radius:50%;transform:translate(-50%,-50%) scaleX(var(--flip));opacity:0;transition:opacity .2s,transform .2s;box-shadow:0 0 18px rgba(83,138,255,.28)}.creature:hover .target-ring,.creature:focus-visible .target-ring,.creature.is-selected .target-ring{opacity:1;transform:translate(-50%,-50%) scaleX(var(--flip)) scale(1.13)}.creature:focus-visible{outline:2px solid #8ddfff;outline-offset:4px}.creature.is-selected{z-index:6;filter:drop-shadow(0 0 18px rgba(143,104,255,.75)) drop-shadow(0 12px 16px rgba(0,0,0,.45))}
        .tap-guide{position:absolute;z-index:18;left:50%;bottom:22px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;font-size:8px;letter-spacing:.18em;color:rgba(219,241,255,.54);transition:opacity .25s}.tap-guide span{width:7px;height:7px;border:1px solid #8ddfff;border-radius:50%;box-shadow:0 0 11px #68d7ff}.tap-guide.is-hidden{opacity:0}
        .detail-card{position:absolute;z-index:30;left:12px;right:12px;bottom:12px;min-height:166px;display:grid;grid-template-columns:80px 1fr 30px;gap:12px;align-items:start;padding:15px;border:1px solid rgba(144,189,255,.22);border-radius:22px;background:linear-gradient(145deg,rgba(7,16,40,.94),rgba(20,12,54,.92));box-shadow:0 24px 70px rgba(0,0,0,.52),inset 0 1px rgba(255,255,255,.07);backdrop-filter:blur(18px);animation:card-in .22s ease-out}.detail-thumb{width:80px;height:80px;display:grid;place-items:center;border-radius:18px;background:radial-gradient(circle,#3a266f 0,#101a3e 70%);overflow:hidden}.detail-thumb img{width:88%;height:88%;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(0,0,0,.4))}.detail-topline{display:flex;justify-content:space-between;gap:8px;align-items:center}.detail-topline span{font-size:7px;letter-spacing:.13em;color:#ad91ff}.detail-topline b{font-size:8px;color:#8ddfff}.detail-copy h1{margin:6px 0 0;font-size:19px;line-height:1;letter-spacing:.03em}.detail-copy h2{margin:4px 0 0;font-size:11px;font-weight:650;color:#c8d9ea}.detail-copy p{margin:9px 0 0;font-size:10px;line-height:1.55;color:rgba(231,242,255,.72)}.close-card{width:30px;height:30px;border:1px solid rgba(255,255,255,.15);border-radius:50%;background:rgba(255,255,255,.06);color:white;cursor:pointer;font-size:18px;line-height:1}.close-card:focus-visible{outline:2px solid #8ddfff;outline-offset:2px}
        @keyframes creature-float{0%,100%{translate:0 0;rotate:-1deg}50%{translate:8px -11px;rotate:2deg}}@keyframes giant-pass{0%,100%{translate:-18% 0;scale:.94}50%{translate:24% 5%;scale:1.06}}@keyframes particle-drift{from{translate:0 0}to{translate:-4% 7%}}@keyframes card-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        @media(min-width:521px){.phone-stage{height:min(94svh,920px);min-height:720px;border:1px solid rgba(133,181,255,.16);border-radius:32px;box-shadow:0 40px 100px rgba(0,0,0,.58)}}
        @media(max-height:720px){.scene-label{top:94px}.creature-field{inset:116px 0 56px}.detail-card{min-height:148px}.detail-copy p{font-size:9px}.detail-thumb{width:68px;height:68px}.detail-card{grid-template-columns:68px 1fr 30px}}
        @media(prefers-reduced-motion:reduce){.creature,.particle-layer,.creature-silhouette{animation:none!important}.detail-card{animation:none}}
      `}</style>
    </main>
  );
}
