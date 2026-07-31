import './globals.css';

export const metadata = {
  title: 'SWIPE EARTH｜地球をスワイプして、未知へ。',
  description: '海の底、地球の内側、宇宙の果て。スワイプするだけで未知の世界を探検しよう。'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
