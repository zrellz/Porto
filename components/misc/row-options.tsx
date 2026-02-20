import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Icon from '~/core/components/icon'

export const RowPopperOptions = ({
  id,
  view,
  onDelete,
}: {
  id: number | string
  view?: boolean
  onDelete?: (id: number | string) => void
}) => {
  // ** Hooks
  const pathname = usePathname()
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

  const handleViewOpen = () => {
    setAnchorEl(null)
    router.push(`${pathname}?more=${id}`)
  }
  const handleEditOpen = () => {
    setAnchorEl(null)
    router.push(`${pathname}?edit=${id}`)
  }

  const handleDelete = () => {
    if (onDelete) onDelete(id)
    handleRowPopperOptionsClose()
  }

  return (
    <>
      <IconButton size="small" onClick={handleRowPopperOptionsClick}>
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
        {view && (
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleViewOpen}>
            <Icon icon="mdi:eye-outline" fontSize={20} />
            View
          </MenuItem>
        )}
        <MenuItem onClick={handleEditOpen} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
          Edit
        </MenuItem>
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
export const RowInlineOptions = ({
  id,
  view,
  onDelete,
}: {
  id: number | string
  view?: boolean
  onDelete?: (id: number | string) => void
}) => {
  // ** Hooks
  const router = useRouter()
  const pathname = usePathname()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowPopperOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowPopperOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleViewOpen = () => {
    setAnchorEl(null)
    router.push(`${pathname}?more=${id}`)
  }
  const handleEditOpen = () => {
    setAnchorEl(null)
    router.push(`${pathname}?edit=${id}`)
  }

  const handleDelete = () => {
    if (onDelete) onDelete(id)
    handleRowPopperOptionsClose()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.125rem' }}>
      {view && (
        <IconButton onClick={handleViewOpen}>
          <Icon icon="mdi:eye-outline" fontSize={20} />
        </IconButton>
      )}
      <IconButton onClick={handleEditOpen}>
        <Icon icon="mdi:pencil-outline" fontSize={20} />
      </IconButton>
      {onDelete && (
        <IconButton onClick={handleDelete}>
          <Icon icon="mdi:delete-outline" fontSize={20} />
        </IconButton>
      )}
    </Box>
  )
}
