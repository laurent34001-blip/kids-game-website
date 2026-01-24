import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kids Game Website - Fun Games for Children',
  description: 'A colorful and fun gaming website for kids with exciting games and activities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
