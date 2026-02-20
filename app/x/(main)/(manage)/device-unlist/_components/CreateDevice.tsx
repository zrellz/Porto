import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { filename, useCreateDevice } from '~/query/device'

interface CreateDeviceProps {
  open: boolean
  serial: string
  onClose: () => void
}

interface FormData {
  serial: string
  name: string
  location: string
}

export default function CreateDevice({ open, serial, onClose }: CreateDeviceProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<FormData>({
    serial: '',
    name: '',
    location: '',
  })

  const { mutate: createDevice, isPending } = useCreateDevice({
    onSuccess: () => {
      toast.success('Device registered successfully')
      queryClient.invalidateQueries({ queryKey: [filename, 'list-unregister'] })
      queryClient.invalidateQueries({ queryKey: [filename, 'summaries'] })
      onClose()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to register device')
    },
  })

  useEffect(() => {
    if (open && serial) {
      setFormData({
        serial,
        name: '',
        location: '',
      })
    }
  }, [open, serial])

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.location.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    createDevice({
      serial: formData.serial,
      name: formData.name.trim(),
      location: formData.location.trim(),
    })
  }

  const handleClose = () => {
    if (!isPending) {
      setFormData({ serial: '', name: '', location: '' })
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register Device</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={12}>
            <TextField fullWidth label="Serial Number" value={formData.serial} disabled variant="outlined" />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Serial number is automatically filled and cannot be changed
            </Typography>
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter device name..."
              required
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter device location..."
              required
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isPending || !formData.name.trim() || !formData.location.trim()}
        >
          {isPending ? 'Registering...' : 'Register Device'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
