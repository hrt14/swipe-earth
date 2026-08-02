'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const layers = [
  {
    depth: 100,
    depthLabel: '0–200 m',
    zone: 'SUNLIGHT ZONE',
    zoneJp: '表層',
    bg: 7,
    creatures: [
      { name: 'SEA TURTLE', jp: 'アオウミガメ', image: 'turtle-art.svg', note: '太陽光がたっぷり届く海。呼吸のために水面へ上がりながら、ゆっくり海を渡っていく。' },
      { name: 'MANTA RAY', jp: 'オニイトマキエイ', image: 'manta-art.svg', note: '大きな翼のような胸びれを広げ、青い水の中を静かに滑空する。' },
      { name: 'BLUE WHALE', jp: 'シロナガスクジラ', image: 'whale-art.svg', giant: true, note: '地球上で最大の動物。巨大な体が通り過ぎるだけで、海そのものが動いたように見える。' },
      { name: 'REEF SHARK', jp: 'メジロザメ', image: 'reef-shark-art.svg', note: '浅い海を巡回する流線形のハンター。無駄のない動きで、岩礁の間を泳ぎ抜ける。' }
    ]
  },
  {
    depth: 500,
    depthLabel: '200–1,000 m',
    zone: 'TWILIGHT ZONE',
    zoneJp: '薄明帯',
    bg: 28,
    creatures: [
      { name: 'GIANT SQUID', jp: 'ダイオウイカ', image: 'giant-squid-art.svg', giant: true, note: '光が急速に弱くなる世界。巨大な眼で、わずかな光と動きを捉える。' },
      { name: 'BARRELEYE', jp: 'デメニギス', image: 'barreleye-art.svg', note: '透明な頭部の内側に、緑色の筒状の眼を持つ。上方のかすかな影を探し続ける。' }
    ]
  },
  {
    depth: 1400,
    depthLabel: '1,000–2,000 m',
    zone: 'MIDNIGHT ZONE',
    zoneJp: '漸深海帯',
    bg: 47,
    creatures: [
      { name: 'ANGLERFISH', jp: 'チョウチンアンコウ', image: 'anglerfish-art.svg', note: '太陽光は届かない。自ら発する小さな光が、暗黒の海で獲物を誘う。' },
      { name: 'VAMPIRE SQUID', jp: 'コウモリダコ', image: 'vampire-squid-art.svg', note: '酸素の少ない暗い海に適応した、不思議な深海生物。赤い膜を広げて身を守る。' },
      { name: 'GULPER EEL', jp: 'フクロウナギ', image: 'gulper-eel-art.svg', note: '体に不釣り合いなほど大きな口を持つ。細長い尾の先には、小さな光が揺れる。' }
    ]
  },
  {
    depth: 3000,
    depthLabel: '2,000–4,000 m',
    zone: 'DEEP SEA',
    zoneJp: '深海帯',
    bg: 63,
    creatures: [
      { name: 'GIANT ISOPOD', jp: 'ダイオウグソクムシ', image: 'isopod-art.svg', note: '高い水圧の海底を歩く巨大な等脚類。硬い外殻で、静かな深海を生き延びる。' },
      { name: 'DUMBO OCTOPUS', jp: 'メンダコの仲間', image: 'dumbo-octopus-art.svg', note: '耳のようなひれを羽ばたかせ、海底の少し上をふわりと漂う。' }
    ]
  },
  {
    depth: 5000,
    depthLabel: '4,000–6,000 m',
    zone: 'ABYSS',
    zoneJp: '深海底帯',
    bg: 76,
    creatures: [
      { name: 'DEEPSTARIA', jp: 'ディープスタリア', image: 'deepstaria-art.svg', note: '薄い袋のような体を広げて漂う深海クラゲ。暗闇の中で、半透明の膜だけが浮かび上がる。' },
      { name: 'HITOGATA', jp: 'ヒトガタ', image: 'hitogata-art.svg', mystery: true, note: '南極海などで語られる白い人型の未確認存在。ここから先は、事実と伝承の境界が曖昧になる。' }
    ]
  },
  {
    depth: 8000,
    depthLabel: '6,000–10,000 m',
    zone: 'HADAL ZONE',
    zoneJp: '超深海帯',
    bg: 90,
    creatures: [
      { name: 'HADAL SNAILFISH', jp: 'シンカイクサウオ', image: 'snailfish-art.svg', note: '柔らかな体で超深海に適応した魚。強大な水圧の中を、ゆっくり泳ぎ続ける。' },
      { name: 'KRAKEN', jp: 'クラーケン', image: 'kraken-art.svg', mystery: true, giant: true, note: '巨大な触手で船を沈めると語られてきた伝説の怪物。確認された生物ではない。' },
      { name: 'HADAL SHADOW', jp: '超深海の影', image: 'hadal-shadow-art.svg', mystery: true, note: '観測できる範囲は急激に狭くなる。暗闇の向こうで動くものが何なのか、まだ分からない。' }
    ]
  },
  {
    depth: 10900,
    depthLabel: '10,900 m',
    zone: 'THE DEEPEST POINT',
    zoneJp: '最深部',
    bg: 100,
    creatures: [
      { name: 'THE UNKNOWN', jp: '未知', image: 'unknown-art.svg', mystery: true, note: '人類は最深部まで到達した。それでも、海のすべてを知ったわけではない。' }
    ]
  }
];

function SafeImage({ src, alt, className, loading = 'lazy', style }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={`${className} image-fallback`} role="img" aria-label={`${alt}の画像を読み込めませんでした`}>IMAGE ERROR</div>;
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      style={style}
      onError={() => {
        console.error('[SWIPE EARTH image error]', src);
        setFailed(true);
      }}
    />
  );
}

function LayerScene({ layer, layerIndex, isActive, currentIndex, onChange }) {
  const trackRef = useRef(null);
  const current = layer.creatures[currentIndex] || layer.creatures[0];
  const hasMultiple = layer.creatures.length > 1;

  const moveTo = (nextIndex) => {
    const clamped = Math.max(0, Math.min(layer.creatures.length - 1, nextIndex));
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * clamped, behavior: 'smooth' });
    onChange(clamped);
  };

  const handleScroll = (event) => {
    const track = event.currentTarget;
    if (!track.clientWidth) return;
    const next = Math.max(0, Math.min(layer.creatures.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    if (next !== currentIndex) onChange(next);
  };

  return (
    <article
      data-layer-index={layerIndex}
      className={`layer-scene ${isActive ? 'is-active' : ''} ${current.mystery ? 'mystery' : ''}`}
    >
      <SafeImage className="scene-bg" src="/ocean/ocean-depth-art.svg" alt="" style={{ objectPosition: `center ${layer.bg}%` }} />
      <SafeImage className="particles" src="/ocean/ocean-particles.svg" alt="" />

      <div className="layer-heading">
        <div><small>{layer.zoneJp}</small><strong>{layer.zone}</strong></div>
        <span>{layer.depthLabel}</span>
      </div>

      <div
        ref={trackRef}
        className="carousel-track"
        onScroll={handleScroll}
        aria-label={`${layer.zoneJp}の生き物`}
      >
        {layer.creatures.map((creature, creatureIndex) => {
          const reverse = (layerIndex + creatureIndex) % 2 === 1;
          const isCurrent = creatureIndex === currentIndex;
          return (
            <section
              key={creature.name}
              className={`creature-slide ${reverse ? 'reverse' : ''} ${creature.mystery ? 'legend' : ''} ${creature.giant ? 'giant' : ''} ${isCurrent ? 'is-current' : ''}`}
              aria-hidden={!isCurrent}
            >
              <div className="slide-inner">
                <div className="art">
                  <SafeImage
                    className="creature-art"
                    src={`/ocean/creatures/${creature.image}`}
                    alt={creature.jp}
                    loading={layerIndex < 2 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="copy">
                  <div className="eyebrow">{creature.mystery ? 'UNCONFIRMED / LEGEND' : 'ENCOUNTER'}</div>
                  <h2>{creature.name}</h2>
                  <h3>{creature.jp}</h3>
                  <div className="line" />
                  <p className="note">{creature.note}</p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {hasMultiple && (
        <div className="carousel-ui">
          <button type="button" onClick={() => moveTo(currentIndex - 1)} disabled={currentIndex === 0} aria-label="前の生き物">←</button>
          <div className="dots" aria-label={`${currentIndex + 1} / ${layer.creatures.length}`}>
            {layer.creatures.map((creature, index) => (
              <button
                key={creature.name}
                type="button"
                className={index === currentIndex ? 'active' : ''}
                onClick={() => moveTo(index)}
                aria-label={`${creature.jp}を表示`}
              />
            ))}
          </div>
          <span>横にスワイプ</span>
          <button type="button" onClick={() => moveTo(currentIndex + 1)} disabled={currentIndex === layer.creatures.length - 1} aria-label="次の生き物">→</button>
        </div>
      )}

      <div className="layer-index">{String(layerIndex + 1).padStart(2, '0')} / {String(layers.length).padStart(2, '0')}</div>
    </article>
  );
}

export default function Ocean() {
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [slideIndexes, setSlideIndexes] = useState(() => layers.map(() => 0));
  const [scrollProgress, setScrollProgress] = useState(0);
  const observerRef = useRef(null);

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll('[data-layer-index]'));
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveLayerIndex(Number(visible.target.dataset.layerIndex));
      },
      { threshold: [0.35, 0.55, 0.72] }
    );
    scenes.forEach((scene) => observerRef.current.observe(scene));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const activeLayer = layers[activeLayerIndex];
  const activeSlideIndex = slideIndexes[activeLayerIndex] || 0;
  const activeCreature = activeLayer.creatures[activeSlideIndex] || activeLayer.creatures[0];
  const pressure = Math.max(1, activeLayer.depth / 10).toFixed(0);
  const temp = Math.max(1.2, 24 - activeLayer.depth / 520).toFixed(1);

  const updateSlideIndex = (layerIndex, slideIndex) => {
    setSlideIndexes((current) => {
      if (current[layerIndex] === slideIndex) return current;
      const next = [...current];
      next[layerIndex] = slideIndex;
      return next;
    });
  };

  return (
    <main className="ocean-swipe">
      <style jsx global>{`
        *{box-sizing:border-box}
        html{scroll-behavior:smooth;background:#010611}
        body{margin:0;background:#010611;color:#f5fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        button{font:inherit}
        .ocean-swipe{overflow:hidden;background:#010611}
        .hud{position:fixed;z-index:90;left:0;right:0;top:0;display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:start;padding:18px 22px 42px;background:linear-gradient(180deg,rgba(1,6,17,.94),rgba(1,6,17,.58) 58%,transparent);pointer-events:none}
        .hud a{pointer-events:auto;color:#fff;text-decoration:none;font-size:12px;letter-spacing:.18em;font-weight:800}
        .hud a span{opacity:.48;font-weight:500}
        .meta,.readout{text-align:right}
        .meta small,.readout small{display:block;font-size:8px;letter-spacing:.16em;opacity:.52}
        .meta strong{font-size:11px;letter-spacing:.13em}
        .readout strong{display:block;font-size:23px;line-height:1.08;font-variant-numeric:tabular-nums}
        .bar{width:126px;height:3px;margin-top:8px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden}
        .bar i{display:block;height:100%;background:#8ceeff;box-shadow:0 0 18px rgba(140,238,255,.9)}
        .nearest{position:fixed;z-index:89;left:18px;bottom:18px;min-width:180px;max-width:72vw;padding:11px 16px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(0,8,18,.76);backdrop-filter:blur(14px);box-shadow:0 12px 34px rgba(0,0,0,.24);pointer-events:none}
        .nearest small{display:block;font-size:7px;letter-spacing:.18em;opacity:.48}
        .nearest strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;letter-spacing:.11em}
        .hero{min-height:100svh;position:relative;display:grid;place-items:center;overflow:hidden;background:#097ea8}
        .hero-bg,.scene-bg,.particles{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
        .hero-bg,.scene-bg{object-fit:cover}
        .hero-bg{object-position:center top;transform:scale(1.02)}
        .hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,45,76,.04),rgba(0,11,27,.18) 45%,rgba(0,4,13,.52))}
        .hero-copy{position:relative;z-index:3;text-align:center;padding:90px 22px 40px;text-shadow:0 10px 40px rgba(0,19,42,.72)}
        .hero-copy p{font-size:11px;letter-spacing:.3em;font-weight:800}
        .hero-copy h1{margin:18px 0 16px;font-size:clamp(58px,11vw,138px);line-height:.88;letter-spacing:-.075em}
        .hero-copy span{font-size:9px;letter-spacing:.22em;opacity:.82}
        .hero-copy b{display:block;margin-top:18px;font-size:34px;animation:dive 1.5s ease-in-out infinite}
        @keyframes dive{50%{transform:translateY(10px)}}
        .journey{position:relative}
        .layer-scene{position:relative;min-height:112svh;display:grid;align-items:center;isolation:isolate;overflow:hidden;padding:112px 0 92px;border-top:1px solid rgba(255,255,255,.08);transition:background .5s ease}
        .layer-scene:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(0,5,15,.3),rgba(0,5,15,.03) 44%,rgba(0,5,15,.34)),linear-gradient(180deg,rgba(1,7,18,.04),rgba(1,5,14,.3));transition:background .5s ease}
        .layer-scene.mystery:before{background:linear-gradient(90deg,rgba(0,2,8,.62),rgba(0,4,12,.16) 45%,rgba(0,2,8,.7)),linear-gradient(180deg,rgba(1,4,10,.12),rgba(0,1,6,.62))}
        .scene-bg{z-index:-3;object-fit:cover;transform:scale(1.06)}
        .particles{z-index:-2;object-fit:cover;opacity:.72;animation:drift 14s ease-in-out infinite alternate}
        @keyframes drift{to{transform:translate3d(-1.8%,1.3%,0) scale(1.04)}}
        .layer-heading{position:absolute;z-index:8;top:94px;left:6vw;right:6vw;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;pointer-events:none}
        .layer-heading small{display:block;font-size:8px;letter-spacing:.18em;opacity:.5}
        .layer-heading strong{display:block;margin-top:3px;font-size:12px;letter-spacing:.18em}
        .layer-heading span{font-size:11px;letter-spacing:.15em;opacity:.55}
        .carousel-track{position:relative;z-index:3;display:flex;width:100%;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-behavior:smooth;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y;scrollbar-width:none}
        .carousel-track::-webkit-scrollbar{display:none}
        .creature-slide{flex:0 0 100%;width:100%;min-width:100%;scroll-snap-align:start;scroll-snap-stop:always;padding:34px 6vw 18px}
        .slide-inner{width:min(1180px,100%);min-height:70svh;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.14fr) minmax(310px,.86fr);align-items:center;gap:clamp(34px,7vw,96px)}
        .creature-slide.reverse .art{order:2}
        .creature-slide.reverse .copy{text-align:right;justify-self:end}
        .art{position:relative;min-height:520px;display:grid;place-items:center}
        .art:after{content:"";position:absolute;z-index:-1;width:88%;height:72%;border-radius:50%;background:radial-gradient(ellipse,rgba(93,214,255,.24),rgba(30,126,176,.08) 46%,transparent 72%);filter:blur(22px)}
        .legend .art:after{background:radial-gradient(ellipse,rgba(170,218,255,.16),rgba(62,101,150,.06) 44%,transparent 72%)}
        .creature-art{display:block;width:100%;max-width:760px;max-height:590px;object-fit:contain;filter:drop-shadow(0 30px 34px rgba(0,0,0,.68));transform:translateY(20px) scale(.88);opacity:.42;transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .8s ease}
        .layer-scene.is-active .creature-slide.is-current .creature-art{transform:translateY(0) scale(1);opacity:1}
        .creature-slide.giant .creature-art{max-width:860px}
        .copy{position:relative;z-index:4;max-width:450px;padding:28px 0}
        .copy .eyebrow{font-size:9px;letter-spacing:.24em;opacity:.64}
        .copy h2{margin:8px 0 0;font-size:clamp(42px,5.7vw,78px);line-height:.88;letter-spacing:-.06em}
        .copy h3{margin:11px 0 0;font-size:17px;font-weight:500;opacity:.72}
        .copy .line{width:44px;height:1px;margin:22px 0;background:rgba(255,255,255,.46)}
        .reverse .copy .line{margin-left:auto}
        .copy .note{margin:0;font-size:14px;line-height:1.95;opacity:.76}
        .legend .copy h2{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.045em}
        .carousel-ui{position:absolute;z-index:12;left:50%;bottom:28px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;padding:7px 10px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(0,7,16,.58);backdrop-filter:blur(12px)}
        .carousel-ui>button{width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:#fff;cursor:pointer}
        .carousel-ui>button:disabled{opacity:.22;cursor:default}
        .carousel-ui>span{font-size:8px;letter-spacing:.16em;white-space:nowrap;opacity:.5}
        .dots{display:flex;align-items:center;gap:7px}
        .dots button{width:7px;height:7px;padding:0;border:0;border-radius:99px;background:rgba(255,255,255,.28);cursor:pointer;transition:width .25s ease,background .25s ease}
        .dots button.active{width:22px;background:#a9efff;box-shadow:0 0 12px rgba(169,239,255,.65)}
        .layer-index{position:absolute;right:28px;bottom:31px;font-size:9px;letter-spacing:.2em;opacity:.28}
        .end{min-height:100svh;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px 24px;overflow:hidden;background:#01040a}
        .end:after{content:"";position:absolute;inset:0;background:rgba(0,2,8,.62)}
        .end>*:not(.scene-bg){position:relative;z-index:2}
        .end p{font-size:9px;letter-spacing:.24em;opacity:.56}
        .end h2{font-size:clamp(46px,8vw,96px);line-height:.92;letter-spacing:-.06em;margin:14px 0 30px}
        .end a{color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:14px 22px;font-size:9px;letter-spacing:.16em}
        .image-fallback{display:grid;place-items:center;border:1px solid rgba(255,100,100,.54);color:#ff9f9f;font-size:11px;letter-spacing:.18em}
        @media(max-width:760px){
          .hud{grid-template-columns:1fr auto;padding:14px 16px 36px;gap:10px}
          .meta{display:none}
          .hud a{font-size:10px;letter-spacing:.14em}
          .readout small{font-size:7px}
          .readout strong{font-size:20px}
          .bar{width:96px}
          .nearest{left:12px;bottom:12px;min-width:156px;padding:10px 14px}
          .hero-copy{padding-top:100px}
          .hero-copy h1{font-size:clamp(54px,17vw,84px)}
          .layer-scene{min-height:116svh;display:flex;align-items:center;padding:104px 0 96px}
          .layer-heading{top:80px;left:20px;right:20px}
          .layer-heading strong{font-size:10px}
          .layer-heading span{font-size:9px}
          .creature-slide{padding:20px 20px 26px}
          .slide-inner{display:flex;flex-direction:column;gap:14px;width:100%;min-height:calc(116svh - 225px)}
          .creature-slide.reverse .art{order:initial}
          .creature-slide.reverse .copy{text-align:left;align-self:stretch}
          .copy{width:100%;max-width:none;padding:0 4px 8px}
          .copy h2{font-size:clamp(40px,12.5vw,58px);max-width:94vw}
          .copy h3{font-size:15px}
          .copy .line,.reverse .copy .line{margin:16px 0}
          .copy .note{font-size:13px;line-height:1.72;max-width:100%}
          .art{width:100%;min-height:0;height:min(47svh,430px);margin-top:2px}
          .creature-art{width:100%;height:100%;max-width:none;max-height:none;transform:translateY(12px) scale(.84)}
          .layer-scene.is-active .creature-slide.is-current .creature-art{transform:translateY(0) scale(.98)}
          .carousel-ui{bottom:24px;gap:8px;padding:5px 8px}
          .carousel-ui>button{width:34px;height:34px}
          .carousel-ui>span{display:none}
          .layer-index{right:17px;bottom:35px}
        }
        @media(max-width:390px){
          .layer-scene{min-height:120svh}
          .creature-slide{padding-left:16px;padding-right:16px}
          .slide-inner{min-height:calc(120svh - 225px)}
          .art{height:42svh}
          .copy h2{font-size:clamp(37px,11.8vw,50px)}
        }
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.hero-copy b,.particles{animation:none}.creature-art{transition:none}.carousel-track{scroll-behavior:auto}}
      `}</style>

      <div className="hud">
        <a href="/">SWIPE EARTH <span>/ OCEAN</span></a>
        <div className="meta"><small>{activeLayer.zoneJp}</small><strong>{activeLayer.zone}</strong></div>
        <div className="readout">
          <small>{temp}°C · {pressure} ATM</small>
          <strong>{activeLayer.depthLabel}</strong>
          <div className="bar"><i style={{ width: `${scrollProgress * 100}%` }} /></div>
        </div>
      </div>

      <div className="nearest"><small>NEAREST LIFE</small><strong>{activeCreature.name}</strong></div>

      <section className="hero">
        <SafeImage className="hero-bg" src="/ocean/ocean-depth-art.svg" alt="海面から深海へ続く海" loading="eager" />
        <SafeImage className="particles" src="/ocean/ocean-particles.svg" alt="" loading="eager" />
        <div className="hero-copy">
          <p>SWIPE EARTH: OCEAN</p>
          <h1>海面から、<br />地球の底へ。</h1>
          <span>下へ潜る・横へ生き物を見る</span>
          <b>↓</b>
        </div>
      </section>

      <section className="journey">
        {layers.map((layer, layerIndex) => (
          <LayerScene
            key={layer.zone}
            layer={layer}
            layerIndex={layerIndex}
            isActive={activeLayerIndex === layerIndex}
            currentIndex={slideIndexes[layerIndex] || 0}
            onChange={(slideIndex) => updateSlideIndex(layerIndex, slideIndex)}
          />
        ))}
      </section>

      <section className="end">
        <SafeImage className="scene-bg" src="/ocean/ocean-depth-art.svg" alt="深海の底" style={{ objectPosition: 'center bottom' }} />
        <p>THE DEEPEST POINT</p>
        <h2>ここから先は、<br />まだ誰も知らない。</h2>
        <a href="/">WORLD SELECTへ戻る</a>
      </section>
    </main>
  );
}
