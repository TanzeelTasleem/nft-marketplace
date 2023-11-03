import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/utils/web3'
import { ReduxProvider } from '@/redux/reduxProvivder'
import Navbar from '@/components/common/Navbar'
import AuthLayout from './authLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NFT Marketplace App',
  description: 'Create and sell your NFT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Web3Provider>
        <ReduxProvider>
          <body className={inter.className}>
            <AuthLayout>
            <Navbar />
            {children}
            </AuthLayout>
            {/* </Navbar> */}
          </body>
        </ReduxProvider>
      </Web3Provider>
    </html>
  )
}
