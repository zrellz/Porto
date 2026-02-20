import Cookies from 'cookies'
import { IncomingMessage, ServerResponse } from 'http'
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware'
import { NextApiRequest, NextApiResponse } from 'next'
import { cookie } from '~/core/constants'
import { jsonResponse } from '~/core/utils/response'
import { env } from '~/env.mjs'
import { decodeData } from '~/middleware/utils'

type AccessData = {
  name: string
  email: string
  token: string
}
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}
process.setMaxListeners(0)

const middleware = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res)

  const target = `${env.API_PROTOCOL}://${env.API_DOMAIN}`
  const accessToken = cookies.get(cookie.TOKEN)
  let token: string | undefined
  if (accessToken) {
    const data: AccessData = (await decodeData({
      token: accessToken,
      secret: env.NEXTAUTH_SECRET,
    })) as unknown as AccessData
    token = data.token
  }
  return createProxyMiddleware({
    secure: process.env.NODE_ENV === 'production',
    changeOrigin: true,
    target,
    pathRewrite: { '^/api/proxy': '/api' },
    selfHandleResponse: true,
    on: {
      proxyReq: (proxyReq) => {
        try {
          if (token) {
            proxyReq.setHeader('Authorization', `Bearer ${token}`)
          }
        } catch (error) {
          console.log('token empty', error)
        }
      },
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Accept', 'application/json')

        try {
          const cookies = new Cookies(req, res)
          const accessToken = cookies.get(cookie.TOKEN)
          if (accessToken) req.headers.authorization = accessToken
          const response = responseBuffer.toString('utf8')
          if (res.statusCode === 401) {
            proxyRes.statusCode = 401
            return jsonResponse({ message: 'Unauthorized' })
          }
          if (req.headers['content-type'] === 'application/json') {
            return JSON.stringify(JSON.parse(response))
          }
          return responseBuffer
        } catch (error) {
          const err = error as Error
          res.statusCode = 500
          return jsonResponse({ message: err.message })
        }
      }),
      error: (err, req, res) => {
        const result = res as ServerResponse<IncomingMessage>
        console.log(err)
        result.statusCode = 500
        return jsonResponse({ message: 'Internal Server Error' })
      },
    },
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proxy = await middleware(req, res)
  proxy(req, res, (err) => {
    if (err) {
      throw err
    }
    throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`)
  })
}
