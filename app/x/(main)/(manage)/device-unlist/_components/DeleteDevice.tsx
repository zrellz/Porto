import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import { useDeleteUnDevice } from '~/query/device'

interface DeleteDeviceProps {
  open: boolean
  deviceId: string
  onRefecthDevice: () => void
  onClose: () => void
}

export default function DeleteDevice({ open, onRefecthDevice, deviceId, onClose }: DeleteDeviceProps) {
  const { mutate: deleteDevice, isPending: isPendingDelete } = useDeleteUnDevice({
    onSuccess: () => {
      toast.success('Deleted successfully...')

      onRefecthDevice()

      onClose()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete')
    },
  })

  const handleSubmit = () => {
    if (deviceId) deleteDevice(deviceId)
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ py: 3 }}>Delete Device</DialogTitle>

      <DialogContent>
        <Typography>Are you sure you want to delete this device?</Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={isPendingDelete}>
          Cancel
        </Button>

        <Button onClick={handleSubmit} variant="contained" disabled={isPendingDelete}>
          {isPendingDelete ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
