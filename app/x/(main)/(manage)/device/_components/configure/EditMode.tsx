import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, FormControl, FormHelperText, Grid, TextField } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { DeviceData, filename, useUpdateDevice } from '~/query/device'

const schema = z.object({
  name: z.string().nonempty('Name is required'),
  location: z.string().nonempty('Location is required'),
})
const defaultValues: z.infer<typeof schema> = {
  name: '',
  location: '',
}
const EditMode = ({ detail, onClose, isLoading }: { detail: DeviceData; onClose: () => void; isLoading?: boolean }) => {
  const query = useQueryClient()
  const { mutate: update, isPending: isUpdating } = useUpdateDevice({
    onSuccess: async () => {
      handleClose()
      query.invalidateQueries({ queryKey: [filename, 'list'] })
      query.invalidateQueries({ queryKey: [filename, 'find'] })
      toast.success('Device updated successfully!')
    },
    onError: ({ response }) => {
      toast.error(response?.data?.message || 'Failed to update device!')
    },
  })

  const {
    reset,
    control,
    handleSubmit,

    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    update({ id: detail.id, body: data })
  }

  const handleClose = async () => {
    if (onClose) onClose()

    reset()
  }

  React.useEffect(() => {
    if (detail) {
      setValue('name', detail.name)
      setValue('location', detail.location)
    }
  }, [detail, setValue])
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    required
                    disabled={isLoading || isUpdating}
                    label={'Device Name'}
                    placeholder="Enter device name..."
                    inputProps={{ style: { fontSize: '0.875rem', color: 'text.caption', lineHeight: 'normal' } }}
                    {...field}
                  />
                )}
              />
              {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    required
                    disabled={isLoading || isUpdating}
                    label={'Location'}
                    placeholder="Enter device location..."
                    inputProps={{ style: { fontSize: '0.875rem', color: 'text.caption', lineHeight: 'normal' } }}
                    {...field}
                  />
                )}
              />
              {errors.location && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.location.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button fullWidth disabled={isLoading || isUpdating} variant="outlined" type="submit">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default EditMode
