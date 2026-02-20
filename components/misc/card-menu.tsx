'use client'
// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Third Party Imports

// ** Theme Config Import

// ** Types
import { MenuItem } from '~/types/layout'

// ** Custom Components Imports
import CanViewMenu from '~/core/components/acl/CanViewMenu'

// ** Util Imports

import { Card, CardContent, Grid, GridSize, useTheme } from '@mui/material'
import { useRouter } from 'next/navigation'
import IconifyIcon from '~/core/components/icon'
import { GenericObject } from '~/types/axios'

const MainMenuItem = ({
  breakpoints,
  onLoad,
  ...item
}: MenuItem & { breakpoints: GenericObject<GridSize>; onLoad?: () => void }) => {
  // ** Hook & Vars
  const router = useRouter()
  const { palette } = useTheme()

  const icon = item.icon

  return (
    <CanViewMenu navLink={item}>
      <Grid size={breakpoints}>
        <Link
          style={{ textDecoration: 'none' }}
          href={item.path}
          onClick={(e) => {
            e.preventDefault()
            router.push(item.path)
          }}
        >
          <Card
            sx={({ palette }) => ({
              border: '1px solid transparent',
              cursor: 'pointer',
              '&:hover': {
                border: `1px solid ${palette.primary.main}`,
              },
            })}
          >
            <CardContent sx={{ height: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  alignItems: 'flex-start',

                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', flex: 1 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </Box>
                  <IconifyIcon icon={icon || 'octicon:dot-16'} fontSize={'2.5rem'} color={palette.customColors.base} />
                </Box>
                <Typography variant="body2" sx={{ color: 'primary.main', textDecoration: 'none', marginTop: '1rem' }}>
                  BUKA
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    </CanViewMenu>
  )
}

export default MainMenuItem
