'use client';

import { useEffect, useRef, useState } from 'react';

const zones = [
  {
    id: 'sunlit',
    name: 'SUNLIT ZONE',
    jp: '表層',
    range: '0–200m',
    depth: '100m',
    background: '/ocean/backgrounds/sunlit-production.svg',
    accent: '#8cecff',
    creatures: [
      { id: 'turtle-a', name: 'SEA TURTLE', jp: 'ウミガメ', depth: '0–200m', image: '/ocean/creatures/turtle-art.svg', note: '太陽光が届く海をゆっくり移動する。水面で呼吸しながら広い海を渡っていく。', x: 22, y: 36, size: 30, layer: 'near', duration: 9 },
      { id: 'turtle-b', name: 'SEA TURTLE', jp: 'ウミガメ', depth: '0–200m', image: '/ocean/creatures/turtle-art.svg', note: '太陽光が届く海をゆっくり移動する。水面で呼吸しながら広い海を渡っていく。', x: 78, y: 18, size: 17, layer: 'far', flip: true, duration: 11 },
      { id: 'manta-a', name: 'MANTA RAY', jp: 'マンタ', depth: 'SURFACE WATER', image: '/ocean/creatures/manta-art.svg', note: '大きな胸びれを広げ、青い水の中を滑るように泳ぐ。', x: 71, y: 43, size: 38, layer: 'mid', flip: true, duration: 10 },
      { id: 'shark-a', name: 'REEF SHARK', jp: 'メジロザメの仲間', depth: 'SHALLOW WATER', image: '/ocean/creatures/reef-shark-art.svg', note: '浅い海や岩礁の周辺を巡回する流線形のハンター。', x: 28, y: 72, size: 32, layer: 'mid', duration: 8 },
      { id: 'whale-a', name: 'BLUE WHALE', jp: 'シロナガスクジラ', depth: 'DISTANT ENCOUNTER', image: '/ocean/creatures/whale-art.svg', note: '巨大な体が遠くを通過し、海そのものが動いたようなスケールを感じさせる。', x: 76, y: 78, size: 78, layer: 'silhouette', flip: true, duration: 24 }
    ]
  },
  {
    id: 'twilight',
    name: 'TWILIGHT ZONE',
    jp: '薄明帯',
    range: '200–1,000m',
    depth: '620m',
    background: '/ocean/backgrounds/twilight-production.svg',
    accent: '#77bfff',
    creatures: [
      { id: 'jelly-a', name: 'DEEP-SEA JELLY', jp: '深海クラゲ', depth: 'DRIFTING LAYER', image: '/ocean/creatures/production/jellyfish.svg', note: '半透明の傘と触手を揺らし、流れに乗って静かに漂う。', x: 18, y: 22, size: 14, layer: 'far', duration: 13 },
      { id: 'jelly-b', name: 'DEEP-SEA JELLY', jp: '深海クラゲ', depth: 'DRIFTING LAYER', image: '/ocean/creatures/production/jellyfish.svg', note: '半透明の傘と触手を揺らし、流れに乗って静かに漂う。', x: 75, y: 31, size: 11, layer: 'far', flip: true, duration: 15 },
      { id: 'barreleye-a', name: 'BARRELEYE', jp: 'デメニギス', depth: 'MIDWATER', image: '/ocean/creatures/production/barreleye.svg', note: '透明な頭部の内側に筒状の眼を持ち、上方のわずかな光や影を探す。', x: 25, y: 48, size: 19, layer: 'mid', duration: 9 },
      { id: 'barreleye-b', name: 'BARRELEYE', jp: 'デメニギス', depth: 'MIDWATER', image: '/ocean/creatures/production/barreleye.svg', note: '透明な頭部の内側に筒状の眼を持ち、上方のわずかな光や影を探す。', x: 76, y: 66, size: 14, layer: 'far', flip: true, duration: 10 },
      { id: 'vampire-a', name: 'VAMPIRE SQUID', jp: 'コウモリダコ', depth: 'LOW OXYGEN LAYER', image: '/ocean/creatures/production/vampire-squid.svg', note: '酸素の少ない中深層に適応した頭足類。腕の間の膜が独特の姿を作る。', x: 28, y: 78, size: 25, layer: 'near', duration: 10 },
      { id: 'giant-squid-a', name: 'GIANT SQUID', jp: 'ダイオウイカ', depth: 'DEEP WATER', image: '/ocean/creatures/giant-squid-art.svg', note: '巨大な眼と長い触腕を持つ深海の大型頭足類。', x: 68, y: 49, size: 50, layer: 'near', flip: true, duration: 12 }
    ]
  },
  {
    id: 'midnight',
    name: 'MIDNIGHT ZONE',
    jp: '漸深海帯',
    range: '1,000–2,000m',
    depth: '1,450m',
    background: '/ocean/backgrounds/midnight-production.svg',
    accent: '#a78cff',
    creatures: [
      { id: 'angler-a', name: 'ANGLERFISH', jp: 'チョウチンアンコウの仲間', depth: 'DEEP WATER', image: '/ocean/creatures/production/anglerfish.svg', note: '発光器を持つ深海魚の仲間。暗闇の中で小さな光が強い存在感を放つ。', x: 18, y: 34, size: 25, layer: 'mid', duration: 9 },
      { id: 'angler-b', name: 'ANGLERFISH', jp: 'チョウチンアンコウの仲間', depth: 'DEEP WATER', image: '/ocean/creatures/production/anglerfish.svg', note: '発光器を持つ深海魚の仲間。暗闇の中で小さな光が強い存在感を放つ。', x: 74, y: 61, size: 21, layer: 'near', flip: true, duration: 8 },
      { id: 'vampire-b', name: 'VAMPIRE SQUID', jp: 'コウモリダコ', depth: 'LOW OXYGEN LAYER', image: '/ocean/creatures/production/vampire-squid.svg', note: '酸素の少ない中深層に適応した頭足類。腕の間の膜が独特の姿を作る。', x: 48, y: 38, size: 27, layer: 'near', duration: 10 },
      { id: 'gulper-a', name: 'GULPER EEL', jp: 'フクロウナギ', depth: 'BATHYPELAGIC', image: '/ocean/creatures/production/gulper-eel.svg', note: '大きく開く口と細長い尾を持つ深海魚。尾の先端には淡い光が浮かぶ。', x: 57, y: 78, size: 32, layer: 'mid', duration: 11 },
      { id: 'jelly-c', name: 'DEEP-SEA JELLY', jp: '深海クラゲ', depth: 'DRIFTING LAYER', image: '/ocean/creatures/production/jellyfish.svg', note: '半透明の傘と触手を揺らし、流れに乗って静かに漂う。', x: 18, y: 72, size: 13, layer: 'far', duration: 14 },
      { id: 'squid-shadow-a', name: 'GIANT SQUID', jp: 'ダイオウイカ', depth: 'DISTANT ENCOUNTER', image: '/ocean/creatures/production/giant-squid-shadow.svg', note: '遠景を横切る巨大な影。海の広さと未知の存在感を伝える。', x: 10, y: 12, size: 92, layer: 'silhouette', flip: true, duration: 23 }
    ]
  },
  {
    id: 'abyssal',
    name: 'ABYSSAL ZONE',
    jp: '深海底帯',
    range: '2,000–6,000m',
    depth: '4,100m',
    background: '/ocean/backgrounds/abyssal-production.svg',
    accent: '#7d83ff',
    creatures: [
      { id: 'dumbo-a', name: 'DUMBO OCTOPUS', jp: 'ジュウモンジダコの仲間', depth: 'DEEP SEAFLOOR', image: '/ocean/creatures/dumbo-octopus-art.svg', note: '耳のようなひれを動かし、海底の少し上をふわりと漂う。', x: 25, y: 31, size: 27, layer: 'near', duration: 11 },
      { id: 'dumbo-b', name: 'DUMBO OCTOPUS', jp: 'ジュウモンジダコの仲間', depth: 'DEEP SEAFLOOR', image: '/ocean/creatures/dumbo-octopus-art.svg', note: '耳のようなひれを動かし、海底の少し上をふわりと漂う。', x: 76, y: 22, size: 16, layer: 'far', flip: true, duration: 13 },
      { id: 'deepstaria-a', name: 'DEEPSTARIA', jp: 'ディープスタリア', depth: 'ABYSSAL WATER', image: '/ocean/creatures/deepstaria-art.svg', note: '薄い袋のような体を広げて漂う、半透明の深海クラゲ。', x: 69, y: 51, size: 38, layer: 'mid', flip: true, duration: 15 },
      { id: 'isopod-a', name: 'GIANT ISOPOD', jp: 'ダイオウグソクムシ', depth: 'SEAFLOOR', image: '/ocean/creatures/isopod-art.svg', note: '高い水圧の海底を歩く大型の等脚類。硬い外殻を持つ。', x: 24, y: 80, size: 28, layer: 'near', duration: 8 },
      { id: 'gulper-b', name: 'GULPER EEL', jp: 'フクロウナギ', depth: 'ABYSSAL WATER', image: '/ocean/creatures/production/gulper-eel.svg', note: '大きく開く口と細長い尾を持ち、暗い海をゆっくり泳ぐ。', x: 72, y: 79, size: 25, layer: 'far', duration: 12 }
    ]
  },
  {
    id: 'hadal',
    name: 'HADAL ZONE',
    jp: '超深海帯',
    range: '6,000–10,900m',
    depth: '8,200m',
    background: '/ocean/backgrounds/hadal-production.svg',
    accent: '#c084ff',
    creatures: [
      { id: 'snail-a', name: 'HADAL SNAILFISH', jp: '超深海のクサウオ類', depth: 'HADAL WATER', image: '/ocean/creatures/snailfish-art.svg', note: '柔らかな体で超深海の高い水圧に適応した魚。', x: 20, y: 31, size: 22, layer: 'mid', duration: 9 },
      { id: 'snail-b', name: 'HADAL SNAILFISH', jp: '超深海のクサウオ類', depth: 'HADAL WATER', image: '/ocean/creatures/snailfish-art.svg', note: '柔らかな体で超深海の高い水圧に適応した魚。', x: 73, y: 27, size: 16, layer: 'far', flip: true, duration: 11 },
      { id: 'snail-c', name: 'HADAL SNAILFISH', jp: '超深海のクサウオ類', depth: 'HADAL WATER', image: '/ocean/creatures/snailfish-art.svg', note: '柔らかな体で超深海の高い水圧に適応した魚。', x: 38, y: 61, size: 18, layer: 'mid', duration: 10 },
      { id: 'hitogata-a', name: 'HITOGATA', jp: 'ヒトガタ', depth: 'UNCONFIRMED', image: '/ocean/creatures/hitogata-art.svg', note: '深い海で語られる白い人型の未確認存在。事実ではなく伝承として表示している。', x: 76, y: 65, size: 31, layer: 'far', flip: true, duration: 14, mystery: true },
      { id: 'kraken-a', name: 'KRAKEN', jp: 'クラーケン', depth: 'LEGEND', image: '/ocean/creatures/kraken-art.svg', note: '巨大な触手で船を沈めると語られてきた伝説上の怪物。', x: 16, y: 83, size: 82, layer: 'silhouette', duration: 26, mystery: true },
      { id: 'shadow-a', name: 'THE UNKNOWN', jp: '未知の影', depth: '10,900m', image: '/ocean/creatures/hadal-shadow-art.svg', note: '観測できる範囲が極端に狭い世界。暗闇の向こうに何がいるかは分からない。', x: 72, y: 88, size: 42, layer: 'far', duration: 18, mystery: true }
    ]
  }
];

function SafeImage({ src, className = '', alt = '' }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <img src={src} className={className} alt={alt} draggable="false" onError={() => setFailed(true)} />;
}

function Creature({ creature, zone, index, onSelect }) {
  const decorative = creature.layer === 'silhouette';
  return (
    <button
      type="button"
      className={`creature creature-${creature.layer} ${creature.mystery ? 'is-mystery' : ''}`}
      style={{
        '--x': `${creature.x}%`,
        '--y': `${creature.y}%`,
        '--size': `${creature.size}%`,
        '--delay': `${-index * 1.37}s`,
        '--duration': `${creature.duration || 10}s`,
        '--flip': creature.flip ? -1 : 1,
        '--accent': zone.accent
      }}
      onClick={() => !decorative && onSelect({ ...creature, zone: zone.name, accent: zone.accent })}
      aria-label={decorative ? undefined : `${creature.jp}の詳細を開く`}
      tabIndex={decorative ? -1 : 0}
    >
      {!decorative && <span className="target-ring" />}
      <SafeImage src={creature.image} />
    </button>
  );
}

export default function OceanLabV2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveIndex(Number(visible.target.dataset.zoneIndex));
    }, { threshold: [0.25, 0.5, 0.72] });
    refs.current.forEach((node) => node && observer.observe(node));

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  const active = zones[activeIndex];

  return (
    <main className="ocean-v2">
      <header className="hud">
        <a href="/ocean" className="brand">SWIPE EARTH <span>/ OCEAN</span></a>
        <div className="active-zone"><small>{active.jp}</small><strong>{active.name}</strong></div>
        <div className="depth"><small>DEPTH</small><strong>{active.depth}</strong><span>{active.range}</span></div>
      </header>

      <aside className="depth-rail" aria-label="深度ナビゲーション">
        <div className="rail-line"><i style={{ height: `${progress * 100}%` }} /></div>
        {zones.map((zone, index) => (
          <button key={zone.id} className={index === activeIndex ? 'active' : ''} onClick={() => refs.current[index]?.scrollIntoView({ behavior: 'smooth' })} aria-label={`${zone.jp}へ移動`}>
            <span>{zone.range}</span><b />
          </button>
        ))}
      </aside>

      {zones.map((zone, zoneIndex) => (
        <section
          key={zone.id}
          id={zone.id}
          data-zone-index={zoneIndex}
          ref={(node) => { refs.current[zoneIndex] = node; }}
          className={`zone zone-${zone.id}`}
        >
          <SafeImage className="zone-bg" src={zone.background} />
          <SafeImage className="particles particles-a" src="/ocean/ocean-particles.svg" />
          <SafeImage className="particles particles-b" src="/ocean/ocean-particles.svg" />
          <div className="zone-vignette" />
          <div className="zone-title" style={{ '--accent': zone.accent }}>
            <small>{String(zoneIndex + 1).padStart(2, '0')} / {String(zones.length).padStart(2, '0')} · {zone.range}</small>
            <h1>{zone.name}</h1>
            <p>{zone.jp}</p>
          </div>
          <div className="creature-field">
            {zone.creatures.map((creature, index) => <Creature key={creature.id} creature={creature} zone={zone} index={index} onSelect={setSelected} />)}
          </div>
          {zoneIndex === 0 && <div className="dive-guide">下へスワイプして潜る <span>↓</span></div>}
          {zoneIndex === zones.length - 1 && <div className="deepest"><small>THE DEEPEST POINT</small><strong>10,900m</strong><span>それでも海のすべてを知ったわけではない。</span></div>}
        </section>
      ))}

      {selected && (
        <section className={`detail-card ${selected.mystery ? 'mystery' : ''}`} style={{ '--accent': selected.accent }} aria-live="polite">
          <div className="detail-thumb"><SafeImage src={selected.image} /></div>
          <div className="detail-copy">
            <div className="detail-topline"><span>{selected.mystery ? 'LEGEND / UNCONFIRMED' : selected.zone}</span><b>{selected.depth}</b></div>
            <h2>{selected.name}</h2><h3>{selected.jp}</h3><p>{selected.note}</p>
          </div>
          <button type="button" onClick={() => setSelected(null)} aria-label="詳細を閉じる">×</button>
        </section>
      )}

      <style jsx global>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth;background:#01040a}body{margin:0;background:#01040a;color:#f5fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button{font:inherit}.ocean-v2{position:relative;overflow:clip;background:#01040a}
        .hud{position:fixed;z-index:100;top:0;left:50%;width:min(100%,560px);transform:translateX(-50%);display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:start;padding:16px 17px 36px;background:linear-gradient(180deg,rgba(1,5,14,.95),rgba(1,5,14,.46) 62%,transparent);pointer-events:none}.brand{pointer-events:auto;color:#fff;text-decoration:none;font-size:10px;letter-spacing:.15em;font-weight:850}.brand span{color:#7edfff}.active-zone,.depth{text-align:right}.active-zone small,.depth small{display:block;font-size:7px;letter-spacing:.14em;opacity:.5}.active-zone strong{font-size:9px;letter-spacing:.08em}.depth strong{display:block;font-size:22px;line-height:1}.depth span{font-size:7px;opacity:.54}
        .depth-rail{position:fixed;z-index:95;right:max(12px,calc((100vw - 560px)/2 + 12px));top:112px;bottom:30px;width:48px;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;pointer-events:none}.rail-line{position:absolute;right:3px;top:8px;bottom:8px;width:1px;background:rgba(210,234,255,.18)}.rail-line i{display:block;width:1px;background:#9bdfff;box-shadow:0 0 10px #71cfff;transition:height .15s}.depth-rail button{position:relative;border:0;background:none;color:#fff;padding:0 0 0 4px;display:flex;gap:6px;align-items:center;pointer-events:auto;opacity:.42;cursor:pointer}.depth-rail button.active{opacity:1}.depth-rail button span{font-size:7px;letter-spacing:.05em}.depth-rail button b{width:7px;height:7px;border:1px solid currentColor;border-radius:50%;background:#07101f}.depth-rail button.active b{background:#9bdfff;box-shadow:0 0 13px #72cfff}
        .zone{position:relative;width:min(100%,560px);min-height:108svh;margin:0 auto;overflow:hidden;isolation:isolate}.zone-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.particles{position:absolute;inset:-8%;width:116%;height:116%;object-fit:cover;mix-blend-mode:screen;opacity:.19;animation:particles 27s linear infinite}.particles-b{opacity:.08;transform:scaleX(-1);animation-duration:39s;animation-direction:reverse}.zone-vignette{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,rgba(0,4,12,.36),transparent 22%,transparent 74%,rgba(0,2,8,.72)),radial-gradient(circle at center,transparent 35%,rgba(0,2,8,.35))}.zone-title{position:absolute;z-index:14;top:105px;left:20px;pointer-events:none;text-shadow:0 3px 18px rgba(0,0,0,.52)}.zone-title small{font-size:7px;letter-spacing:.16em;color:var(--accent)}.zone-title h1{margin:6px 0 0;font-size:24px;line-height:1;letter-spacing:.03em}.zone-title p{margin:6px 0 0;font-size:11px;opacity:.64}.creature-field{position:absolute;z-index:7;inset:145px 0 55px}.creature{position:absolute;left:var(--x);top:var(--y);width:var(--size);min-width:46px;min-height:46px;aspect-ratio:1.25;border:0;padding:0;background:transparent;cursor:pointer;transform:translate(-50%,-50%) scaleX(var(--flip));filter:drop-shadow(0 12px 18px rgba(0,0,0,.42));animation:float var(--duration) ease-in-out var(--delay) infinite;transition:filter .2s,opacity .2s}.creature img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}.creature-far{opacity:.48;filter:blur(.35px) drop-shadow(0 8px 13px rgba(0,0,0,.38))}.creature-mid{opacity:.8}.creature-near{z-index:3}.creature-silhouette{opacity:.13;filter:brightness(.35) saturate(.4) blur(1.8px);pointer-events:none;animation:pass var(--duration) ease-in-out var(--delay) infinite}.creature.is-mystery:not(.creature-silhouette){opacity:.5}.target-ring{position:absolute;left:50%;top:50%;width:68%;aspect-ratio:1;border:1px solid color-mix(in srgb,var(--accent) 65%,transparent);border-radius:50%;transform:translate(-50%,-50%) scaleX(var(--flip));opacity:0;box-shadow:0 0 18px color-mix(in srgb,var(--accent) 32%,transparent);transition:.2s}.creature:hover .target-ring,.creature:focus-visible .target-ring{opacity:1;transform:translate(-50%,-50%) scaleX(var(--flip)) scale(1.12)}.creature:focus-visible{outline:2px solid var(--accent);outline-offset:4px}.dive-guide{position:absolute;z-index:20;left:50%;bottom:24px;transform:translateX(-50%);font-size:9px;letter-spacing:.12em;color:rgba(255,255,255,.66);animation:pulse 2s ease-in-out infinite}.dive-guide span{display:inline-block;margin-left:7px;color:#9cecff}.deepest{position:absolute;z-index:16;left:20px;right:55px;bottom:30px;padding-top:16px;border-top:1px solid rgba(255,255,255,.15)}.deepest small{display:block;font-size:7px;letter-spacing:.18em;color:#bc8cff}.deepest strong{display:block;font-size:28px}.deepest span{display:block;margin-top:6px;font-size:10px;opacity:.58}
        .detail-card{position:fixed;z-index:130;left:50%;bottom:12px;transform:translateX(-50%);width:min(calc(100% - 24px),536px);min-height:164px;display:grid;grid-template-columns:82px 1fr 30px;gap:12px;align-items:start;padding:15px;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);border-radius:22px;background:linear-gradient(145deg,rgba(7,16,40,.96),rgba(18,11,48,.95));box-shadow:0 24px 70px rgba(0,0,0,.58),inset 0 1px rgba(255,255,255,.07);backdrop-filter:blur(20px);animation:cardIn .22s ease-out}.detail-card.mystery{background:linear-gradient(145deg,rgba(18,8,28,.97),rgba(3,5,15,.97))}.detail-thumb{width:82px;height:82px;display:grid;place-items:center;border-radius:18px;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 34%,#141a3e),#0b1025 72%);overflow:hidden}.detail-thumb img{width:88%;height:88%;object-fit:contain}.detail-topline{display:flex;justify-content:space-between;gap:8px}.detail-topline span{font-size:7px;letter-spacing:.12em;color:var(--accent)}.detail-topline b{font-size:8px;color:#8ddfff}.detail-copy h2{margin:7px 0 0;font-size:19px;line-height:1}.detail-copy h3{margin:4px 0 0;font-size:11px;color:#cbd9e8}.detail-copy p{margin:9px 0 0;font-size:10px;line-height:1.55;color:rgba(231,242,255,.72)}.detail-card>button{width:30px;height:30px;border:1px solid rgba(255,255,255,.15);border-radius:50%;background:rgba(255,255,255,.06);color:#fff;font-size:18px;cursor:pointer}
        @keyframes float{0%,100%{translate:0 0;rotate:-1deg}50%{translate:9px -12px;rotate:2deg}}@keyframes pass{0%,100%{translate:-18% 0;scale:.94}50%{translate:23% 4%;scale:1.05}}@keyframes particles{from{translate:0 0}to{translate:-4% 7%}}@keyframes pulse{0%,100%{opacity:.45;translate:0 0}50%{opacity:1;translate:0 5px}}@keyframes cardIn{from{opacity:0;translate:0 14px}to{opacity:1;translate:0 0}}
        @media(max-width:420px){.hud{grid-template-columns:1fr auto}.active-zone{display:none}.zone-title h1{font-size:21px}.detail-card{grid-template-columns:70px 1fr 28px}.detail-thumb{width:70px;height:70px}.detail-copy p{font-size:9px}.depth-rail{right:8px}}
        @media(prefers-reduced-motion:reduce){.creature,.particles,.dive-guide{animation:none!important}html{scroll-behavior:auto}.detail-card{animation:none}}
      `}</style>
    </main>
  );
}
