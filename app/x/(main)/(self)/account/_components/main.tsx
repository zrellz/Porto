'use client'

import { Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import PageHeader from '~/components/page-header'
import IconifyIcon from '~/core/components/icon'
import General from './general'
import Security from './security'

export default function Main({ slug }: { slug: string }) {
  const router = useRouter()

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12 }}>
        <PageHeader
          title={
            <Typography variant="h5" fontWeight={600}>
              Account Settings
            </Typography>
          }
          subtitle={
            <Typography variant="body1">
              Manage and configure your account settings, security, and preferences.
            </Typography>
          }
        />
      </Grid>
      <Grid size={{ lg: 3, md: 4, xs: 12 }}>
        <List component="nav" aria-label="main mailbox folders" sx={{ p: 1, '& .MuiButtonBase-root': { mb: 2 } }}>
          <ListItemButton
            selected={slug === 'general'}
            sx={{ borderRadius: '0.5rem', py: '0.325rem' }}
            onClick={() => router.push('/x/account')}
          >
            <ListItemIcon>
              <IconifyIcon icon="bi:house-door" fontSize="1.25rem" />
            </ListItemIcon>
            <ListItemText slotProps={{ primary: { fontSize: '0.875rem' } }} primary="General" />
          </ListItemButton>
          <ListItemButton
            selected={slug === 'security'}
            sx={{ borderRadius: '0.5rem', py: '0.325rem' }}
            onClick={() => router.push('/x/account/security')}
          >
            <ListItemIcon>
              <IconifyIcon icon="mdi:shield-lock-outline" fontSize="1.25rem" />
            </ListItemIcon>
            <ListItemText slotProps={{ primary: { fontSize: '0.875rem' } }} primary="Security" />
          </ListItemButton>
        </List>
      </Grid>
      <Grid size={{ lg: 9, md: 8, xs: 12 }}>
        {slug === 'general' ? <General /> : slug === 'security' ? <Security /> : <div>Not Found</div>}
      </Grid>
    </Grid>
  )
}
