import { Box, Grid, Tooltip, Typography } from '@mui/material'

import Image from 'next/image'
import { UserData } from '~/query/user'

const Info = ({ detail }: { detail?: UserData }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 3 }} className="flex flex-col items-center">
          <Image
            alt=""
            src={detail?.photoUrl ? detail.photoUrl : '/images/misc/no-image.jpg'}
            width={160}
            height={160}
            layout="responsive"
            style={{ borderRadius: '0.5rem', width: '100%', height: 'auto' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Name</Typography>
              <Tooltip placement="bottom-start" title={detail?.name}>
                <Typography variant="body1" noWrap>
                  {detail?.name || '-'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Email</Typography>
              <Tooltip placement="bottom-start" title={detail?.email}>
                <Typography variant="body1" noWrap>
                  {detail?.email || '-'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Status</Typography>
              <Tooltip placement="bottom-start" title={detail?.emailVerifiedAt ? 'Verified' : 'Not Verified'}>
                <Typography variant="body1" noWrap>
                  {detail?.emailVerifiedAt ? 'Verified' : 'Not Verified'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption">Verified At</Typography>
              <Tooltip placement="bottom-start" title={detail?.emailVerifiedAt}>
                <Typography variant="body1" noWrap>
                  {detail?.emailVerifiedAt || '-'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption">Roles</Typography>
              <Tooltip placement="bottom-start" title={detail?.role.name}>
                <Typography variant="body1" noWrap>
                  {detail?.role.name || '-'}
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
