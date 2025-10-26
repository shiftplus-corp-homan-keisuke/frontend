import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastProvider } from '@/components/ui/toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CSV Chart Generator',
  description: 'CSVファイルをアップロードしてインタラクティブなグラフを生成します',
  keywords: ['CSV', 'Chart', 'Graph', 'Data Visualization', 'データ可視化'],
  authors: [{ name: 'CSV Chart Generator' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}