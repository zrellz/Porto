'use client'
import { Box, Button, Card, CardHeader, Chip, Divider, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { can } from '~/core/components/acl/access'
import IconifyIcon from '~/core/components/icon'
import Avatar from '~/core/components/mui/avatar'
import { Access } from '~/core/constants'
import { getInitials } from '~/core/utils/get-initials'
import { useListUser, UserData } from '~/query/user'
import { ThemeColor } from '~/types'
import { PageFilter } from '~/types/axios'
import Configure from './_components/Configure'
import CreateNew from './_components/CreateNew'
import TableHeader from './_components/TableHeader'

interface CellType {
  row: UserData
}

interface UserStatusType {
  [key: string]: ThemeColor
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary',
}
// ** renders client column
const renderClient = (row: UserData) => {
  if (row.photoUrl) {
    return (
      <Avatar src={row.photoUrl} sx={{ mr: 3, width: 34, height: 34 }}>
        <Image loading="lazy" src={row.photoUrl} alt={row.name} fill />
      </Avatar>
    )
  } else {
    return (
      <Avatar skin="light" color={'primary'} sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row.name ? row.name : 'John Doe')}
      </Avatar>
    )
  }
}

const renderColumns = ({ onConfigure }: { onConfigure: (item: string) => void }): GridColDef[] => {
  return [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'name',
      headerName: 'Nama',
      renderCell: ({ row }: CellType) => {
        const { name, email } = row
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography>{name}</Typography>
              <Typography noWrap variant="caption">
                {email}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.3,
      minWidth: 100,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant="body2">
            {row.email}
          </Typography>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'role',
      headerName: 'Role',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant="body2">
            {row.role.name}
          </Typography>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'status',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Status',
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return row.emailVerifiedAt ? (
          <Chip size="small" color={userStatusObj.active} label="Active" />
        ) : (
          <Chip size="small" color={userStatusObj.inactive} label="Inactive" />
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Button onClick={() => onConfigure(row.id)} size="small" startIcon={<IconifyIcon icon="ph:gear-six" />}>
            Detail
          </Button>
        </Box>
      ),
    },
  ]
}

const initialPage: PageFilter<{ name?: string; email?: string }> = {
  page: 0,
  pageSize: 10,
}

export default function Page() {
  const allowCreate = can([Access.ACCOUNT.CREATE])
  const params = useSearchParams()
  const router = useRouter()

  const [rowConfigure, setRowConfigure] = useState<string>()
  const [rowCreate, setRowCreate] = useState<boolean>(false)
  const [rowCount, setRowCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState(initialPage)

  const { data: _list, isLoading, isSuccess } = useListUser({ params: paginationModel })

  const onCreate = () => {
    router.push('/x/user?create=true')
  }
  const onConfigure = (id: string) => {
    router.push(`/x/user?more=${id}`)
  }

  const onBack = () => {
    router.push('/x/user')
  }

  const columns = renderColumns({ onConfigure })

  useEffect(() => {
    const more = params?.get('more')
    const create = params?.get('create')
    if (more) {
      setRowConfigure(more)
    } else if (create && allowCreate) {
      setRowCreate(true)
    } else {
      setRowConfigure(undefined)
      setRowCreate(false)
    }
  }, [allowCreate, params])

  useEffect(() => {
    if (isSuccess)
      if (_list?.paginate.total) setRowCount(_list.paginate.total || 0)
      else setRowCount(0)
  }, [_list?.paginate, isSuccess])

  return (
    <Grid container spacing={6}>
      {rowCreate && can([Access.ACCOUNT.CREATE]) ? (
        <Grid size={{ xs: 12 }}>
          <CreateNew onClose={onBack} />
        </Grid>
      ) : null}
      {rowConfigure ? (
        <Grid size={{ xs: 12 }}>
          <Configure row={rowConfigure} onClose={onBack} />
        </Grid>
      ) : null}
      {!rowCreate && !rowConfigure ? (
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="User" />
            <Divider />
            <TableHeader
              title="Search"
              defaultOptions={{
                name: '',
                email: '',
              }}
              values={{
                name: paginationModel.filter?.name,
                email: paginationModel.filter?.email,
              }}
              changeOptions={(data) => setPaginationModel((s) => ({ ...s, filter: data }))}
              onCreate={can([Access.ACCOUNT.CREATE]) ? onCreate : undefined}
            />
            <DataGrid
              loading={isLoading}
              rows={_list?.result || []}
              rowCount={rowCount}
              columns={columns}
              disableColumnFilter
              rowSelection={false}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: initialPage },
              }}
              onSortModelChange={(sortModel) => {
                const orderBy = sortModel[0]?.field || undefined
                const orderDirection = sortModel[0]?.sort || undefined

                setPaginationModel((s) => ({ ...s, orderBy, orderDirection }))
              }}
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={({ page, pageSize }) => setPaginationModel((s) => ({ ...s, page, pageSize }))}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
          </Card>
        </Grid>
      ) : null}
    </Grid>
  )
}
