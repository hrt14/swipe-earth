'use client';

import { useEffect, useState } from 'react';

const encounters = [
  { depth: 0, name: 'SEA TURTLE', jp: 'アオウミガメ', icon: '🐢', note: '陽光が届く海面近くをゆっくり泳ぐ。' },
  { depth: 40, name: 'MANTA RAY', jp: 'オニイトマキエイ', icon: '🪽', note: '大きな翼のようなヒレで水中を滑空する。' },
  { depth: 200, name: 'GIANT SQUID', jp: 'ダイオウイカ', icon: '🦑', note: '巨大な眼を持つ深海のハンター。' },
  { depth: 500, name: 'ANGLERFISH', jp: 'チョウチンアンコウ', icon: '🐟', note: '光を使い、暗闇で獲物を待つ。' },
  { depth: 1000, name: 'VAMPIRE SQUID', jp: 'コウモリダコ', icon: '🦑', note: '酸素の少ない暗黒の海に適応した。' },
  { depth: 2000, name: 'GIANT ISOPOD', jp: 'ダイオウグソクムシ', icon: '🪲', note: '海底を歩く巨大な等脚類。' },
  { depth: 3500, name: 'HITOGATA', jp: 'ヒトガタ', icon: '👤', note: '目撃談だけが残る、白い人型の未確認存在。', mystery: true },
  { depth: 5000, name: 'KRAKEN', jp: 'クラーケン', icon: '🐙', note: '伝承の中で船を沈めると語られた巨大生物。', mystery: true },
  { depth: 7500, name: 'HADAL SHADOW', jp: '超深海の影', icon: '◉', note: 'ここから先は、観測より想像の方が多くなる。', mystery: true },
  { depth: 10000, name: 'THE UNKNOWN', jp: '未知', icon: '?', note: '地球には、まだ見つかっていない何かがいるかもしれない。', mystery: true }
];

export default function Ocean() {
  const [depth, setDepth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setDepth(Math.round(ratio * 11000));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="ocean">
      <div className="depth-meter">
        <span>DEPTH</span>
        <strong>{depth.toLocaleString()} m</strong>
      </div>
      <a className="back-link" href="/">← SWIPE EARTH</a>
      <section className="ocean-intro">
        <p className="eyebrow">SWIPE EARTH: OCEAN</p>
        <h1>海の底まで<br />潜ってみよう。</h1>
        <p>下へスワイプ</p>
        <span className="down">↓</span>
      </section>

      <section className="depth-line">
        {encounters.map((item) => (
          <article className={`encounter ${item.mystery ? 'mystery' : ''}`} key={item.depth} style={{ minHeight: item.depth === 0 ? '70vh' : '105vh' }}>
            <div className="marker">{item.depth.toLocaleString()} m</div>
            <div className="creature">{item.icon}</div>
            <p className="specimen">{item.mystery ? 'UNCONFIRMED' : 'ENCOUNTER'}</p>
            <h2>{item.name}</h2>
            <h3>{item.jp}</h3>
            <p className="note">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="ocean-end">
        <p>10,000 m+</p>
        <h2>まだ、地球を全部は知らない。</h2>
        <a href="/">世界を選び直す →</a>
      </section>
    </main>
  );
}
