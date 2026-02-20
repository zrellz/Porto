import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Access } from '~/core/constants'
import { checkPermissions } from '~/core/utils/auth'
import { env } from '~/env.mjs'

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_APP_NAME} - Device`,
  description: 'Manage Device',
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const redirectPath = await checkPermissions([Access.DEVICE.READ])
  if (redirectPath) redirect(redirectPath)
  return children
}
