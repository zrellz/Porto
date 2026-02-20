import { redirect } from 'next/navigation'
import { Access } from '~/core/constants'
import { checkPermissions } from '~/core/utils/auth'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const redirectPath = await checkPermissions([Access.ROLE.READ])
  if (redirectPath) redirect(redirectPath)
  return children
}
