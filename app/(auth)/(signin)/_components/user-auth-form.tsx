'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
  TextField,
  Typography,
  TypographyProps,
} from '@mui/material'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import * as z from 'zod'
import IconifyIcon from '~/core/components/icon'
import themeConfig from '~/core/configs/theme'

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(5, { message: 'Password must be at least 5 characters long' }),
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)

  const defaultValues: UserFormValue = {
    email: '',
    password: '',
  }
  const {
    control,
    formState: { errors },
    ...form
  } = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    setIsLoggingIn(true)
    const sign = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (!sign || sign?.error) {
      toast.error('Sign In Failed! Please check your credentials.')
      setIsLoggingIn(false)
    } else {
      toast.success('Signed In Successfully!')
      router.push(callbackUrl || '/x')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Image src="/logo.png" width={72} height={72} alt="Logo" />
      </Box>
      <Box sx={{ mb: 6 }}>
        <TypographyStyled variant="h5">{`Welcome to ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
        <Typography variant="body2">Please sign in to your account and start your adventure!</Typography>
      </Box>
      <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ width: '100%', spaceY: 2 }}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <Controller
            name="email"
            control={control}
            disabled={isLoggingIn}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                autoFocus
                label="Email"
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                error={Boolean(errors.email)}
                placeholder="user@xxxxx.xxx"
              />
            )}
          />
          {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="auth-login-v2-password" error={Boolean(errors.password)}>
            Password
          </InputLabel>
          <Controller
            name="password"
            control={control}
            disabled={isLoggingIn}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <OutlinedInput
                value={value}
                onBlur={onBlur}
                label="Password"
                onChange={onChange}
                id="auth-login-v2-password"
                error={Boolean(errors.password)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <IconifyIcon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />
          {errors.password && (
            <FormHelperText sx={{ color: 'error.main' }} id="">
              {errors.password.message}
            </FormHelperText>
          )}
        </FormControl>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ height: '2rem' }} />
          <Typography
            variant="body2"
            component={Link}
            href="/forgot-password"
            sx={{ color: 'primary.main', textDecoration: 'none' }}
          >
            Forgot Password?
          </Typography>
        </Box>
        <Button fullWidth disabled={isLoggingIn} size="large" type="submit" variant="contained" sx={{ mb: 7 }}>
          Sign In
        </Button>
      </Box>
    </Box>
  )
}

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) },
}))
