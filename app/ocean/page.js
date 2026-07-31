'use client';

import { useEffect, useMemo, useState } from 'react';

const encounters = [
  { depth: 15, name: 'SEA TURTLE', jp: 'アオウミガメ', type: 'turtle', note: 'まだ太陽の光が強い。海面近くでは、呼吸のために水面へ上がるウミガメに出会う。' },
  { depth: 60, name: 'MANTA RAY', jp: 'オニイトマキエイ', type: 'manta', note: '大きな翼のような胸びれで、青い水の中をゆっくり滑空する。' },
  { depth: 120, name: 'BLUE WHALE', jp: 'シロナガスクジラ', type: 'whale', note: '地球上で最大の動物。体長は30m近くに達することもある。', scale: 'giant' },
  { depth: 250, name: 'GIANT SQUID', jp: 'ダイオウイカ', type: 'squid', note: '光が急速に弱くなる薄明帯。巨大な眼で、わずかな光を捉える。' },
  { depth: 600, name: 'ANGLERFISH', jp: 'チョウチンアンコウ', type: 'angler', note: '太陽光はほぼ届かない。自ら発する光が、この世界の目印になる。' },
  { depth: 1000, name: 'VAMPIRE SQUID', jp: 'コウモリダコ', type: 'vampire', note: '酸素の少ない暗黒の海に適応した、不思議な深海生物。' },
  { depth: 2200, name: 'GIANT ISOPOD', jp: 'ダイオウグソクムシ', type: 'isopod', note: '水圧は地上とは比較にならない。海底を歩く巨大な等脚類。' },
  { depth: 4000, name: 'HITOGATA', jp: 'ヒトガタ', type: 'hitogata', note: '南極海などで語られる白い人型の未確認存在。ここから先は、事実と伝承の境界が曖昧になる。', mystery: true },
  { depth: 6000, name: 'KRAKEN', jp: 'クラーケン', type: 'kraken', note: '巨大な触手で船を沈めると語られてきた伝説の怪物。もちろん、確認された生物ではない。', mystery: true, scale: 'giant' },
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

const milestones = [
  { depth: 200, title: 'SUNLIGHT ENDS', text: 'ここから先、青以外の光はほとんど届かない。' },
  { depth: 1000, title: 'TOTAL DARKNESS', text: '太陽の光が消える。生き物自身の光が景色になる。' },
  { depth: 4000, title: '400 ATM', text: '地上のおよそ400倍の圧力。人間はそのままでは存在できない。' },
  { depth: 6000, title: 'HADAL BEGINS', text: '海溝だけに存在する、地球でもっとも深い領域へ。' }
];

function getZone(depth) { return zones.find((zone) => depth >= zone.from && depth < zone.to) || zones[zones.length - 1]; }
function Creature({ type }) { return <div className={`creature-art creature-${type}`} aria-hidden="true"><i/><b/><em/><span/><small/></div>; }

export default function Ocean() {
  const [depth, setDepth] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      setProgress(ratio); setDepth(Math.round(ratio * 11000));
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const zone = useMemo(() => getZone(depth), [depth]);
  const temp = Math.max(1.2, 24 - depth / 520).toFixed(1);
  const pressure = Math.max(1, depth / 10).toFixed(0);

  return (
    <main className="ocean-experience">
      <div className="ocean-ui">
        <a className="ocean-brand" href="/">SWIPE EARTH <span>/ OCEAN</span></a>
        <div className="ocean-zone"><small>{zone.jp}</small><strong>{zone.label}</strong></div>
        <div className="ocean-stats"><span><small>TEMP</small>{temp}°C</span><span><small>PRESSURE</small>{pressure} atm</span></div>
        <div className="depth-readout"><small>DEPTH</small><strong>{depth.toLocaleString()} m</strong></div>
      </div>

      <aside className="depth-rail" aria-hidden="true"><div className="rail-line" /><div className="rail-progress" style={{ height: `${progress * 100}%` }} />{[0,200,1000,4000,6000,11000].map((value)=><div className="rail-mark" key={value} style={{top:`${value/110}%`}}><span>{value.toLocaleString()}m</span></div>)}</aside>

      <section className="surface-scene"><div className="sun-disc"/><div className="sun-ray ray-a"/><div className="sun-ray ray-b"/><div className="wave wave-a"/><div className="wave wave-b"/><div className="surface-birds">⌁　⌁</div><div className="surface-copy"><p>SWIPE EARTH: OCEAN</p><h1>海面から、<br/>地球の底へ。</h1><span>SCROLL / SWIPE TO DIVE</span><b>↓</b></div></section>

      <div className="water-column">
        <div className="ambient ambient-school school-a" aria-hidden="true">{Array.from({length:13}).map((_,i)=><i key={i}/>)}</div>
        <div className="ambient ambient-school school-b" aria-hidden="true">{Array.from({length:9}).map((_,i)=><i key={i}/>)}</div>
        <div className="ambient jelly-field" aria-hidden="true">{Array.from({length:7}).map((_,i)=><i key={i}/>)}</div>
        <div className="ambient bio-stars" aria-hidden="true">{Array.from({length:18}).map((_,i)=><i key={i}/>)}</div>
        <div className="trench-wall wall-left" aria-hidden="true"/><div className="trench-wall wall-right" aria-hidden="true"/>
        <div className="particles" aria-hidden="true">{Array.from({ length: 26 }).map((_, i) => <i key={i} />)}</div>
        {zones.map((z)=><div className="zone-divider" key={z.label} style={{top:`${z.from/110}%`}}><span>{z.label}</span><small>{z.jp}</small></div>)}
        {milestones.map((m)=><div className="depth-milestone" key={m.depth} style={{top:`${2+(m.depth/11000)*92}%`}}><small>{m.depth.toLocaleString()} m</small><strong>{m.title}</strong><p>{m.text}</p></div>)}
        {encounters.map((item,index)=><article className={`encounter-row ${index%2?'right':'left'} ${item.mystery?'mystery':''} ${item.scale==='giant'?'giant':''}`} key={item.depth} style={{top:`${3+(item.depth/11000)*92}%`}}><div className="encounter-depth">{item.depth.toLocaleString()} m</div><div className="creature-stage"><Creature type={item.type}/></div><div className="encounter-copy"><p>{item.mystery?'UNCONFIRMED / LEGEND':'ENCOUNTER'}</p><h2>{item.name}</h2><h3>{item.jp}</h3><div className="rule"/><div className="note">{item.note}</div></div></article>)}
      </div>

      <section className="ocean-floor"><div className="floor-glow"/><div className="floor-ridge"/><p>10,900 m — CHALLENGER DEEP</p><h2>ここまで来ても、<br/>まだ未知は残っている。</h2><a href="/">EXPLORE ANOTHER WORLD →</a></section>
    </main>
  );
}
