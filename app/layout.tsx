import './globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '../components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dynamic Chart Dashboard',
  description: 'Upload and visualize your data with interactive charts',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#1e1e2f] text-white`}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 p-6 bg-[#f5f5f5] dark:bg-[#1e1e2f]">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

