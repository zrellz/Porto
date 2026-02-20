import { Metadata } from 'next'
import MenuLayout from '~/core/layouts/MenuLayout'
import { env } from '~/env.mjs'
import navAcademic from '~/navigation/main'

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_APP_NAME} - Manage Your Tokinomo Device`,
  description: 'Self-service Tokinomo device management portal',
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  return <MenuLayout navItems={navAcademic()}>{children}</MenuLayout>
}
