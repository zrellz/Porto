'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { logout } from '~/app/actions'

import FooterIllustrations from '~/components/misc/footer-illustrations'
import IconifyIcon from '~/core/components/icon'
import themeConfig from '~/core/configs/theme'
import { useActivateAccount, useActivateCheck } from '~/query/auth'

interface State {
  showPassword: boolean
  showConfirmNewPassword: boolean
}
interface FormData {
  password: string
  confirmPassword: string
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const schema: z.ZodSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const defaultValues = {
  password: '',
  confirmPassword: '',
}

const Page = () => {
  const params = useSearchParams()
  const token = params?.get('token')
  const email = params?.get('email')
  const [loading, setLoading] = useState<boolean>(false)
  const [disable, setDisable] = useState<boolean>(true)
  const [values, setValues] = useState<State>({
    showPassword: false,
    showConfirmNewPassword: false,
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const theme = useTheme()
  const router = useRouter()
  const { mutate: check } = useActivateCheck({
    onSuccess: () => {
      setDisable(false)
    },
    onError: () => {
      router.push('/')
      toast.error('The link has expired. Please request a new activation link.')
    },
  })
  const { mutate: confirm, isPending } = useActivateAccount({
    onSuccess: () => {
      router.push('/')
      toast.success('Account activated successfully!')
    },
    onError: ({ response }) => {
      toast.error(response?.data?.message || 'Failed to activate account!')
    },
  })

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }
  const onSubmit = (data: FormData) => {
    const { password } = data
    if (token && email) confirm({ token, email, password })
  }
  useEffect(() => {
    setLoading(isPending)
  }, [isPending])
  useEffect(() => {
    if (email && token) {
      logout()
        .then(() => check({ email, token }))
        .catch(() => router.push('/'))
    }
  }, [email, token])
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
              Activate Account 🔒
            </Typography>
            <Typography variant="body2">Set your password to begin exploring our application</Typography>
          </Box>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ mb: 4 }} fullWidth>
              <InputLabel error={Boolean(errors.password)}>Password</InputLabel>
              <Controller
                name="password"
                control={control}
                disabled={loading || disable}
                rules={{ required: true }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    label="Password"
                    error={Boolean(errors.password)}
                    type={values.showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleClickShowNewPassword}
                        >
                          <IconifyIcon
                            icon={values.showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                            fontSize={20}
                          />
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
            <FormControl sx={{ mb: 4 }} fullWidth>
              <InputLabel error={Boolean(errors.password)}>Confirm Password</InputLabel>
              <Controller
                name="confirmPassword"
                control={control}
                disabled={loading || disable}
                rules={{ required: true }}
                render={({ field }) => (
                  <OutlinedInput
                    {...field}
                    label="Confirm Password"
                    error={Boolean(errors.confirmPassword)}
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleClickShowConfirmNewPassword}
                        >
                          <IconifyIcon
                            icon={values.showConfirmNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                            fontSize={20}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.confirmPassword && (
                <FormHelperText sx={{ color: 'error.main' }} id="">
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button
              fullWidth
              disabled={loading || disable}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mb: 4 }}
            >
              Set New Password
            </Button>
            <Link href={'/'} passHref>
              <Button
                fullWidth
                disabled={loading || disable}
                startIcon={<IconifyIcon icon="mdi:chevron-left" fontSize="2rem" />}
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

export default Page
