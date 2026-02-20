import { MiddlewareFunction, MiddlewareFunctionProps } from '@rescale/nemo'
import * as jwt from 'jose'

import { NextResponse } from 'next/server'
import { cookie } from '~/core/constants'
import { env } from '~/env.mjs'
import { fetchAndSetHostToken } from './utils'

export const globalMiddleware: MiddlewareFunction = async ({ request, forward }: MiddlewareFunctionProps) => {
  const res = NextResponse.next()
  try {
    const hostData = request.cookies.get(cookie.HOST)?.value
    if (!hostData) throw new Error('No host data')
    const jwtKey = new TextEncoder().encode(env.NEXTAUTH_SECRET)
    const host = await jwt.jwtVerify(hostData, jwtKey)
    console.log('[GLOBAL][HOST]', host.payload.value)
  } catch (_) {
    const host = await fetchAndSetHostToken(request, res)
    if (host) return forward(host)
  }
  return forward(res)
}
