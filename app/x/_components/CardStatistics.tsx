'use client'

import { Box } from '@mui/material'
// MUI Imports
import type { CardProps } from '@mui/material/Card'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import IconifyIcon from '~/core/components/icon'
import Avatar from '~/core/components/mui/avatar'
import { colorOpacity } from '~/core/styles/colors'
import { getFormattedTimeDifference } from '~/core/utils/format'

//Component Imports
import { ThemeColor } from '~/types'

export type CardStatsWithBorderProps = {
  title: string
  stats: number
  lastUpdate?: Date
  avatarIcon: string
  color?: ThemeColor
  onClick?: () => void
  active?: boolean
}
type Props = CardProps & {
  color: ThemeColor
}

const Card = styled(MuiCard)<Props>(({ color, theme }) => ({
  cursor: 'pointer',
  borderBottomWidth: '1px',
  borderBottomColor: `${theme.palette[color].dark}`,

  '&:hover': {
    borderBottomWidth: '2px',
    borderBottomColor: `${theme.palette[color].main} !important`,
    boxShadow: theme.shadows[5],
    marginBlockEnd: '-1px',
  },
}))

const StatsWithBorder = (props: CardStatsWithBorderProps) => {
  // Props
  const { title, stats, lastUpdate, avatarIcon, color, active, onClick } = props

  return (
    <Card color={color || 'primary'} onClick={onClick}>
      <CardContent
        sx={({ palette }) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: active ? `${colorOpacity(palette[color || 'primary'].dark, 0.05)}` : undefined,
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Avatar sizes="2.5rem" color={color} skin="light" variant="rounded">
            <IconifyIcon icon={avatarIcon} width={'1.75rem'} />
          </Avatar>
          <Typography variant="h4" fontSize={'1.5rem'}>
            {stats}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography fontWeight={600} fontSize="1.25rem" lineHeight="normal" color="text.primary">
            {title}
          </Typography>
          {lastUpdate && (
            <Typography variant="body2" color="text.disabled">
              {getFormattedTimeDifference(lastUpdate)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatsWithBorder
