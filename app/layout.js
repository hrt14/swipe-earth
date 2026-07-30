import './globals.css';

export const metadata = {
  title: 'SWIPE EARTH',
  description: 'Swipe through Earth and beyond.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
