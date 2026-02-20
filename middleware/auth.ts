import { MiddlewareFunction } from '@rescale/nemo'
import { NextResponse } from 'next/server'
import { auth } from '~/auth'
import { cookie } from '~/core/constants'
import { AppSession } from '~/types'

export const authMiddleware: MiddlewareFunction = async (req, event) => {
  const res = NextResponse.next()
  const url = req.nextUrl.clone()

  const sessions: AppSession = { user: null, role: null }

  try {
    const authData = await auth()
    if (!authData) throw new Error('No auth data')
    sessions.user = {
      name: authData.session.user.name,
      email: authData.session.user.email,
      id: authData.session.user.id,
    }
    const role = authData.session?.role
    if (!role) throw new Error('No role data')
    sessions.role = role
  } catch (e) {}
  if (!sessions.user) {
    req.cookies.delete(cookie.TOKEN)
    req.cookies.delete(cookie.ROLE)
    if (req.nextUrl.pathname !== '/') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  } else if (!sessions.role && req.nextUrl.pathname !== '/x') {
    url.pathname = '/x'
    return NextResponse.redirect(url)
  }
  return res
}
