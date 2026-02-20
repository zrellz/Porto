'use client'
import { Card, CardHeader, Chip, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { can } from '~/core/components/acl/access'
import IconifyIcon from '~/core/components/icon'
import { Access } from '~/core/constants'
import { DeviceRegisterData, ListDeviceFilter, useListUnDevice } from '~/query/device'
import { PageFilter } from '~/types/axios'
import CreateDevice from './_components/CreateDevice'
import DeleteDevice from './_components/DeleteDevice'
import TableHeader from './_components/TableHeader'

interface CellType {
  row: DeviceRegisterData
}

type TRenderColumns = {
  onCreate: (serial: string) => void
  onDelete: (id: string) => void
}

const renderColumns = ({ onCreate, onDelete }: TRenderColumns): GridColDef[] => {
  return [
    {
      flex: 0.3,
      minWidth: 200,
      field: 'serial',
      headerName: 'Serial Number',
      renderCell: ({ row }: CellType) => {
        return <Typography variant="body1">{row.serial}</Typography>
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <Chip
            label={row.status}
            color={row.status === 'online' ? 'success' : 'default'}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        )
      },
    },
    {
      flex: 0.25,
      minWidth: 180,
      field: 'updatedAt',
      headerName: 'Last Update',
      renderCell: ({ row }: CellType) => {
        return <Typography>{row.updatedAt ? format(new Date(row.updatedAt), 'dd MMM yyyy, HH:mm') : '-'}</Typography>
      },
    },
    {
      flex: 0.25,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" aria-label="add" color="primary" onClick={() => onCreate(row.serial)}>
            <IconifyIcon icon="ph:plus" />
          </IconButton>

          <IconButton size="small" aria-label="delete" color="error" onClick={() => onDelete(row?.id)}>
            <IconifyIcon icon="ph:trash" />
          </IconButton>
        </Stack>
      ),
    },
  ]
}

const initialPage: PageFilter<ListDeviceFilter> = {
  page: 0,
  pageSize: 10,
}

export default function Page() {
  const allowCreate = can([Access.DEVICE.CREATE])
  const allowDelete = can([Access.DEVICE.DELETE])

  const [createSerial, setCreateSerial] = useState<string>()
  const [deleteSerial, setDeleteSerial] = useState<string>()

  const [rowCount, setRowCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState(initialPage)

  const { data: _list, refetch: refectUnDevice, isLoading, isSuccess } = useListUnDevice({ params: paginationModel })

  const onCreate = (serial: string) => {
    if (allowCreate) {
      setCreateSerial(serial)
    }
  }

  const onDelete = (id: string) => {
    if (allowDelete) {
      setDeleteSerial(id)
    }
  }

  const onClose = () => {
    setCreateSerial(undefined)
    setDeleteSerial(undefined)
  }

  const columns = renderColumns({ onCreate, onDelete })

  useEffect(() => {
    if (isSuccess)
      if (_list?.paginate.total) setRowCount(_list.paginate.total || 0)
      else setRowCount(0)
  }, [_list?.paginate, isSuccess])

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader
            title="Unregistered Devices"
            subheader="Manage device that are not yet registered in the system"
          />
          <Divider />
          <TableHeader
            title="Search"
            defaultOptions={{
              serial: '',
            }}
            values={{
              serial: paginationModel.filter?.serial,
            }}
            changeOptions={(data: { serial: string }) => setPaginationModel((s) => ({ ...s, filter: data }))}
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

      {createSerial && <CreateDevice open={Boolean(createSerial)} serial={createSerial} onClose={onClose} />}

      {deleteSerial && (
        <DeleteDevice
          open={Boolean(deleteSerial)}
          onRefecthDevice={refectUnDevice}
          deviceId={deleteSerial}
          onClose={onClose}
        />
      )}
    </Grid>
  )
}
