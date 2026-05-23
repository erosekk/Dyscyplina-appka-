import './globals.css'

export const metadata = {
  title: 'Dyscyplina',
  description: 'Buduje swoje zycie porzadnie.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080d18',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dyscyplina" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#080d18' }}>
        {children}
      </body>
    </html>
  )
}