import { MiddlewareFunction } from '@rescale/nemo'
import { NextResponse } from 'next/server'
import { auth } from '~/auth'
import { AppSession } from '~/types'

export const guestMiddleware: MiddlewareFunction = async (req, event) => {
  const sessions: AppSession = { user: null, role: null }
  const url = req.nextUrl.clone()

  const res = NextResponse.next()

  try {
    const authData = await auth()
    if (!authData) throw new Error('No access data')
    sessions.user = {
      name: authData.session.user.name,
      email: authData.session.user.email,
      id: authData.session.user.id,
    }
  } catch (_) {}
  if (sessions.user && req.nextUrl.pathname === '/') {
    url.pathname = '/x'
    return NextResponse.redirect(url)
  }
  return res
}
