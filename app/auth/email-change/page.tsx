'use client'

import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import FooterIllustrations from '~/components/misc/footer-illustrations'
import themeConfig from '~/core/configs/theme'
import { useVerifyEmail } from '~/query/auth'

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}))

const EmailChangePage = () => {
  const params = useSearchParams()
  const token = params?.get('token')
  const email = params?.get('email')
  const uid = params?.get('uid')
  const [disable, setDisable] = useState<boolean>(true)
  const theme = useTheme()
  const router = useRouter()
  const { mutate: check, isPending } = useVerifyEmail({
    onSuccess: () => {
      setDisable(false)
      router.push('/')
      toast.success('Email has been successfully changed!')
    },
    onError: () => {
      router.push('/')
      toast.error('The link has expired. Please request a new activation link.')
    },
  })

  useEffect(() => {
    if (email && token && uid) check({ token, email, uid })
    else {
      router.push('/')
      toast.error('Session expired, please either request new verification or contact our support!')
    }
  }, [check, email, token, uid])

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ p: (theme) => `${theme.spacing(15.5, 7, 8)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/images/logo.png" width={40} height={40} alt="Logo" />
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
              Verifying Your New Email 🔒
            </Typography>
            <Typography variant="body2">Please wait until verification is successful...</Typography>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrations image={`/images/pages/auth-v1-reset-password-mask-${theme.palette.mode}.png`} />
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={disable}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  )
}

export default EmailChangePage
