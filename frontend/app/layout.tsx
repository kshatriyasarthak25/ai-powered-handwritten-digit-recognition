import './globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Handwritten Digit Recognition',
  description: 'Real-time handwritten digit recognition using deep learning',
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
