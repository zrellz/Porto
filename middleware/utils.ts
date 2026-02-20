import axios from 'axios'
import * as jwt from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { cookie } from '~/core/constants'
import { env } from '~/env.mjs'

export async function fetchAndSetHostToken(req: NextRequest, res: NextResponse<unknown>) {
  try {
    const params = req.headers.get('host')
    const API_URL = `${env.API_PROTOCOL}://${env.API_DOMAIN}`
    const hostResponse = await axios.get(`${API_URL}/api/check-domain?host=${params}`)
    const result = hostResponse.data?.result
    if (!result?.key) throw new Error('Host not found')
    const hostToken = await encodeData({ secret: env.NEXTAUTH_SECRET, token: { value: result.key } })
    console.log('[REQUEST][TOKEN]', hostToken)
    res.cookies.set(cookie.HOST, hostToken)
    return res
  } catch (e) {
    console.log('[REQUEST][HOST]', e)
    if (e instanceof jwt.errors.JWSInvalid) {
      console.error('Invalid Compact JWS:', e.message)
    }

    return false
  }
}

export const encodeData = async ({
  secret,
  token,
  maxAge = 60 * 60 * 24,
}: {
  secret: string
  token: any
  maxAge?: number
}) => {
  const jwtKey = new TextEncoder().encode(secret as string)
  const tokenData = { ...token, exp: Math.floor(Date.now() / 1000) + (maxAge || 0) }
  const encodedToken = await new jwt.SignJWT(tokenData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
    .sign(jwtKey)
  return encodedToken
}

export const decodeData = async ({ secret, token }: { secret: string; token: string }) => {
  if (token === undefined) return null
  const jwtKey = new TextEncoder().encode(secret as string)
  const data = (await jwt.jwtVerify(token, jwtKey)).payload

  return data as Record<string, any>
}
