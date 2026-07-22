import './globals.css';

export const metadata = {
  title: 'Standoff 2 Turnir',
  description: 'Турнирная платформа Standoff 2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}