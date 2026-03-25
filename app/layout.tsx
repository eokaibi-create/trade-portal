import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ALOKAIBI International Trading',
  description: 'B2B Trade Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
