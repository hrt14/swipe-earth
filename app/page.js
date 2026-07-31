'use client';

import { useState } from 'react';

const worlds = [
  {
    key: 'ocean',
    icon: '⚓',
    title: 'OCEAN',
    jp: '深海',
    href: '/ocean',
    live: true,
    badge: 'portal-ocean'
  },
  {
    key: 'underground',
    icon: '⛏',
    title: 'UNDERGROUND',
    jp: '地中',
    live: false,
    badge: 'portal-underground'
  },
  {
    key: 'space',
    icon: '🪐',
    title: 'SPACE',
    jp: '宇宙',
    live: false,
    badge: 'portal-space'
  },
  {
    key: 'prehistory',
    icon: '🦴',
    title: 'PREHISTORY',
    jp: '恐竜',
    live: false,
    badge: 'portal-prehistory'
  },
  {
    key: 'micro',
    icon: '◉',
    title: 'MICRO',
    jp: 'ミクロ',
    live: false,
    badge: 'portal-micro'
  }
];

function WorldBadge({ world, onLocked }) {
  const content = (
    <>
      <span className="world-badge__orb" aria-hidden="true">{world.icon}</span>
      <span className="world-badge__copy">
        <strong>{world.title}</strong>
        <small>{world.jp}</small>
      </span>
      {!world.live && <span className="world-badge__soon">SOON</span>}
    </>
  );

  if (world.live) {
    return (
      <a className={`world-badge ${world.badge} is-live`} href={world.href}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={`world-badge ${world.badge}`}
      type="button"
      onClick={() => onLocked(world)}
      aria-label={`${world.title} ${world.jp}は近日公開`}
    >
      {content}
    </button>
  );
}

export default function Home() {
  const [soundOn, setSoundOn] = useState(true);
  const [panel, setPanel] = useState(null);
  const [notice, setNotice] = useState('');

  function playChime() {
    if (!soundOn || typeof window === 'undefined') return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const gain = context.createGain();
    const oscillator = context.createOscillator();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(520, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(820, context.currentTime + 0.14);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);
  }

  function showLocked(world) {
    playChime();
    setNotice(`${world.title}｜${world.jp}は、ただいま探検準備中！`);
    window.setTimeout(() => setNotice(''), 2400);
  }

  function togglePanel(next) {
    playChime();
    setPanel((current) => current === next ? null : next);
  }

  return (
    <main className="portal-page">
      <section className="portal-stage" aria-label="SWIPE EARTH ワールドポータル">
        <header className="portal-header">
          <a className="brand" href="/" aria-label="SWIPE EARTH トップ">
            <span>SWIPE EARTH</span>
            <i aria-hidden="true" />
          </a>

          <nav className="portal-nav" aria-label="メインメニュー">
            <button type="button" onClick={() => togglePanel('worlds')} aria-expanded={panel === 'worlds'}>
              ワールド
            </button>
            <button type="button" onClick={() => togglePanel('discoveries')} aria-expanded={panel === 'discoveries'}>
              図鑑
            </button>
            <button type="button" onClick={() => togglePanel('guide')} aria-expanded={panel === 'guide'}>
              あそびかた
            </button>
          </nav>

          <button
            className={`sound-toggle ${soundOn ? 'is-on' : ''}`}
            type="button"
            onClick={() => setSoundOn((value) => !value)}
            aria-pressed={soundOn}
            aria-label={`サウンドを${soundOn ? 'オフ' : 'オン'}にする`}
          >
            <span aria-hidden="true">{soundOn ? '♪' : '×'}</span>
            サウンド {soundOn ? 'ON' : 'OFF'}
          </button>
        </header>

        <div className="portal-art" aria-hidden="true">
          <img src="/earth-portal-hero.webp" alt="" />
        </div>

        <div className="portal-copy">
          <p className="portal-kicker"><span aria-hidden="true">✦</span> 地球をスワイプして、未知へ。</p>
          <h1>今日は、<br />どの世界へ？</h1>
          <p className="portal-description">
            海の底、地球の内側、宇宙の果て。<br />
            ひとつの地球から、いくつもの冒険がはじまる。
          </p>
          <a className="dive-button" href="/ocean">
            <span className="dive-button__icon" aria-hidden="true">⚓</span>
            <span><strong>OCEANへ潜る</strong><small>海面から深海11,000mへ</small></span>
            <b aria-hidden="true">↓</b>
          </a>
          <button className="all-worlds" type="button" onClick={() => togglePanel('worlds')}>
            ワールドを見る <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="portal-badges" aria-label="ワールドを選ぶ">
          {worlds.map((world) => (
            <WorldBadge key={world.key} world={world} onLocked={showLocked} />
          ))}
        </div>

        <a className="swipe-hint" href="/ocean">
          <span className="mouse" aria-hidden="true"><i /></span>
          <strong>SCROLL / SWIPE TO DIVE</strong>
        </a>

        {panel && (
          <div className="info-panel" role="dialog" aria-modal="false" aria-label="案内">
            <button className="info-panel__close" type="button" onClick={() => setPanel(null)} aria-label="閉じる">×</button>

            {panel === 'worlds' && (
              <>
                <p>WORLD MAP</p>
                <h2>冒険する世界を選ぶ</h2>
                <div className="world-list">
                  {worlds.map((world) => world.live ? (
                    <a href={world.href} key={world.key}>
                      <span>{world.icon}</span><strong>{world.title}<small>{world.jp}</small></strong><b>PLAY →</b>
                    </a>
                  ) : (
                    <button type="button" key={world.key} onClick={() => showLocked(world)}>
                      <span>{world.icon}</span><strong>{world.title}<small>{world.jp}</small></strong><b>SOON</b>
                    </button>
                  ))}
                </div>
              </>
            )}

            {panel === 'discoveries' && (
              <>
                <p>DISCOVERY BOOK</p>
                <h2>発見図鑑</h2>
                <div className="panel-message">
                  最初の図鑑はOCEANで開放されます。深く潜って、実在する生物と伝説の存在を見つけよう。
                  <a href="/ocean">OCEANを探検する →</a>
                </div>
              </>
            )}

            {panel === 'guide' && (
              <>
                <p>HOW TO PLAY</p>
                <h2>スワイプするだけ。</h2>
                <div className="guide-steps">
                  <span><b>1</b>ワールドを選ぶ</span>
                  <span><b>2</b>下へスワイプ</span>
                  <span><b>3</b>未知を発見する</span>
                </div>
              </>
            )}
          </div>
        )}

        {notice && <div className="portal-notice" role="status">{notice}</div>}
      </section>
    </main>
  );
}
