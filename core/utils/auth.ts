import { auth } from '~/auth'
import { SinglePermType, UserPermType } from '../contexts/types'

export const checkMe = async (isLoginPage = false) => {
  let tokenValid = false
  try {
    const token = await auth()
    if (token) {
      tokenValid = true
      console.log(token?.user)
    }
  } catch (e) {
    if (e instanceof Error) console.log('[ERRR]', e.message)
  }
  let redirectPath: string | null = null
  try {
    if (isLoginPage && tokenValid) redirectPath = '/'
    else if (!isLoginPage && !tokenValid) redirectPath = '/login'
  } catch (error) {
    if (error instanceof Error) console.log('[AUTH]', error)
  }
  return redirectPath
}

export const checkPermissions = async (allowPermissions: SinglePermType[]) => {
  let tokenValid = false
  let accessValid = false
  try {
    const token = await auth()
    if (token) {
      tokenValid = true
      const access = token.session?.role?.access || []
      const permissions = access
        .map((item: UserPermType) => item.actions.map((action) => ({ action, subject: item.subject })))
        .flat()
      for (const permission of permissions) {
        const allowPermission = allowPermissions.find(
          (item) => item.action === permission.action && item.subject === permission.subject,
        )
        if (allowPermission) {
          accessValid = true
          break
        }
      }
    }
  } catch (e) {
    if (e instanceof Error) console.log('[ERRR]', e.message)
  }
  let redirectPath: string | null = null
  try {
    if (!tokenValid) redirectPath = '/'
    else if (!accessValid) redirectPath = '/x'
  } catch (error) {
    if (error instanceof Error) console.log('[AUTH]', error)
  }
  return redirectPath
}
