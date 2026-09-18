// import { Analytics } from '@vercel/analytics/next'
// import { Inter } from 'next/font/google'
// import './globals.css'

// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
//   display: 'swap',
// })

// export const metadata = {
//   title: 'NMSight — AI-Powered Campus Safety & Intelligence',
//   description:
//     'NMSight is an edge-AI campus safety operations platform. See. Detect. Respond.',
//   generator: 'v0.app',
// }

// export const viewport = {
//   colorScheme: 'dark',
//   themeColor: '#0B1120',
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className={`dark ${inter.variable} bg-background`}>
//       <body className="font-sans antialiased">
//         {children}
//         {process.env.NODE_ENV === 'production' && <Analytics />}
//       </body>
//     </html>
//   )
// }


import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'NMSight — AI-Powered Campus Safety & Intelligence',
  description:
    'NMSight is an edge-AI campus safety operations platform. See. Detect. Respond.',
}

export const viewport = {
  colorScheme: 'dark',
  themeColor: '#0B1120',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}