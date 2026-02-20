import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Menu, MenuItem } from '@mui/material'

import { useQueryClient } from '@tanstack/react-query'
import { confirm } from 'material-ui-confirm'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import { join } from 'path'
import React from 'react'
import toast from 'react-hot-toast'
import Loading from '~/components/misc/loading'
import { can } from '~/core/components/acl/access'
import IconifyIcon from '~/core/components/icon'
import { Access } from '~/core/constants'
import { filename, useDeleteDevice, useFindDevice } from '~/query/device'
import EditMode from './configure/EditMode'
import Info from './configure/Info'

const Configure = ({ row, onClose }: { row: string; onClose: () => void }) => {
  const [editMode, setEditMode] = React.useState(false)
  const queryClient = useQueryClient()
  const { data, isLoading: isFinding } = useFindDevice({ params: { id: row } })
  const detail = data?.result
  const { mutate: deleteData, isPending: isDeleting } = useDeleteDevice({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [join(filename, 'list')] })
      toast.success('Device has been deleted!')
      onClose()
    },
    onError: (err) => {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to delete device!')
    },
  })

  const onActionDelete = (id: string) => {
    confirm({ title: 'Are you sure ?', description: "You can't undo this change" }).then(({ confirmed }) => {
      if (confirmed) deleteData(id)
    })
  }

  const menuMoreState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <Card>
          <CardHeader
            title={editMode ? 'Edit Device' : 'Device Information'}
            action={
              <Box display="flex" gap={1}>
                <Button variant="outlined" startIcon={<IconifyIcon icon="bx:arrow-back" />} onClick={onClose}>
                  Back
                </Button>
                {editMode ? (
                  <Button
                    variant="outlined"
                    disabled={isDeleting}
                    startIcon={<IconifyIcon icon="mdi:cancel-bold" />}
                    onClick={() => setEditMode(!editMode)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <>
                    {can([Access.DEVICE.UPDATE]) && (
                      <Button
                        variant="outlined"
                        disabled={isDeleting}
                        startIcon={<IconifyIcon icon="bx:edit" />}
                        onClick={() => setEditMode(!editMode)}
                      >
                        Edit
                      </Button>
                    )}
                    {can([Access.DEVICE.DELETE]) && (
                      <Button
                        variant="outlined"
                        sx={{ px: '7px', minWidth: 'unset' }}
                        disabled={isDeleting}
                        {...bindTrigger(menuMoreState)}
                      >
                        <IconifyIcon icon="bx:dots-vertical" />
                      </Button>
                    )}
                  </>
                )}
              </Box>
            }
          />
          <Divider />
          <CardContent>
            {isFinding && <Loading />}
            {!isFinding && editMode && detail && <EditMode detail={detail} onClose={() => setEditMode(false)} />}
            {!isFinding && !editMode && <Info detail={detail} />}
          </CardContent>
          {detail && (
            <Menu
              {...bindMenu(menuMoreState)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {can([Access.DEVICE.DELETE]) && (
                <MenuItem
                  disabled={isDeleting}
                  onClick={() => onActionDelete(detail.id)}
                  sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem' }, color: 'error.main' }}
                >
                  <IconifyIcon icon="ph:trash" />
                  Delete
                </MenuItem>
              )}
            </Menu>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default Configure
