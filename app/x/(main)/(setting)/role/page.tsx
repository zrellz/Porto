'use client'
import { Grid, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import PageHeader from '~/components/page-header'
import RoleCards from './_components/RoleCards'

export default function Page() {
  const searchParams = useSearchParams()
  const edit = searchParams?.get('edit') || undefined

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant="h5" fontWeight={600}>
            List Roles
          </Typography>
        }
        subtitle={
          <Typography variant="body1">
            Roles provide access to predefined menus and features, so depending on the role assigned, the administrator
            can have access to what is needed.
          </Typography>
        }
      />
      <Grid size={{ xs: 12 }}>
        <RoleCards id={edit} />
      </Grid>
    </Grid>
  )
}
