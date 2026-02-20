'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfirmProvider } from 'material-ui-confirm'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import AclGuard from '~/core/components/auth/AclGuard'
import { SettingsConsumer, SettingsProvider } from '~/core/contexts/settings'
import { NotificationProvider } from '~/core/contexts/notification'
import ReactHotToast from '~/core/styles/react-hot-toast'
import AppTheme from '~/core/theme/AppTheme'

import { useTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
const Provider = ({ children, session }: { children: React.ReactNode; session: SessionProviderProps['session'] }) => {
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <NotificationProvider>
      <NuqsAdapter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <QueryClientProvider client={queryClient}>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <AppTheme settings={settings}>
                      <ConfirmProvider>
                        <SessionProvider session={session}>
                          <TopLoader />
                          <AclGuard>{children}</AclGuard>
                        </SessionProvider>
                      </ConfirmProvider>
                      <ReactHotToast>
                        <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                      </ReactHotToast>
                    </AppTheme>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </NuqsAdapter>
    </NotificationProvider>
  )
}

const TopLoader = () => {
  const { palette } = useTheme()
  return <NextTopLoader showSpinner={false} color={palette.primary.main} />
}

export default Provider
