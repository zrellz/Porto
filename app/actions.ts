'use server'
import { cookies } from 'next/headers'
import 'server-only'
import { auth } from '~/auth'
import { cookie } from '~/core/constants'
import { SinglePermType } from '~/core/contexts/types'

export const pageAccess = async (access: SinglePermType[]) => {
  const authData = await auth()
  const role = authData?.session.role
  if (!role) return false
  const roleAccess = role.access
  return access.some((perm) =>
    roleAccess.some((rolePerm) => rolePerm.subject === perm.subject && rolePerm.actions.includes(perm.action)),
  )
}

export const logout = async () => {
  const exeption = [cookie.HOST]
  ;(await cookies()).getAll().forEach(async (cookie) => {
    if (!exeption.includes(cookie.name)) {
      ;(await cookies()).delete(cookie.name)
    }
  })
  return true
}
