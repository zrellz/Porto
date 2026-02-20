// ** MUI Components
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface FooterIllustrationsProp {
  image?: string
}

// Styled Components
const MaskImg = styled('img')(({ theme }) => ({
  zIndex: -1,
  bottom: '7%',
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: '10%',
  },
}))

const FooterIllustrations = (props: FooterIllustrationsProp) => {
  // ** Props
  const { image } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const src = image || `/images/pages/auth-v1-login-mask-${theme.palette.mode}.png`

  if (!hidden) {
    return <MaskImg alt="mask" src={src} />
  } else {
    return null
  }
}

export default FooterIllustrations
