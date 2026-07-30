const worlds = [
  { key: 'ocean', icon: '🌊', title: 'OCEAN', subtitle: '海を深く潜る', href: '/ocean', live: true },
  { key: 'sky', icon: '☁️', title: 'SKY', subtitle: '空の彼方へ', live: false },
  { key: 'underground', icon: '🪨', title: 'UNDERGROUND', subtitle: '地底を進む', live: false },
  { key: 'prehistory', icon: '🦖', title: 'PREHISTORY', subtitle: '古代へ遡る', live: false },
  { key: 'space', icon: '🪐', title: 'SPACE', subtitle: '宇宙の果てへ', live: false },
  { key: 'micro', icon: '🦠', title: 'MICRO WORLD', subtitle: 'ミクロの世界へ', live: false },
  { key: 'mega', icon: '🏔️', title: 'MEGA WORLD', subtitle: '巨大世界へ', live: false }
];

export default function Home() {
  return (
    <main className="home-shell">
      <section className="hero">
        <p className="eyebrow">EXPLORE BY SWIPING</p>
        <h1>SWIPE EARTH</h1>
        <p className="lead">ただスワイプするだけで、世界の奥へ。</p>
      </section>
      <section className="world-grid">
        {worlds.map((world) => world.live ? (
          <a className="world-card live" href={world.href} key={world.key}>
            <span className="world-icon">{world.icon}</span>
            <div>
              <strong>{world.title}</strong>
              <p>{world.subtitle}</p>
            </div>
            <span className="status">ENTER →</span>
          </a>
        ) : (
          <div className="world-card locked" key={world.key}>
            <span className="world-icon">{world.icon}</span>
            <div>
              <strong>{world.title}</strong>
              <p>{world.subtitle}</p>
            </div>
            <span className="status">COMING SOON</span>
          </div>
        ))}
      </section>
    </main>
  );
}
