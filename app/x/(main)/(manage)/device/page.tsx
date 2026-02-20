'use client'
import { Alert, Button, Card, CardHeader, Chip, Divider, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { format } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { can } from '~/core/components/acl/access'
import IconifyIcon from '~/core/components/icon'
import { Access } from '~/core/constants'
import { DeviceData, ListDeviceFilter, useDeviceSummaries, useListDevice } from '~/query/device'
import { PageFilter } from '~/types/axios'
import StatsWithBorder from '../../../_components/CardStatistics'
import Configure from './_components/Configure'
import TableHeader from './_components/TableHeader'

interface CellType {
  row: DeviceData
}

const renderColumns = ({ onConfigure }: { onConfigure: (item: string) => void }): GridColDef[] => {
  return [
    {
      flex: 0.2,
      minWidth: 180,
      field: 'serial',
      headerName: 'Info',
      renderCell: ({ row }: CellType) => {
        return (
          <div className="flex flex-col">
            <Typography variant="body1" noWrap>
              {row.name || '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.serial}
            </Typography>
          </div>
        )
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'location',
      headerName: 'Location',
      renderCell: ({ row }: CellType) => {
        return <Typography>{row.location || '-'}</Typography>
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
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
      flex: 0.15,
      minWidth: 150,
      field: 'created_at',
      headerName: 'Created At',
      renderCell: ({ row }: CellType) => {
        return <Typography>{row.createdAt ? format(row.createdAt, 'dd MMM yyyy, HH:mm') : '-'}</Typography>
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Button onClick={() => onConfigure(row.id)} size="small" startIcon={<IconifyIcon icon="ph:gear-six" />}>
          Detail
        </Button>
      ),
    },
  ]
}

const initialPage: PageFilter<ListDeviceFilter> = {
  page: 0,
  pageSize: 10,
}

export default function Page() {
  const allowRead = can([Access.DEVICE.READ]) ?? false
  const allowCreate = can([Access.DEVICE.CREATE])

  const params = useSearchParams()
  const router = useRouter()

  const [rowConfigure, setRowConfigure] = useState<string>()
  const [rowCreate, setRowCreate] = useState<boolean>(false)
  const [rowCount, setRowCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState(initialPage)

  const { data: _list, isLoading, isSuccess } = useListDevice({ params: paginationModel })
  const { data: _summaries } = useDeviceSummaries({
    enabled: isSuccess,
  })

  const { totalOffline, totalOnline, totalUnregister } = useMemo(() => {
    return {
      totalUnregister: _summaries?.result.totalUnregister || 0,
      totalOnline: _summaries?.result.totalOnline || 0,
      totalOffline: _summaries?.result.totalOffline || 0,
      totalDevices: _summaries?.result.totalDevices || 0,
    }
  }, [_summaries])

  const onConfigure = (id: string) => {
    router.push(`/x/device?more=${id}`)
  }

  const onBack = () => {
    router.push('/x/device')
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

  const onToggleStatus = (status: string) => {
    setPaginationModel((s) => ({ ...s, filter: { ...s.filter, status: status === s.filter?.status ? '' : status } }))
  }

  return (
    <Grid container spacing={3}>
      {!rowConfigure && totalUnregister > 0 && allowRead && (
        <Grid size={12}>
          <Alert
            action={
              <Button onClick={() => router.push('/x/device-unlist')} color="inherit" size="small">
                View
              </Button>
            }
            sx={{ mb: 2 }}
            color="warning"
          >
            {totalUnregister > 1
              ? `There are ${totalUnregister} devices waiting to be registered!`
              : `There is ${totalUnregister} device wating to be regisetered!`}
          </Alert>
        </Grid>
      )}

      {!rowConfigure && (
        <Grid size={12}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsWithBorder
                avatarIcon="ph:car-duotone"
                stats={totalOnline}
                title="Online Device"
                lastUpdate={new Date()}
                color="success"
                active={paginationModel.filter?.status === 'online'}
                onClick={() => onToggleStatus('online')}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatsWithBorder
                avatarIcon="ph:car-duotone"
                stats={totalOffline}
                title="Offline Device"
                lastUpdate={new Date()}
                color="error"
                active={paginationModel.filter?.status === 'offline'}
                onClick={() => onToggleStatus('offline')}
              />
            </Grid>
          </Grid>
        </Grid>
      )}

      {rowConfigure ? (
        <Grid size={{ xs: 12 }}>
          <Configure row={rowConfigure} onClose={onBack} />
        </Grid>
      ) : null}

      {!rowConfigure ? (
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="Device Management" />
            <Divider />
            <TableHeader
              title="Search"
              defaultOptions={{ name: '', serial: '' }}
              values={{ name: paginationModel.filter?.name, serial: paginationModel.filter?.serial }}
              changeOptions={(data) => setPaginationModel((s) => ({ ...s, filter: data }))}
            />
            <DataGrid
              loading={isLoading}
              rows={_list?.result || []}
              rowCount={rowCount}
              columns={columns}
              disableColumnFilter
              rowSelection={false}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: initialPage } }}
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
