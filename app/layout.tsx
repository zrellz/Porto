import { Lato } from 'next/font/google'
import { auth } from '~/auth'
import Providers from '~/components/providers/main-providers'
import ThemeProvider from '~/components/providers/theme-provider'
import './globals.css'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers session={session}>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
