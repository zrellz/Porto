'use client'

import { Stack } from '@mui/material'
import SideContent from './side-content'
import UserAuthForm from './user-auth-form'

export default function SignInViewPage() {
  return (
    <Stack
      direction="column"
      component="main"
      sx={[
        {
          justifyContent: 'center',
          height: 'calc((1 - var(--template-frame-height, 0)) * 100%)',
          marginTop: 'max(40px - var(--template-frame-height, 0px), 0px)',
          minHeight: 'calc(80vh)',
        },
        (theme) => ({
          '&::before': {
            content: '""',
            display: 'block',
            position: 'fixed',
            zIndex: -1,
            inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100%',
            ...theme.applyStyles('dark', {
              backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
            }),
          },
        }),
      ]}
    >
      <Stack
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{
          justifyContent: 'center',
          gap: { xs: 6, sm: 12 },
          p: 2,
          mx: 'auto',
        }}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: 'auto',
          }}
        >
          <SideContent />
          <UserAuthForm />
        </Stack>
      </Stack>
    </Stack>
  )
}
