import { IconButton, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Icon from '~/core/components/icon'

export const RowPopperOptions = ({
  onEdit,
  onDelete,
  onResend,
}: {
  onEdit?: () => void
  onDelete?: () => void
  onResend?: () => void
}) => {
  // ** Hooks
  const router = useRouter()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowPopperOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowPopperOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEditOpen = () => {
    setAnchorEl(null)
    if (onEdit) onEdit()
    handleRowPopperOptionsClose()
  }

  const handleDelete = () => {
    if (onDelete) onDelete()
    handleRowPopperOptionsClose()
  }
  const handleResend = () => {
    if (onResend) onResend()
    handleRowPopperOptionsClose()
  }

  return (
    <>
      <IconButton size="small" autoFocus onClick={handleRowPopperOptionsClick}>
        <Icon icon="mdi:dots-vertical" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowPopperOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        {onEdit && (
          <MenuItem onClick={handleEditOpen} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon="mdi:pencil-outline" fontSize={20} />
            Edit
          </MenuItem>
        )}
        {onResend && (
          <MenuItem onClick={handleResend} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon="material-symbols:send-rounded" fontSize={20} />
            Resend
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon="mdi:delete-outline" fontSize={20} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  )
}
