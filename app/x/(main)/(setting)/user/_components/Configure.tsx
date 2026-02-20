import { Box, Button, Card, CardContent, CardHeader, Divider, Menu, MenuItem } from '@mui/material'

import { useQueryClient } from '@tanstack/react-query'
import { confirm } from 'material-ui-confirm'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import { join } from 'path'
import React from 'react'
import toast from 'react-hot-toast'
import Loading from '~/components/misc/loading'
import { can } from '~/core/components/acl/access'
import IconifyIcon from '~/core/components/icon'
import { Access, URL_PATHS } from '~/core/constants'
import { filename, useDeleteUser, useFindUser, useResendActivationUser } from '~/query/user'
import EditMode from './configure/EditMode'
import Info from './configure/Info'

const Configure = ({ row, onClose }: { row: string; onClose: () => void }) => {
  const [editMode, setEditMode] = React.useState(false)
  const queryClient = useQueryClient()
  const { data, isLoading: isFinding } = useFindUser({ params: { id: row } })
  const detail = data?.result
  const { mutate: deleteData, isPending: isDeleting } = useDeleteUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [join(filename, 'list')] })
      toast.success('User has been deleted!')
      onClose()
    },
    onError: (err) => {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to delete user!')
    },
  })
  const { mutate: resendActivation, isPending: isResend } = useResendActivationUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [join(filename, 'list')] })
      toast.success('The email activation has been resend!')
      onClose()
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to resend activation!')
    },
  })

  const onActionDelete = (id: string) => {
    confirm({ title: 'Are you sure ?', description: "You can't undo this change" }).then(({ confirmed }) => {
      if (confirmed) deleteData(id)
    })
  }
  const onActionResend = (id: string) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
    const callbackUrl = `${origin}/${URL_PATHS.ACCOUNT_ACTIVATION}`
    confirm({ title: 'Are you sure ?', description: 'Resend activation for this email' }).then(({ confirmed }) => {
      if (confirmed) resendActivation({ id, callbackUrl })
    })
  }
  const menuMoreState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

  return (
    <Card>
      <CardHeader
        title={editMode ? 'Edit User Account' : 'User Account Details'}
        action={
          <Box display="flex" gap={1}>
            <Button variant="outlined" startIcon={<IconifyIcon icon="bx:arrow-back" />} onClick={onClose}>
              Back
            </Button>
            {editMode ? (
              <Button
                variant="outlined"
                disabled={isDeleting && isResend}
                startIcon={<IconifyIcon icon="mdi:cancel-bold" />}
                onClick={() => setEditMode(!editMode)}
              >
                Cancel
              </Button>
            ) : (
              <>
                {can([Access.ACCOUNT.UPDATE]) && (
                  <Button
                    variant="outlined"
                    disabled={isDeleting && isResend}
                    startIcon={<IconifyIcon icon="bx:edit" />}
                    onClick={() => setEditMode(!editMode)}
                  >
                    Edit
                  </Button>
                )}
                {(can([Access.ACCOUNT.DELETE]) || !detail?.emailVerifiedAt) && (
                  <Button
                    variant="outlined"
                    sx={{ px: '7px', minWidth: 'unset' }}
                    disabled={isDeleting && isResend}
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
          {!detail.emailVerifiedAt && (
            <MenuItem
              disabled={isResend || isDeleting}
              onClick={() => onActionResend(detail.id)}
              sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
            >
              <IconifyIcon icon="lsicon:send-filled" />
              Resend Verification
            </MenuItem>
          )}
          {can([Access.ACCOUNT.DELETE]) && (
            <MenuItem
              disabled={isResend || isDeleting}
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
  )
}

export default Configure
