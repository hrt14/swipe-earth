'use client';

import { useEffect, useMemo, useState } from 'react';

const encounters = [
  { depth: 15, name: 'SEA TURTLE', jp: 'アオウミガメ', type: 'turtle', image: 'turtle-graphic.svg', note: 'まだ太陽の光が強い。海面近くでは、呼吸のために水面へ上がるウミガメに出会う。' },
  { depth: 60, name: 'MANTA RAY', jp: 'オニイトマキエイ', type: 'manta', image: 'manta-graphic.svg', note: '大きな翼のような胸びれで、青い水の中をゆっくり滑空する。' },
  { depth: 120, name: 'BLUE WHALE', jp: 'シロナガスクジラ', type: 'whale', image: 'whale-graphic.svg', giant: true, note: '地球上で最大の動物。体長は30m近くに達することもある。' },
  { depth: 250, name: 'GIANT SQUID', jp: 'ダイオウイカ', type: 'squid', image: 'squid-graphic.svg', note: '光が急速に弱くなる薄明帯。巨大な眼で、わずかな光を捉える。' },
  { depth: 600, name: 'ANGLERFISH', jp: 'チョウチンアンコウ', type: 'angler', image: 'angler-graphic.svg', note: '太陽光はほぼ届かない。自ら発する光が、この世界の目印になる。' },
  { depth: 1000, name: 'VAMPIRE SQUID', jp: 'コウモリダコ', type: 'vampire', image: 'vampire-graphic.svg', note: '酸素の少ない暗黒の海に適応した、不思議な深海生物。' },
  { depth: 2200, name: 'GIANT ISOPOD', jp: 'ダイオウグソクムシ', type: 'isopod', image: 'isopod-graphic.svg', note: '水圧は地上とは比較にならない。海底を歩く巨大な等脚類。' },
  { depth: 4000, name: 'HITOGATA', jp: 'ヒトガタ', type: 'hitogata', image: 'hitogata-graphic.svg', mystery: true, note: '南極海などで語られる白い人型の未確認存在。ここから先は、事実と伝承の境界が曖昧になる。' },
  { depth: 6000, name: 'KRAKEN', jp: 'クラーケン', type: 'kraken', image: 'kraken-graphic.svg', mystery: true, giant: true, note: '巨大な触手で船を沈めると語られてきた伝説の怪物。もちろん、確認された生物ではない。' },
  { depth: 8200, name: 'HADAL SHADOW', jp: '超深海の影', type: 'shadow', image: 'shadow-graphic.svg', mystery: true, note: '観測できる範囲は急激に狭くなる。暗闇の向こうに何がいるかは、まだ分からない。' },
  { depth: 10900, name: 'THE UNKNOWN', jp: '未知', type: 'unknown', image: 'unknown-graphic.svg', mystery: true, note: '地球の最深部。人類はここまで来た。それでも、海のすべてを知ったわけではない。' }
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

function SafeImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={`${className} image-fallback`} role="img" aria-label={`${alt}の画像を読み込めませんでした`}>IMAGE ERROR</div>;
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="eager"
      onError={() => {
        console.error('[SWIPE EARTH image error]', src);
        setFailed(true);
      }}
    />
  );
}

export default function Ocean() {
  const [depth, setDepth] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(ratio);
      setDepth(Math.round(ratio * 11000));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const zone = useMemo(() => getZone(depth), [depth]);
  const active = useMemo(
    () => encounters.reduce((a, b) => Math.abs(b.depth - depth) < Math.abs(a.depth - depth) ? b : a, encounters[0]),
    [depth]
  );
  const pressure = Math.max(1, depth / 10).toFixed(0);
  const temp = Math.max(1.2, 24 - depth / 520).toFixed(1);

  return (
    <main className="ocean-v4">
      <style jsx global>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#020914;color:#f4fbff;font-family:Arial,Helvetica,sans-serif}.ocean-v4{overflow:hidden;background:#020914}.hud{position:fixed;z-index:50;left:0;right:0;top:0;padding:16px 20px;display:grid;grid-template-columns:1fr auto auto;gap:20px;background:linear-gradient(rgba(0,5,12,.86),transparent);pointer-events:none}.hud a{pointer-events:auto;color:#fff;text-decoration:none;font-size:11px;letter-spacing:.16em;font-weight:700}.hud a span{opacity:.45;font-weight:400}.meta,.readout{text-align:right}.meta small,.readout small{display:block;font-size:7px;letter-spacing:.16em;opacity:.5}.meta strong{font-size:10px;letter-spacing:.12em}.readout strong{font-size:21px;font-variant-numeric:tabular-nums}.bar{height:2px;margin-top:6px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden}.bar i{display:block;height:100%;background:#8ceeff}.nearest{position:fixed;z-index:49;left:16px;bottom:16px;padding:9px 13px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(0,7,14,.65);backdrop-filter:blur(10px)}.nearest small{display:block;font-size:7px;letter-spacing:.16em;opacity:.45}.nearest strong{font-size:10px;letter-spacing:.1em}.hero{height:100vh;min-height:640px;position:relative;display:grid;place-items:center;overflow:hidden;background:#0879a8}.ocean-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center}.hero:after{content:'';position:absolute;inset:0;background:linear-gradient(rgba(0,30,55,.02),rgba(0,6,16,.38))}.hero-copy{position:relative;z-index:2;text-align:center;padding:20px;text-shadow:0 4px 30px rgba(0,20,45,.6)}.hero-copy p{font-size:10px;letter-spacing:.28em;font-weight:700}.hero-copy h1{margin:14px 0;font-size:clamp(58px,10vw,136px);line-height:.84;letter-spacing:-.07em}.hero-copy span{font-size:9px;letter-spacing:.2em}.hero-copy b{display:block;margin-top:12px;font-size:34px;animation:dive 1.4s ease-in-out infinite}@keyframes dive{50%{transform:translateY(9px)}}.journey{position:relative;height:26000px;overflow:hidden;background:#031221}.journey>.ocean-bg{height:100%;object-fit:fill;opacity:.96}.journey:after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 0 15%,rgba(0,1,7,.08) 38%,rgba(0,0,4,.54) 100%);pointer-events:none}.zone{position:absolute;z-index:3;left:0;right:0;border-top:1px solid rgba(255,255,255,.14);padding:10px 7vw}.zone strong{font-size:9px;letter-spacing:.22em}.zone small{margin-left:12px;font-size:9px;opacity:.45}.encounter{position:absolute;z-index:5;left:50%;width:min(1120px,calc(100% - 80px));transform:translate(-50%,-50%);display:grid;grid-template-columns:minmax(360px,1.25fr) minmax(280px,.8fr);gap:44px;align-items:center;opacity:.62;transition:opacity .55s,filter .55s}.encounter.right{grid-template-columns:minmax(280px,.8fr) minmax(360px,1.25fr)}.encounter.right .visual{order:2}.encounter.right .copy{text-align:right}.encounter.active{opacity:1}.visual{height:430px;display:grid;place-items:center;position:relative}.visual:after{content:'';position:absolute;width:82%;height:64%;border-radius:50%;background:radial-gradient(ellipse,rgba(101,224,255,.2),transparent 70%);filter:blur(18px)}.mystery .visual:after{background:radial-gradient(ellipse,rgba(171,206,255,.15),transparent 70%)}.creature-img{position:relative;z-index:2;display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 24px 34px rgba(0,0,0,.58));transform:scale(.9);transition:transform .55s}.encounter.active .creature-img{transform:scale(1.04)}.encounter.giant .creature-img{transform:scale(1.02)}.encounter.giant.active .creature-img{transform:scale(1.13)}.image-fallback{display:grid;place-items:center;border:1px solid rgba(255,100,100,.5);color:#ff9f9f;font-size:11px;letter-spacing:.18em}.copy{max-width:430px}.copy .d{font-size:10px;letter-spacing:.16em;opacity:.45}.copy .k{margin-top:20px;font-size:8px;letter-spacing:.22em;opacity:.56}.copy h2{margin:7px 0 0;font-size:clamp(38px,5vw,70px);line-height:.9;letter-spacing:-.055em}.copy h3{margin:9px 0;font-size:17px;font-weight:400;opacity:.66}.copy .line{width:36px;height:1px;background:rgba(255,255,255,.4);margin:18px 0}.right .copy .line{margin-left:auto}.copy .note{font-size:13px;line-height:1.9;opacity:.68}.mystery .copy h2{font-family:Georgia,'Times New Roman',serif;font-weight:500}.end{min-height:100vh;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 22px;overflow:hidden;background:#01040a}.end:after{content:'';position:absolute;inset:0;background:rgba(0,2,8,.62)}.end>*:not(.ocean-bg){position:relative;z-index:2}.end p{font-size:9px;letter-spacing:.22em;opacity:.55}.end h2{font-size:clamp(44px,8vw,94px);line-height:.93;letter-spacing:-.055em;margin:12px 0 28px}.end a{color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:14px 20px;font-size:9px;letter-spacing:.15em}@media(max-width:760px){.hud{grid-template-columns:1fr auto;padding:13px}.meta{display:none}.nearest{left:10px;bottom:10px}.journey{height:22000px}.encounter,.encounter.right{width:calc(100% - 38px);grid-template-columns:1fr;gap:8px}.encounter.right .visual{order:initial}.encounter.right .copy{text-align:left}.visual{height:340px}.creature-img{width:108%;max-width:none}.right .copy .line{margin-left:0}.copy h2{font-size:clamp(38px,11vw,58px)}.copy{padding-right:24px}}
      `}</style>

      <div className="hud">
        <a href="/">SWIPE EARTH <span>/ OCEAN</span></a>
        <div className="meta"><small>{zone.jp}</small><strong>{zone.label}</strong></div>
        <div className="readout"><small>{temp}°C · {pressure} ATM</small><strong>{depth.toLocaleString()} m</strong><div className="bar"><i style={{ width: `${progress * 100}%` }} /></div></div>
      </div>
      <div className="nearest"><small>NEAREST LIFE</small><strong>{active.name}</strong></div>

      <section className="hero">
        <SafeImage className="ocean-bg" src="/ocean/ocean-depth-graphic.svg" alt="海面から深海へ続く海" />
        <div className="hero-copy"><p>SWIPE EARTH: OCEAN</p><h1>海面から、<br />地球の底へ。</h1><span>SWIPE / SCROLL TO DIVE</span><b>↓</b></div>
      </section>

      <section className="journey">
        <SafeImage className="ocean-bg" src="/ocean/ocean-depth-graphic.svg" alt="" />
        {zones.map((z) => <div className="zone" key={z.label} style={{ top: `${(z.from / 11000) * 100}%` }}><strong>{z.label}</strong><small>{z.jp}</small></div>)}
        {encounters.map((item, index) => (
          <article key={item.type} className={`encounter ${index % 2 ? 'right' : ''} ${item.mystery ? 'mystery' : ''} ${item.giant ? 'giant' : ''} ${active.type === item.type ? 'active' : ''}`} style={{ top: `${2.8 + (item.depth / 11000) * 94}%` }}>
            <div className="visual"><SafeImage className="creature-img" src={`/ocean/creatures/${item.image}`} alt={item.jp} /></div>
            <div className="copy"><div className="d">{item.depth.toLocaleString()} m</div><div className="k">{item.mystery ? 'UNCONFIRMED / LEGEND' : 'ENCOUNTER'}</div><h2>{item.name}</h2><h3>{item.jp}</h3><div className="line" /><div className="note">{item.note}</div></div>
          </article>
        ))}
      </section>

      <section className="end">
        <SafeImage className="ocean-bg" src="/ocean/ocean-depth-graphic.svg" alt="深海の底" />
        <p>10,984 m / CHALLENGER DEEP</p><h2>海の底まで、<br />到達した。</h2><a href="/">SELECT ANOTHER WORLD</a>
      </section>
    </main>
  );
}
