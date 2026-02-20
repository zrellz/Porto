import axios from 'axios'
import * as jwt from 'jose'
import { NextAuthConfig } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'
import { cookie } from './core/constants'
import { env } from './env.mjs'
import { decodeData, encodeData } from './middleware/utils'
import { LoginParams, LoginRes } from './query/auth'
import { AuthSessionData } from './types'
const authConfig = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          const jwtKey = new TextEncoder().encode(env.NEXTAUTH_SECRET)
          const email = credentials?.email as string
          const password = credentials?.password as string
          if (!email || !password) {
            throw new Error('Invalid credentials')
          }
          const params: LoginParams = { email, password }

          const API_URL = `${env.API_PROTOCOL}://${env.API_DOMAIN}/api`
          console.log('[REQUEST][API]', API_URL)
          const response = await axios.post<LoginRes>(`${API_URL}/auth/login`, params)

          const user = response.data.result
          if (user) {
            console.log('[RESPONSE][AUTH]', user)
            const role = user.roles[0]
            const roleToken = await new jwt.SignJWT({ value: role })
              .setProtectedHeader({ alg: 'HS256' })
              .setIssuedAt()
              .sign(jwtKey)
            ;(await cookies()).set(cookie.ROLE, roleToken)
            console.log('[REQUEST][AUTH]', user)

            const auth: AuthSessionData = {
              user: { name: user.name, email: user.email, id: user.id, image: user.photo_url },
              role: role,
              token: user.token,
            }
            console.log('[REQUEST][AUTH]', auth)
            return auth
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          console.error('[ERROR][AUTH]', error)
          return null
        }
      },
    }),
  ],
  jwt: {
    maxAge: 60 * 60 * 24,
    async encode({ token, secret, maxAge }) {
      return encodeData({ secret: secret as string, token, maxAge })
    },
    async decode({ token, secret }) {
      return decodeData({ secret: secret as string, token: token as string })
    },
  },
  cookies: {
    sessionToken: {
      name: cookie.TOKEN,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: env.NODE_ENV === 'production' },
    },
    csrfToken: {
      name: cookie.CSRF,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: env.NODE_ENV === 'production' },
    },
    callbackUrl: {
      name: cookie.CALLBACK,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: env.NODE_ENV === 'production' },
    },
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      const newToken = token as any
      if (trigger === 'update') {
        if (session?.user?.image) newToken.user.image = session.user.image
        if (session?.user?.name) newToken.user.name = session.user.name
        if (session?.user?.email) newToken.user.email = session.user.name
      }

      return { ...token, ...user }
    },
    async session({ session, trigger, newSession, token }) {
      session.session = token as AuthSessionData
      if (trigger === 'update' && newSession) {
        session.session = { ...session.session, ...newSession.session }
      }
      return session
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/', //sigin page
  },
} satisfies NextAuthConfig

export default authConfig
