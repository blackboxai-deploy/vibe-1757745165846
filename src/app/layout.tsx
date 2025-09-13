import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: '10.000 Horas - Rumo à Maestria',
  description: 'Acompanhe sua jornada rumo à especialização em qualquer área. Registre suas horas de prática com precisão de segundos.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen`}
        suppressHydrationWarning
      >
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}