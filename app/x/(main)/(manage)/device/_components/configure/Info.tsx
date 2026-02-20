import { Box, Chip, Grid, Tooltip, Typography } from '@mui/material'
import { format } from 'date-fns'

import { DeviceData } from '~/query/device'

const Info = ({ detail }: { detail?: DeviceData }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Serial Number</Typography>
              <Tooltip placement="bottom-start" title={detail?.serial}>
                <Typography variant="body1" noWrap>
                  {detail?.serial || '-'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Name</Typography>
              <Tooltip placement="bottom-start" title={detail?.name}>
                <Typography variant="body1" noWrap>
                  {detail?.name || '-'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Location</Typography>
              <Tooltip placement="bottom-start" title={detail?.location}>
                <Typography variant="body1" noWrap>
                  {detail?.location || '-'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Status</Typography>
              <Box>
                <Chip
                  label={detail?.status || 'offline'}
                  color={detail?.status === 'online' ? 'success' : 'default'}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Created At</Typography>
              <Tooltip
                placement="bottom-start"
                title={detail?.createdAt ? format(detail?.createdAt, 'dd MMM yyyy, HH:mm') : ''}
              >
                <Typography variant="body1" noWrap>
                  {detail?.createdAt ? format(detail?.createdAt, 'dd MMM yyyy, HH:mm') : '-'}
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Info
