// ** React Imports
import React from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid' // Grid component from MUI
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import { confirm } from 'material-ui-confirm'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { can } from '~/core/components/acl/access'
import Icon from '~/core/components/icon'
import { Access } from '~/core/constants'
import { useDeleteRole, useListRole } from '~/query/role'
import { ModalCERole } from './ModalCERole'

const RoleCards = ({ id }: { id?: string }) => {
  const router = useRouter()

  // ** States
  const [openCreate, setOpenCreate] = React.useState<boolean>(false)
  const [openEdit, setOpenEdit] = React.useState<string | undefined>(id)

  // ** Permissions — must be called at top level, never inside .map() or conditionals
  const canUpdate = can([Access.ROLE.UPDATE])
  const canDelete = can([Access.ROLE.DELETE])
  const canCreate = can([Access.ROLE.CREATE])

  const { data: _roles, refetch } = useListRole({ params: { all: 1 } })
  const { mutate: deleteData, isPending: isDeleting } = useDeleteRole({
    onSuccess: () => {
      refetch()
      toast.success('Role has been deleted!')
    },
    onError: (err) => {
      toast.success('Failed to delete role!')
    },
  })

  React.useEffect(() => {
    if (id) setOpenEdit(id)
    else setOpenEdit(undefined)
  }, [id])

  const renderCards = () =>
    _roles?.result.map((item, index: number) => (
      <Grid key={`${item.id}-${index}`} size={{ xs: 12, sm: 6, lg: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">{`${item.totalUsers || 0} accounts`}</Typography>
              <Typography variant="body2">{`${item.totalPermissions || 0} permissions`}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography variant="caption">{item.name}</Typography>
                <Typography variant="h6">{item.description}</Typography>
                {canUpdate && (
                  <Typography
                    href="/"
                    variant="body2"
                    component={Link}
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                    onClick={(e) => {
                      e.preventDefault()
                      router.replace(`/x/role?edit=${item.id}`)
                    }}
                  >
                    Update Role
                  </Typography>
                )}
              </Box>
              {canDelete && (
                <IconButton
                  sx={{ color: 'text.secondary' }}
                  onClick={() => {
                    confirm({ title: 'Are you sure ?', description: "You can't undo this change" }).then(() => {
                      deleteData(item.id)
                    })
                  }}
                >
                  <Icon icon="ph:trash-duotone" fontSize={20} />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <Grid container spacing={6} className="match-height">
      {renderCards()}
      {canCreate && (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card sx={{ cursor: 'pointer' }} onClick={() => setOpenCreate(true)}>
            <Grid container sx={{ height: '100%' }}>
              <Grid size={{ xs: 5 }}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img width={65} height={130} alt="add-role" src="/images/pages/add-new-role-illustration.png" />
                </Box>
              </Grid>
              <Grid size={{ xs: 7 }}>
                <CardContent>
                  <Box sx={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      sx={{ mb: 2.5, whiteSpace: 'nowrap' }}
                      onClick={() => setOpenCreate(true)}
                    >
                      New Role
                    </Button>
                    <Typography variant="body2">Create your new role.</Typography>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      )}
      <ModalCERole open={openCreate} onClose={() => setOpenCreate(false)} refetch={() => refetch()} />
      <ModalCERole
        open={Boolean(openEdit)}
        id={openEdit}
        onClose={() => {
          router.replace('/x/role')
          setOpenEdit(undefined)
        }}
        refetch={() => refetch()}
      />
    </Grid>
  )
}

export default RoleCards
