import type { Metadata, Viewport } from 'next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/lib/theme/context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beef With Bezos | Amazon Missed Delivery Tracker',
  description:
    'Tracking every time Amazon fails to deliver. A public record of disappointment, one missed package at a time.',
  keywords: [
    'Amazon',
    'delivery',
    'tracking',
    'missed packages',
    'complaints',
  ],
  authors: [{ name: 'Beef With Bezos' }],
  openGraph: {
    title: 'Beef With Bezos',
    description: 'Tracking every time Amazon fails to deliver.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Beef With Bezos',
  },
  twitter: {
    card: 'summary',
    title: 'Beef With Bezos',
    description: 'Tracking every time Amazon fails to deliver.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('beef-theme') || 'rage';
                  var colorMode = localStorage.getItem('beef-color-mode');
                  document.documentElement.dataset.theme = theme;
                  if (colorMode) {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(colorMode);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="animated-gradient min-h-screen">
        <ThemeProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
