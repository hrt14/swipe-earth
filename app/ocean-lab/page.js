'use client';

import { useMemo, useState } from 'react';

const species = {
  barreleye: {
    name: 'BARRELEYE',
    jp: 'デメニギス',
    depth: '600–800 m',
    image: '/ocean/creatures/barreleye-art.svg',
    note: '透明な頭部と上向きの眼を持つ深海魚。わずかな光と影を探して漂う。',
    tag: 'REAL SPECIES'
  },
  anglerfish: {
    name: 'ANGLERFISH',
    jp: 'チョウチンアンコウの仲間',
    depth: '1,000 m–',
    image: '/ocean/creatures/anglerfish-art.svg',
    note: '暗闇の中で発光器を使う深海魚。光は獲物を誘うための重要な道具になる。',
    tag: 'REAL SPECIES'
  },
  vampireSquid: {
    name: 'VAMPIRE SQUID',
    jp: 'コウモリダコ',
    depth: '600–1,200 m',
    image: '/ocean/creatures/vampire-squid-art.svg',
    note: '酸素の少ない中深層に適応した頭足類。腕の間の膜を広げて身を守る。',
    tag: 'REAL SPECIES'
  },
  gulperEel: {
    name: 'GULPER EEL',
    jp: 'フクロウナギ',
    depth: '1,000–3,000 m',
    image: '/ocean/creatures/gulper-eel-art.svg',
    note: '大きく開く口と細長い尾が特徴。深海の暗闇をゆっくり泳ぐ。',
    tag: 'REAL SPECIES'
  },
  giantSquid: {
    name: 'GIANT SQUID',
    jp: 'ダイオウイカ',
    depth: 'DEEP WATER',
    image: '/ocean/creatures/giant-squid-art.svg',
    note: '遠景を横切る大型生物。試作では、発見した瞬間のスケール感を確認する。',
    tag: 'LARGE ENCOUNTER'
  }
};

const creatures = [
  { id: 'barreleye-a', species: 'barreleye', x: 15, y: 23, size: 15, layer: 'far', delay: -1.2, duration: 7.8 },
  { id: 'barreleye-b', species: 'barreleye', x: 68, y: 18, size: 11, layer: 'far', delay: -3.4, duration: 8.6, flip: true },
  { id: 'barreleye-c', species: 'barreleye', x: 77, y: 42, size: 13, layer: 'mid', delay: -5.1, duration: 7.1 },
  { id: 'angler-a', species: 'anglerfish', x: 12, y: 51, size: 22, layer: 'mid', delay: -2.1, duration: 8.3 },
  { id: 'angler-b', species: 'anglerfish', x: 66, y: 64, size: 18, layer: 'near', delay: -4.6, duration: 6.7, flip: true },
  { id: 'vampire-a', species: 'vampireSquid', x: 46, y: 34, size: 24, layer: 'near', delay: -2.8, duration: 7.4 },
  { id: 'vampire-b', species: 'vampireSquid', x: 27, y: 72, size: 17, layer: 'mid', delay: -6.2, duration: 9.2, flip: true },
  { id: 'gulper-a', species: 'gulperEel', x: 61, y: 78, size: 24, layer: 'mid', delay: -3.8, duration: 8.9 },
  { id: 'giant-squid-a', species: 'giantSquid', x: 7, y: 8, size: 76, layer: 'silhouette', delay: -8, duration: 18, flip: true }
];

function Creature({ item, selected, onSelect }) {
  const creature = species[item.species];
  return (
    <button
      type="button"
      className={`creature creature-${item.layer} ${selected ? 'is-selected' : ''}`}
      style={{
        '--x': `${item.x}%`,
        '--y': `${item.y}%`,
        '--size': `${item.size}%`,
        '--delay': `${item.delay}s`,
        '--duration': `${item.duration}s`,
        '--flip': item.flip ? -1 : 1
      }}
      onClick={() => onSelect(item.species)}
      aria-label={`${creature.jp}の詳細を開く`}
      aria-pressed={selected}
    >
      <span className="target-ring" />
      <img src={creature.image} alt="" draggable="false" />
    </button>
  );
}

export default function OceanLab() {
  const [selectedId, setSelectedId] = useState('vampireSquid');
  const selected = useMemo(() => species[selectedId], [selectedId]);

  return (
    <main className="lab-shell">
      <section className="phone-stage" aria-label="SWIPE EARTH OCEAN 群生型プロトタイプ">
        <img className="depth-background" src="/ocean/ocean-depth-art.svg" alt="" />
        <img className="particle-layer particles-a" src="/ocean/ocean-particles.svg" alt="" />
        <img className="particle-layer particles-b" src="/ocean/ocean-particles.svg" alt="" />
        <div className="vignette" />

        <header className="top-hud">
          <a href="/ocean" className="brand">SWIPE EARTH <span>/ OCEAN</span></a>
          <div className="depth-readout">
            <small>DEPTH</small>
            <strong>1,450m</strong>
            <span>MIDNIGHT ZONE</span>
          </div>
        </header>

        <aside className="depth-scale" aria-hidden="true">
          <span>1,000</span>
          <i style={{ '--p': '18%' }} />
          <i style={{ '--p': '42%' }} />
          <b style={{ '--p': '56%' }} />
          <i style={{ '--p': '78%' }} />
          <span>2,000</span>
        </aside>

        <div className="scene-label">
          <small>INTERACTION PROTOTYPE</small>
          <strong>同じ深度に生き物が共存する</strong>
          <span>気になる生き物をタップ</span>
        </div>

        <div className="creature-field">
          {creatures.map((item) => (
            <Creature
              key={item.id}
              item={item}
              selected={item.species === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <section className="detail-card" aria-live="polite">
          <div className="detail-thumb"><img src={selected.image} alt="" /></div>
          <div className="detail-copy">
            <div className="detail-topline"><span>{selected.tag}</span><b>{selected.depth}</b></div>
            <h1>{selected.name}</h1>
            <h2>{selected.jp}</h2>
            <p>{selected.note}</p>
          </div>
          <button type="button" className="close-card" onClick={() => setSelectedId('vampireSquid')} aria-label="初期表示に戻す">↺</button>
        </section>
      </section>

      <style jsx global>{`
        *{box-sizing:border-box}
        html,body{margin:0;background:#02050c;color:#f4fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        button{font:inherit}
        .lab-shell{min-height:100svh;display:grid;place-items:center;background:radial-gradient(circle at 50% 20%,#102442 0,#02050c 58%);overflow:hidden}
        .phone-stage{position:relative;width:min(100vw,520px);height:100svh;min-height:680px;overflow:hidden;background:#020916;isolation:isolate}
        .depth-background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 48%;transform:scale(1.08);filter:saturate(1.15) contrast(1.06)}
        .particle-layer{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;mix-blend-mode:screen;opacity:.34;animation:particle-drift 20s linear infinite}
        .particles-b{opacity:.16;transform:scaleX(-1);animation-duration:31s;animation-direction:reverse}
        .vignette{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,6,20,.72),transparent 24%,transparent 68%,rgba(0,3,12,.92)),radial-gradient(circle at center,transparent 35%,rgba(0,2,10,.58) 100%);pointer-events:none;z-index:2}
        .top-hud{position:absolute;z-index:20;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:flex-start;padding:18px 18px 28px;background:linear-gradient(180deg,rgba(2,6,17,.92),rgba(2,6,17,.4) 65%,transparent)}
        .brand{color:white;text-decoration:none;font-size:11px;letter-spacing:.16em;font-weight:850}.brand span{color:#7bdcff;font-weight:600}
        .depth-readout{text-align:right}.depth-readout small{display:block;font-size:8px;letter-spacing:.18em;opacity:.58}.depth-readout strong{display:block;font-size:24px;line-height:1.05}.depth-readout span{display:inline-block;margin-top:5px;padding:4px 7px;border:1px solid rgba(126,106,255,.45);border-radius:999px;background:rgba(62,38,142,.42);color:#c9c3ff;font-size:8px;letter-spacing:.11em;font-weight:800}
        .depth-scale{position:absolute;z-index:15;top:120px;bottom:220px;left:14px;width:32px;border-left:1px solid rgba(151,219,255,.25)}
        .depth-scale span{position:absolute;left:7px;font-size:8px;letter-spacing:.08em;opacity:.5}.depth-scale span:first-child{top:-4px}.depth-scale span:last-child{bottom:-4px}.depth-scale i,.depth-scale b{position:absolute;left:-3px;top:var(--p);width:6px;height:1px;background:rgba(158,217,255,.5)}.depth-scale b{width:10px;height:10px;left:-5px;border:2px solid #a77cff;border-radius:50%;background:#071025;box-shadow:0 0 15px #845bff}
        .scene-label{position:absolute;z-index:12;top:106px;left:58px;right:18px}.scene-label small{display:block;font-size:7px;letter-spacing:.18em;color:#7edfff}.scene-label strong{display:block;margin-top:4px;font-size:13px}.scene-label span{display:block;margin-top:3px;font-size:10px;opacity:.58}
        .creature-field{position:absolute;z-index:8;inset:130px 0 196px}
        .creature{position:absolute;left:var(--x);top:var(--y);width:var(--size);aspect-ratio:1.25;border:0;padding:0;background:transparent;cursor:pointer;transform:translate(-50%,-50%) scaleX(var(--flip));filter:drop-shadow(0 12px 16px rgba(0,0,0,.38));animation:creature-float var(--duration) ease-in-out var(--delay) infinite;transition:filter .25s ease,z-index .25s ease}
        .creature img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none}
        .creature-far{opacity:.58;filter:blur(.2px) drop-shadow(0 8px 13px rgba(0,0,0,.35))}.creature-mid{opacity:.82}.creature-near{z-index:3}.creature-silhouette{opacity:.12;filter:brightness(.3) saturate(.4) blur(1.2px);pointer-events:none;animation:giant-pass var(--duration) ease-in-out var(--delay) infinite}
        .target-ring{position:absolute;left:50%;top:50%;width:58%;aspect-ratio:1;border:1px solid rgba(136,203,255,.42);border-radius:50%;transform:translate(-50%,-50%) scaleX(var(--flip));opacity:0;transition:opacity .2s,transform .2s;box-shadow:0 0 18px rgba(83,138,255,.3)}
        .creature:hover .target-ring,.creature:focus-visible .target-ring,.creature.is-selected .target-ring{opacity:1;transform:translate(-50%,-50%) scaleX(var(--flip)) scale(1.12)}
        .creature.is-selected{z-index:6;filter:drop-shadow(0 0 16px rgba(143,104,255,.75)) drop-shadow(0 12px 16px rgba(0,0,0,.45))}
        .detail-card{position:absolute;z-index:30;left:12px;right:12px;bottom:12px;min-height:166px;display:grid;grid-template-columns:78px 1fr 28px;gap:12px;align-items:start;padding:15px;border:1px solid rgba(144,189,255,.22);border-radius:22px;background:linear-gradient(145deg,rgba(8,16,42,.92),rgba(20,12,54,.9));box-shadow:0 24px 70px rgba(0,0,0,.48),inset 0 1px rgba(255,255,255,.07);backdrop-filter:blur(18px)}
        .detail-thumb{width:78px;height:78px;display:grid;place-items:center;border-radius:18px;background:radial-gradient(circle,#3a266f 0,#101a3e 70%);overflow:hidden}.detail-thumb img{width:84%;height:84%;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(0,0,0,.4))}
        .detail-topline{display:flex;justify-content:space-between;gap:8px;align-items:center}.detail-topline span{font-size:7px;letter-spacing:.13em;color:#ad91ff}.detail-topline b{font-size:8px;color:#8ddfff}
        .detail-copy h1{margin:6px 0 0;font-size:19px;line-height:1;letter-spacing:.03em}.detail-copy h2{margin:4px 0 0;font-size:11px;font-weight:650;color:#c8d9ea}.detail-copy p{margin:9px 0 0;font-size:10px;line-height:1.55;color:rgba(231,242,255,.72)}
        .close-card{width:28px;height:28px;border:1px solid rgba(255,255,255,.15);border-radius:50%;background:rgba(255,255,255,.06);color:white;cursor:pointer}
        @keyframes creature-float{0%,100%{translate:0 0;rotate:-1deg}50%{translate:8px -12px;rotate:2deg}}
        @keyframes giant-pass{0%,100%{translate:-12% 0;scale:.96}50%{translate:16% 5%;scale:1.04}}
        @keyframes particle-drift{from{translate:0 0}to{translate:-4% 7%}}
        @media(min-width:521px){.phone-stage{height:min(920px,100svh);border-left:1px solid rgba(255,255,255,.08);border-right:1px solid rgba(255,255,255,.08);box-shadow:0 40px 120px rgba(0,0,0,.65)}}
        @media(max-height:720px){.phone-stage{min-height:100svh}.creature-field{inset:108px 0 174px}.scene-label{top:88px}.detail-card{min-height:146px}.detail-copy p{font-size:9px}}
        @media(prefers-reduced-motion:reduce){.particle-layer,.creature{animation:none!important}}
      `}</style>
    </main>
  );
}
