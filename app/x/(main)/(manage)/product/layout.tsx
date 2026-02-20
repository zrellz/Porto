import type { Metadata } from 'next'
import { env } from '~/env.mjs'

export const metadata: Metadata = {
    title: `${env.NEXT_PUBLIC_APP_NAME} - Product`,
    description: 'Manage Product',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
