'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import FooterIllustrations from '~/components/misc/footer-illustrations'
import Icon from '~/core/components/icon'
import themeConfig from '~/core/configs/theme'
import { URL_PATHS } from '~/core/constants'
import { useForgotSend } from '~/query/auth'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const schema = z.object({
  email: z.string().email().nonempty(),
})

const defaultValues = {
  email: '',
}

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const theme = useTheme()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const { mutate: confirm, isPending } = useForgotSend({
    onSuccess: () => {
      router.push('/')
      toast.success('We have sent a password reset link to your email. Please check your inbox.')
    },
    onError: ({ response }) => {
      toast.error(response?.data?.message || 'Failed to send activation!')
    },
  })

  const onSubmit = (data: { email: string }) => {
    const { email } = data
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
    const callbackUrl = `${origin}/${URL_PATHS.RESET_PASSWORD}`
    confirm({ email, callbackUrl })
  }

  React.useEffect(() => {
    setLoading(isPending)
  }, [isPending])

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: (theme) => `${theme.spacing(15.5, 7, 8)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/logo.png" width={40} height={40} alt="Logo" />
            <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="subtitle1"
                className="gothic-a1"
                sx={{ lineHeight: '1rem', fontStyle: 'italic', fontWeight: 600 }}
              >
                {themeConfig.templateName.toUpperCase()}
              </Typography>
              <Typography variant="caption" className="gothic-a1" sx={{ lineHeight: '0.75rem' }} fontSize="0.5rem">
                {themeConfig.templateSubName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}>
              Forgot Password? 🔒
            </Typography>
            <Typography variant="body2">
              Enter your email and we&prime;ll send you instructions to reset your password
            </Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ mb: 4 }} fullWidth>
              <InputLabel error={Boolean(errors.email)}>Email</InputLabel>
              <Controller
                name="email"
                control={control}
                disabled={loading}
                render={({ field }) => <OutlinedInput {...field} label="Email" error={Boolean(errors.email)} />}
              />
              {errors.email && (
                <FormHelperText sx={{ color: 'error.main' }} id="">
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>

            <Button fullWidth disabled={loading} size="large" type="submit" variant="contained" sx={{ mb: 4 }}>
              Send reset link
            </Button>
            <Link href={'/'} passHref>
              <Button
                fullWidth
                disabled={loading}
                startIcon={<Icon icon="mdi:chevron-left" fontSize="2rem" />}
                type="button"
              >
                Back to login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrations image={`/images/pages/auth-v1-reset-password-mask-${theme.palette.mode}.png`} />
    </Box>
  )
}

export default ForgotPasswordPage
