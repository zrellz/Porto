// ** MUI Imports
import { SxProps, Theme } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from '~/core/components/icon'

// ** Custom Components Imports
import CustomAvatar from '~/core/components/mui/avatar'

const CardEmpty = ({
  onCreate,
  title,
  subTitle,
  sx,
}: {
  onCreate?: () => void
  title?: string
  subTitle?: string
  sx?: SxProps<Theme>
}) => {
  return (
    <Card sx={sx}>
      <CardContent
        sx={{
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <CustomAvatar skin="light" sx={{ width: 56, height: 56, mb: 2 }}>
          <Icon icon="mdi:help-circle-outline" fontSize="2rem" />
        </CustomAvatar>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title || 'No Data'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 6.5 }}>
          {subTitle || 'There is currently no data available for display.'}
        </Typography>
        {onCreate && (
          <Button variant="contained" onClick={() => onCreate()} sx={{ p: (theme) => theme.spacing(1.75, 5.5) }}>
            Tambah
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default CardEmpty
