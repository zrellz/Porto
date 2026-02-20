import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_APP_SUB_NAME: z.string().min(1),
    API_DOMAIN: z.string().min(1),
    API_PROTOCOL: z.string().min(1),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    NEXTAUTH_SECRET: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
    NEXT_PUBLIC_APP_SUB_NAME: z.string().min(1),
    // MQTT
    NEXT_PUBLIC_MQTT_BROKER_URL: z.string().url().min(1),
    NEXT_PUBLIC_MQTT_USERNAME: z.string().min(1),
    NEXT_PUBLIC_MQTT_PASSWORD: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_SUB_NAME: process.env.NEXT_PUBLIC_APP_SUB_NAME,
    API_DOMAIN: process.env.API_DOMAIN,
    API_PROTOCOL: process.env.API_PROTOCOL,
    NODE_ENV: process.env.NODE_ENV,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    // MQTT
    NEXT_PUBLIC_MQTT_BROKER_URL: process.env.NEXT_PUBLIC_MQTT_BROKER_URL,
    NEXT_PUBLIC_MQTT_USERNAME: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    NEXT_PUBLIC_MQTT_PASSWORD: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
