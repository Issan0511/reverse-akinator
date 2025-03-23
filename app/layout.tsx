import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '逆ネーター--立場逆転アキネーター',
  description: 'はい・いいえの質問でキャラクターを当てる逆アキネーター的ゲーム！',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
