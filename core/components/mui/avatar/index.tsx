// ** React Imports
import { Ref } from 'react'

// ** MUI Imports
import MuiAvatar from '@mui/material/Avatar'
import { lighten, useTheme } from '@mui/material/styles'

// ** Types
import { ThemeColor } from '~/types'
import { CustomAvatarProps } from './types'

// ** Hooks Imports
import React from 'react'
import useBgColor, { UseBgColorType } from '~/hooks/use-bg-color'

const Avatar = React.forwardRef((props: CustomAvatarProps, ref: Ref<any>) => {
  // ** Props
  const { sx, src, skin = 'filled', color = 'primary' } = props

  // ** Hook
  const theme = useTheme()
  const bgColors: UseBgColorType = useBgColor()

  const getAvatarStyles = (skin: 'filled' | 'light' | 'light-static' | undefined, skinColor: ThemeColor) => {
    let avatarStyles

    if (skin === 'light') {
      avatarStyles = { ...bgColors[`${skinColor}Light`] }
    } else if (skin === 'light-static') {
      avatarStyles = {
        color: bgColors[`${skinColor}Light`].color,
        backgroundColor: lighten(theme.palette[skinColor].main, 0.88),
      }
    } else {
      avatarStyles = { ...bgColors[`${skinColor}Filled`] }
    }

    return avatarStyles
  }

  const colors: UseBgColorType = {
    primary: getAvatarStyles(skin, 'primary'),
    secondary: getAvatarStyles(skin, 'secondary'),
    success: getAvatarStyles(skin, 'success'),
    error: getAvatarStyles(skin, 'error'),
    warning: getAvatarStyles(skin, 'warning'),
    info: getAvatarStyles(skin, 'info'),
  }

  return <MuiAvatar ref={ref} {...props} sx={!src && skin && color ? Object.assign(colors[color], sx) : sx} />
})

Avatar.displayName = 'Avatar'

export default Avatar
