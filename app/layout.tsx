import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prod[X] | Launch Products',
  description: 'Don\'t Pitch Ideas. Launch Products.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground antialiased")}>
      <div id="debug-error" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999, background: 'white', color: 'red', fontSize: '12px', maxHeight: '50vh', overflow: 'auto' }}></div>
      <script dangerouslySetInnerHTML={{ __html: `
        window.onerror = function(msg, url, line, col, error) {
          const div = document.getElementById('debug-error');
          if (div) {
            div.innerText += "\\n" + msg + " at " + url + ":" + line + ":" + col;
            if (error && error.stack) div.innerText += "\\n" + error.stack;
          }
        };
        window.onunhandledrejection = function(event) {
          const div = document.getElementById('debug-error');
          if (div) {
            div.innerText += "\\nUnhandled rejection: " + event.reason;
          }
        };
      ` }} />
        {children}
      </body>
    </html>
  )
}
