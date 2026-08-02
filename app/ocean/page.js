'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const encounters = [
  { depth: 15, name: 'SEA TURTLE', jp: 'アオウミガメ', image: 'turtle-art.svg', note: 'まだ太陽の光が強い。海面近くでは、呼吸のために水面へ上がるウミガメに出会う。', bg: 4 },
  { depth: 60, name: 'MANTA RAY', jp: 'オニイトマキエイ', image: 'manta-art.svg', note: '大きな翼のような胸びれで、青い水の中をゆっくり滑空する。', bg: 10 },
  { depth: 120, name: 'BLUE WHALE', jp: 'シロナガスクジラ', image: 'whale-art.svg', giant: true, note: '地球上で最大の動物。体長は30m近くに達することもある。', bg: 18 },
  { depth: 250, name: 'GIANT SQUID', jp: 'ダイオウイカ', image: 'giant-squid-art.svg', note: '光が急速に弱くなる薄明帯。巨大な眼で、わずかな光を捉える。', bg: 28 },
  { depth: 600, name: 'ANGLERFISH', jp: 'チョウチンアンコウ', image: 'anglerfish-art.svg', note: '太陽光はほぼ届かない。自ら発する光が、この世界の目印になる。', bg: 40 },
  { depth: 1000, name: 'VAMPIRE SQUID', jp: 'コウモリダコ', image: 'vampire-squid-art.svg', note: '酸素の少ない暗黒の海に適応した、不思議な深海生物。', bg: 50 },
  { depth: 2200, name: 'GIANT ISOPOD', jp: 'ダイオウグソクムシ', image: 'isopod-art.svg', note: '水圧は地上とは比較にならない。海底を歩く巨大な等脚類。', bg: 61 },
  { depth: 4000, name: 'HITOGATA', jp: 'ヒトガタ', image: 'hitogata-art.svg', mystery: true, note: '南極海などで語られる白い人型の未確認存在。ここから先は、事実と伝承の境界が曖昧になる。', bg: 72 },
  { depth: 6000, name: 'KRAKEN', jp: 'クラーケン', image: 'kraken-art.svg', mystery: true, giant: true, note: '巨大な触手で船を沈めると語られてきた伝説の怪物。もちろん、確認された生物ではない。', bg: 82 },
  { depth: 8200, name: 'HADAL SHADOW', jp: '超深海の影', image: 'hadal-shadow-art.svg', mystery: true, note: '観測できる範囲は急激に狭くなる。暗闇の向こうに何がいるかは、まだ分からない。', bg: 91 },
  { depth: 10900, name: 'THE UNKNOWN', jp: '未知', image: 'unknown-art.svg', mystery: true, note: '地球の最深部。人類はここまで来た。それでも、海のすべてを知ったわけではない。', bg: 100 }
];

const zones = [
  { from: 0, to: 200, label: 'SUNLIGHT ZONE', jp: '表層' },
  { from: 200, to: 1000, label: 'TWILIGHT ZONE', jp: '薄明帯' },
  { from: 1000, to: 4000, label: 'MIDNIGHT ZONE', jp: '漸深海帯' },
  { from: 4000, to: 6000, label: 'ABYSS', jp: '深海底帯' },
  { from: 6000, to: 11000, label: 'HADAL ZONE', jp: '超深海帯' }
];

function getZone(depth) {
  return zones.find((zone) => depth >= zone.from && depth < zone.to) || zones[zones.length - 1];
}

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

export default function Ocean() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const observerRef = useRef(null);

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll('[data-encounter-index]'));
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveIndex(Number(visible.target.dataset.encounterIndex));
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

  const active = encounters[activeIndex];
  const zone = useMemo(() => getZone(active.depth), [active.depth]);
  const pressure = Math.max(1, active.depth / 10).toFixed(0);
  const temp = Math.max(1.2, 24 - active.depth / 520).toFixed(1);

  return (
    <main className="ocean-rebuild">
      <style jsx global>{`
        *{box-sizing:border-box}
        html{scroll-behavior:smooth;background:#010611}
        body{margin:0;background:#010611;color:#f5fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .ocean-rebuild{overflow:hidden;background:#010611}
        .hud{position:fixed;z-index:80;left:0;right:0;top:0;display:grid;grid-template-columns:1fr auto auto;gap:18px;align-items:start;padding:18px 22px 38px;background:linear-gradient(180deg,rgba(1,6,17,.92),rgba(1,6,17,.58) 55%,transparent);pointer-events:none}
        .hud a{pointer-events:auto;color:#fff;text-decoration:none;font-size:12px;letter-spacing:.18em;font-weight:800}
        .hud a span{opacity:.48;font-weight:500}
        .meta,.readout{text-align:right}
        .meta small,.readout small{display:block;font-size:8px;letter-spacing:.16em;opacity:.52}
        .meta strong{font-size:11px;letter-spacing:.13em}
        .readout strong{display:block;font-size:26px;line-height:1.05;font-variant-numeric:tabular-nums}
        .bar{width:126px;height:3px;margin-top:8px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden}
        .bar i{display:block;height:100%;background:#8ceeff;box-shadow:0 0 18px rgba(140,238,255,.9)}
        .nearest{position:fixed;z-index:79;left:18px;bottom:18px;min-width:180px;padding:11px 16px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(0,8,18,.72);backdrop-filter:blur(14px);box-shadow:0 12px 34px rgba(0,0,0,.24)}
        .nearest small{display:block;font-size:7px;letter-spacing:.18em;opacity:.48}
        .nearest strong{font-size:11px;letter-spacing:.11em}
        .hero{min-height:100svh;position:relative;display:grid;place-items:center;overflow:hidden;background:#097ea8}
        .hero-bg,.scene-bg,.particles{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
        .hero-bg,.scene-bg{object-fit:cover}
        .hero-bg{object-position:center top;transform:scale(1.02)}
        .hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,45,76,.04),rgba(0,11,27,.18) 45%,rgba(0,4,13,.52))}
        .hero-copy{position:relative;z-index:3;text-align:center;padding:90px 22px 40px;text-shadow:0 10px 40px rgba(0,19,42,.72)}
        .hero-copy p{font-size:11px;letter-spacing:.3em;font-weight:800}
        .hero-copy h1{margin:18px 0 16px;font-size:clamp(58px,11vw,138px);line-height:.88;letter-spacing:-.075em}
        .hero-copy span{font-size:9px;letter-spacing:.22em;opacity:.8}
        .hero-copy b{display:block;margin-top:18px;font-size:34px;animation:dive 1.5s ease-in-out infinite}
        @keyframes dive{50%{transform:translateY(10px)}}
        .journey{position:relative}
        .encounter-scene{position:relative;min-height:108svh;display:grid;place-items:center;isolation:isolate;overflow:hidden;padding:118px 6vw 96px;border-top:1px solid rgba(255,255,255,.08)}
        .encounter-scene:before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(0,5,15,.28),rgba(0,5,15,.04) 44%,rgba(0,5,15,.32)),linear-gradient(180deg,rgba(1,7,18,.04),rgba(1,5,14,.28))}
        .encounter-scene.mystery:before{background:linear-gradient(90deg,rgba(0,2,8,.56),rgba(0,4,12,.14) 45%,rgba(0,2,8,.65)),linear-gradient(180deg,rgba(1,4,10,.08),rgba(0,1,6,.55))}
        .scene-bg{z-index:-3;object-fit:cover;transform:scale(1.06)}
        .particles{z-index:-2;object-fit:cover;opacity:.72;animation:drift 14s ease-in-out infinite alternate}
        @keyframes drift{to{transform:translate3d(-1.8%,1.3%,0) scale(1.04)}}
        .scene-inner{width:min(1180px,100%);display:grid;grid-template-columns:minmax(0,1.14fr) minmax(310px,.86fr);align-items:center;gap:clamp(34px,7vw,96px)}
        .encounter-scene.reverse .art{order:2}
        .encounter-scene.reverse .copy{text-align:right;justify-self:end}
        .art{position:relative;min-height:520px;display:grid;place-items:center}
        .art:after{content:"";position:absolute;z-index:-1;width:88%;height:72%;border-radius:50%;background:radial-gradient(ellipse,rgba(93,214,255,.24),rgba(30,126,176,.08) 46%,transparent 72%);filter:blur(22px)}
        .mystery .art:after{background:radial-gradient(ellipse,rgba(170,218,255,.16),rgba(62,101,150,.06) 44%,transparent 72%)}
        .creature-art{display:block;width:100%;max-width:760px;max-height:590px;object-fit:contain;filter:drop-shadow(0 30px 34px rgba(0,0,0,.68));transform:translateY(18px) scale(.88);opacity:.35;transition:transform .9s cubic-bezier(.22,1,.36,1),opacity .8s ease}
        .encounter-scene.is-active .creature-art{transform:translateY(0) scale(1);opacity:1}
        .encounter-scene.giant .creature-art{max-width:860px}
        .copy{position:relative;z-index:4;max-width:450px;padding:28px 0}
        .copy .depth{font-size:11px;letter-spacing:.17em;opacity:.5}
        .copy .eyebrow{margin-top:22px;font-size:9px;letter-spacing:.24em;opacity:.64}
        .copy h2{margin:8px 0 0;font-size:clamp(42px,5.7vw,78px);line-height:.88;letter-spacing:-.06em}
        .copy h3{margin:11px 0 0;font-size:17px;font-weight:500;opacity:.72}
        .copy .line{width:44px;height:1px;margin:22px 0;background:rgba(255,255,255,.46)}
        .reverse .copy .line{margin-left:auto}
        .copy .note{margin:0;font-size:14px;line-height:1.95;opacity:.76}
        .mystery .copy h2{font-family:Georgia,"Times New Roman",serif;font-weight:500;letter-spacing:-.045em}
        .index{position:absolute;right:28px;bottom:24px;font-size:9px;letter-spacing:.2em;opacity:.28}
        .end{min-height:100svh;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px 24px;overflow:hidden;background:#01040a}
        .end:after{content:"";position:absolute;inset:0;background:rgba(0,2,8,.62)}
        .end>*:not(.scene-bg){position:relative;z-index:2}
        .end p{font-size:9px;letter-spacing:.24em;opacity:.56}
        .end h2{font-size:clamp(46px,8vw,96px);line-height:.92;letter-spacing:-.06em;margin:14px 0 30px}
        .end a{color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:14px 22px;font-size:9px;letter-spacing:.16em}
        .image-fallback{display:grid;place-items:center;border:1px solid rgba(255,100,100,.54);color:#ff9f9f;font-size:11px;letter-spacing:.18em}
        @media(max-width:760px){
          .hud{grid-template-columns:1fr auto;padding:14px 16px 34px;gap:10px}
          .meta{display:none}
          .hud a{font-size:10px;letter-spacing:.14em}
          .readout small{font-size:7px}
          .readout strong{font-size:23px}
          .bar{width:92px}
          .nearest{left:12px;bottom:12px;min-width:156px;padding:10px 14px}
          .hero-copy{padding-top:100px}
          .hero-copy h1{font-size:clamp(54px,17vw,84px)}
          .encounter-scene{min-height:112svh;display:flex;align-items:center;padding:96px 20px 100px}
          .scene-inner{display:flex;flex-direction:column;gap:18px;width:100%}
          .encounter-scene.reverse .art{order:initial}
          .encounter-scene.reverse .copy{text-align:left;align-self:stretch}
          .copy{width:100%;max-width:none;padding:0 4px 8px}
          .copy h2{font-size:clamp(42px,13vw,62px);max-width:94vw}
          .copy h3{font-size:15px}
          .copy .line,.reverse .copy .line{margin:17px 0}
          .copy .note{font-size:13px;line-height:1.75;max-width:92%}
          .art{width:100%;min-height:0;height:min(50svh,460px);margin-top:8px}
          .creature-art{width:100%;height:100%;max-width:none;max-height:none;transform:translateY(12px) scale(.84)}
          .encounter-scene.is-active .creature-art{transform:translateY(0) scale(.98)}
          .index{right:18px;bottom:72px}
        }
        @media(max-width:390px){
          .encounter-scene{min-height:118svh;padding-left:16px;padding-right:16px}
          .art{height:44svh}
          .copy h2{font-size:clamp(38px,12vw,52px)}
          .copy .note{max-width:100%}
        }
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.hero-copy b,.particles{animation:none}.creature-art{transition:none}}
      `}</style>

      <div className="hud">
        <a href="/">SWIPE EARTH <span>/ OCEAN</span></a>
        <div className="meta"><small>{zone.jp}</small><strong>{zone.label}</strong></div>
        <div className="readout">
          <small>{temp}°C · {pressure} ATM</small>
          <strong>{active.depth.toLocaleString()} m</strong>
          <div className="bar"><i style={{ width: `${scrollProgress * 100}%` }} /></div>
        </div>
      </div>

      <div className="nearest"><small>NEAREST LIFE</small><strong>{active.name}</strong></div>

      <section className="hero">
        <SafeImage className="hero-bg" src="/ocean/ocean-depth-art.svg" alt="海面から深海へ続く海" loading="eager" />
        <SafeImage className="particles" src="/ocean/ocean-particles.svg" alt="" loading="eager" />
        <div className="hero-copy">
          <p>SWIPE EARTH: OCEAN</p>
          <h1>海面から、<br />地球の底へ。</h1>
          <span>SWIPE / SCROLL TO DIVE</span>
          <b>↓</b>
        </div>
      </section>

      <section className="journey">
        {encounters.map((item, index) => (
          <article
            key={item.name}
            data-encounter-index={index}
            className={`encounter-scene ${index % 2 ? 'reverse' : ''} ${item.mystery ? 'mystery' : ''} ${item.giant ? 'giant' : ''} ${activeIndex === index ? 'is-active' : ''}`}
          >
            <SafeImage className="scene-bg" src="/ocean/ocean-depth-art.svg" alt="" style={{ objectPosition: `center ${item.bg}%` }} />
            <SafeImage className="particles" src="/ocean/ocean-particles.svg" alt="" />
            <div className="scene-inner">
              <div className="art">
                <SafeImage className="creature-art" src={`/ocean/creatures/${item.image}`} alt={item.jp} loading={index < 2 ? 'eager' : 'lazy'} />
              </div>
              <div className="copy">
                <div className="depth">{item.depth.toLocaleString()} m</div>
                <div className="eyebrow">{item.mystery ? 'UNCONFIRMED / LEGEND' : 'ENCOUNTER'}</div>
                <h2>{item.name}</h2>
                <h3>{item.jp}</h3>
                <div className="line" />
                <p className="note">{item.note}</p>
              </div>
            </div>
            <div className="index">{String(index + 1).padStart(2, '0')} / {String(encounters.length).padStart(2, '0')}</div>
          </article>
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
