'use client';

import { useEffect, useMemo, useState } from 'react';

const encounters = [
  { depth: 15, name: 'SEA TURTLE', jp: 'アオウミガメ', type: 'turtle', note: 'まだ太陽の光が強い。海面近くでは、呼吸のために水面へ上がるウミガメに出会う。' },
  { depth: 60, name: 'MANTA RAY', jp: 'オニイトマキエイ', type: 'manta', note: '大きな翼のような胸びれで、青い水の中をゆっくり滑空する。' },
  { depth: 120, name: 'BLUE WHALE', jp: 'シロナガスクジラ', type: 'whale', note: '地球上で最大の動物。体長は30m近くに達することもある。', giant: true },
  { depth: 250, name: 'GIANT SQUID', jp: 'ダイオウイカ', type: 'squid', note: '光が急速に弱くなる薄明帯。巨大な眼で、わずかな光を捉える。' },
  { depth: 600, name: 'ANGLERFISH', jp: 'チョウチンアンコウ', type: 'angler', note: '太陽光はほぼ届かない。自ら発する光が、この世界の目印になる。' },
  { depth: 1000, name: 'VAMPIRE SQUID', jp: 'コウモリダコ', type: 'vampire', note: '酸素の少ない暗黒の海に適応した、不思議な深海生物。' },
  { depth: 2200, name: 'GIANT ISOPOD', jp: 'ダイオウグソクムシ', type: 'isopod', note: '水圧は地上とは比較にならない。海底を歩く巨大な等脚類。' },
  { depth: 4000, name: 'HITOGATA', jp: 'ヒトガタ', type: 'hitogata', note: '南極海などで語られる白い人型の未確認存在。ここから先は、事実と伝承の境界が曖昧になる。', mystery: true },
  { depth: 6000, name: 'KRAKEN', jp: 'クラーケン', type: 'kraken', note: '巨大な触手で船を沈めると語られてきた伝説の怪物。もちろん、確認された生物ではない。', mystery: true, giant: true },
  { depth: 8200, name: 'HADAL SHADOW', jp: '超深海の影', type: 'shadow', note: '観測できる範囲は急激に狭くなる。暗闇の向こうに何がいるかは、まだ分からない。', mystery: true },
  { depth: 10900, name: 'THE UNKNOWN', jp: '未知', type: 'unknown', note: '地球の最深部。人類はここまで来た。それでも、海のすべてを知ったわけではない。', mystery: true }
];

const zones = [
  { from: 0, to: 200, label: 'SUNLIGHT ZONE', jp: '表層' },
  { from: 200, to: 1000, label: 'TWILIGHT ZONE', jp: '薄明帯' },
  { from: 1000, to: 4000, label: 'MIDNIGHT ZONE', jp: '漸深海帯' },
  { from: 4000, to: 6000, label: 'ABYSS', jp: '深海底帯' },
  { from: 6000, to: 11000, label: 'HADAL ZONE', jp: '超深海帯' }
];

const sprite = {
  turtle: ['real', '0% 0%', '300%'],
  manta: ['real', '50% 0%', '300%'],
  whale: ['real', '100% 0%', '300%'],
  squid: ['real', '0% 60%', '300%'],
  angler: ['real', '50% 58%', '300%'],
  vampire: ['real', '100% 57%', '300%'],
  isopod: ['real', '100% 100%', '300%'],
  hitogata: ['legend', '0% 0%', '200%'],
  kraken: ['legend', '100% 0%', '200%'],
  shadow: ['legend', '0% 100%', '200%'],
  unknown: ['legend', '100% 100%', '200%']
};

function getZone(depth) {
  return zones.find((z) => depth >= z.from && depth < z.to) || zones[zones.length - 1];
}

function CreatureGraphic({ type }) {
  const [sheet, position, size] = sprite[type];
  return (
    <div
      className={`graphic-creature ${type}`}
      style={{
        backgroundImage: `url(/ocean/${sheet === 'real' ? 'creatures.webp' : 'legends.webp'})`,
        backgroundPosition: position,
        backgroundSize: size
      }}
      aria-hidden="true"
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
  const active = useMemo(() => encounters.reduce((a, b) => Math.abs(b.depth - depth) < Math.abs(a.depth - depth) ? b : a, encounters[0]), [depth]);
  const pressure = Math.max(1, depth / 10).toFixed(0);
  const temp = Math.max(1.2, 24 - depth / 520).toFixed(1);

  return (
    <main className="graphic-ocean">
      <style jsx global>{`
        .graphic-ocean{min-height:100vh;background:#020914;color:#f4fbff;overflow:hidden}.graphic-ocean *{box-sizing:border-box}.ocean-hud{position:fixed;z-index:50;left:0;right:0;top:0;padding:18px 22px;display:grid;grid-template-columns:1fr auto auto;gap:22px;align-items:start;background:linear-gradient(rgba(0,7,14,.72),transparent);pointer-events:none}.ocean-hud a{pointer-events:auto;font-size:11px;letter-spacing:.18em;font-weight:700}.ocean-hud a span{opacity:.45;font-weight:400}.hud-zone,.hud-depth{text-align:right}.hud-zone small,.hud-depth small{display:block;font-size:7px;letter-spacing:.18em;opacity:.48}.hud-zone strong{font-size:10px;letter-spacing:.13em}.hud-depth strong{font-size:21px;font-variant-numeric:tabular-nums}.hud-progress{height:2px;margin-top:6px;background:rgba(255,255,255,.12);border-radius:99px;overflow:hidden}.hud-progress i{display:block;height:100%;background:#8ceeff}.nearest{position:fixed;z-index:49;left:20px;bottom:18px;padding:9px 13px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(0,8,15,.56);backdrop-filter:blur(12px)}.nearest small{display:block;font-size:7px;letter-spacing:.18em;opacity:.45}.nearest strong{font-size:10px;letter-spacing:.12em}.hero-ocean{height:100vh;min-height:650px;position:relative;display:grid;place-items:center;background-image:linear-gradient(rgba(1,18,33,.06),rgba(2,14,26,.25)),url('/ocean/ocean-depth.webp');background-size:cover;background-position:top center}.hero-ocean:after{content:'';position:absolute;inset:auto 0 0;height:22%;background:linear-gradient(transparent,#07182c)}.hero-copy{z-index:2;text-align:center;padding:20px;text-shadow:0 3px 28px rgba(0,25,55,.45)}.hero-copy p{font-size:10px;letter-spacing:.28em;font-weight:700}.hero-copy h1{margin:14px 0;font-size:clamp(58px,10vw,136px);line-height:.84;letter-spacing:-.07em}.hero-copy span{font-size:9px;letter-spacing:.2em}.hero-copy b{display:block;margin-top:12px;font-size:34px;animation:down 1.5s ease-in-out infinite}@keyframes down{50%{transform:translateY(9px)}}.ocean-journey{position:relative;height:33000px;background:#041526 url('/ocean/ocean-depth.webp') center top/100% 100% no-repeat}.ocean-journey:after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,transparent 0 16%,rgba(0,4,12,.12) 35%,rgba(0,2,8,.34) 65%,rgba(0,0,4,.5) 100%);pointer-events:none}.zone-mark{position:absolute;z-index:3;left:0;right:0;border-top:1px solid rgba(255,255,255,.15);padding:10px 7vw;display:flex;gap:12px;align-items:baseline}.zone-mark strong{font-size:9px;letter-spacing:.24em}.zone-mark small{font-size:9px;opacity:.45}.encounter-graphic{position:absolute;z-index:5;left:50%;width:min(1120px,calc(100% - 90px));transform:translate(-50%,-50%);display:grid;grid-template-columns:minmax(340px,1.25fr) minmax(280px,.8fr);gap:42px;align-items:center;opacity:.62;transition:opacity .5s}.encounter-graphic.right{grid-template-columns:minmax(280px,.8fr) minmax(340px,1.25fr)}.encounter-graphic.right .visual{order:2}.encounter-graphic.right .copy{text-align:right}.encounter-graphic.active{opacity:1}.visual{height:430px;display:grid;place-items:center;position:relative}.visual:after{content:'';position:absolute;width:72%;height:55%;border-radius:50%;background:radial-gradient(ellipse,rgba(110,225,255,.15),transparent 70%);filter:blur(18px)}.mystery .visual:after{background:radial-gradient(ellipse,rgba(180,210,255,.1),transparent 70%)}.graphic-creature{position:relative;z-index:2;width:100%;height:100%;background-repeat:no-repeat;filter:drop-shadow(0 22px 30px rgba(0,0,0,.5));transform:scale(.88);transition:transform .65s}.active .graphic-creature{transform:scale(1)}.whale,.kraken{transform:scale(1.02)}.active .whale,.active .kraken{transform:scale(1.13)}.copy{max-width:430px}.copy .depth{font-size:10px;letter-spacing:.18em;opacity:.45}.copy .kind{margin-top:22px;font-size:8px;letter-spacing:.24em;opacity:.55}.copy h2{margin:7px 0 0;font-size:clamp(38px,5vw,70px);line-height:.9;letter-spacing:-.055em}.copy h3{margin:9px 0;font-size:17px;font-weight:400;opacity:.66}.copy .line{width:36px;height:1px;background:rgba(255,255,255,.4);margin:18px 0}.right .copy .line{margin-left:auto}.copy .note{font-size:13px;line-height:1.9;opacity:.68}.mystery .copy h2{font-family:Georgia,serif;font-weight:500}.ocean-end{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#01040a url('/ocean/ocean-depth.webp') center bottom/cover no-repeat;padding:80px 22px;position:relative}.ocean-end:before{content:'';position:absolute;inset:0;background:rgba(0,3,8,.62)}.ocean-end>*{position:relative}.ocean-end p{font-size:9px;letter-spacing:.22em;opacity:.55}.ocean-end h2{font-size:clamp(44px,8vw,94px);line-height:.93;letter-spacing:-.055em;margin:12px 0 28px}.ocean-end a{border:1px solid rgba(255,255,255,.3);border-radius:999px;padding:14px 20px;font-size:9px;letter-spacing:.15em}@media(max-width:760px){.ocean-hud{grid-template-columns:1fr auto;padding:14px}.hud-zone{display:none}.nearest{left:12px;bottom:12px}.ocean-journey{height:28000px;background-size:auto 100%;}.encounter-graphic,.encounter-graphic.right{width:calc(100% - 42px);grid-template-columns:1fr;gap:4px}.encounter-graphic.right .visual{order:initial}.encounter-graphic.right .copy{text-align:left}.visual{height:300px}.copy{padding-right:28px}.right .copy .line{margin-left:0}.copy h2{font-size:clamp(38px,11vw,58px)}.graphic-creature{transform:scale(.94)}.active .graphic-creature{transform:scale(1.04)}}
      `}</style>

      <div className="ocean-hud">
        <a href="/">SWIPE EARTH <span>/ OCEAN</span></a>
        <div className="hud-zone"><small>{zone.jp}</small><strong>{zone.label}</strong></div>
        <div className="hud-depth"><small>{temp}°C · {pressure} ATM</small><strong>{depth.toLocaleString()} m</strong><div className="hud-progress"><i style={{ width: `${progress * 100}%` }} /></div></div>
      </div>
      <div className="nearest"><small>NEAREST LIFE</small><strong>{active.name}</strong></div>

      <section className="hero-ocean">
        <div className="hero-copy"><p>SWIPE EARTH: OCEAN</p><h1>海面から、<br/>地球の底へ。</h1><span>SWIPE / SCROLL TO DIVE</span><b>↓</b></div>
      </section>

      <section className="ocean-journey">
        {zones.map((z) => <div key={z.label} className="zone-mark" style={{ top: `${(z.from / 11000) * 100}%` }}><strong>{z.label}</strong><small>{z.jp}</small></div>)}
        {encounters.map((item, index) => {
          const isActive = item.type === active.type;
          return (
            <article key={item.type} className={`encounter-graphic ${index % 2 ? 'right' : ''} ${item.mystery ? 'mystery' : ''} ${isActive ? 'active' : ''}`} style={{ top: `${2.5 + (item.depth / 11000) * 94}%` }}>
              <div className="visual"><CreatureGraphic type={item.type} /></div>
              <div className="copy"><div className="depth">{item.depth.toLocaleString()} m</div><div className="kind">{item.mystery ? 'UNCONFIRMED / LEGEND' : 'ENCOUNTER'}</div><h2>{item.name}</h2><h3>{item.jp}</h3><div className="line"/><div className="note">{item.note}</div></div>
            </article>
          );
        })}
      </section>

      <section className="ocean-end"><p>10,900 m — CHALLENGER DEEP</p><h2>ここまで来ても、<br/>まだ未知は残っている。</h2><a href="/">EXPLORE ANOTHER WORLD →</a></section>
    </main>
  );
}
