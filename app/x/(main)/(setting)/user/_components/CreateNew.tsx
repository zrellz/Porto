import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { join } from 'path'

import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import ImageInput from '~/components/form/image-input'
import IconifyIcon from '~/core/components/icon'
import { URL_PATHS } from '~/core/constants'
import { useListRole } from '~/query/role'
import { filename, useCreateUser } from '~/query/user'

const schema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().nonempty('Email is required'),
  photo: z
    .instanceof(File)
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), 'Unsupported format')
    .optional(),
  roleId: z.string().uuid().nonempty('Role is required'),
})
const defaultValues: z.infer<typeof schema> = {
  name: '',
  email: '',
  roleId: '',
}
const CreateNew = ({ onClose, isLoading }: { onClose: () => void; isLoading?: boolean }) => {
  const query = useQueryClient()
  const [imageView, setImageView] = React.useState<string>()

  const { data: _roles } = useListRole({ params: { all: 1 } })
  const { mutate: create, isPending: isUpdating } = useCreateUser({
    onSuccess: async () => {
      handleClose()
      query.invalidateQueries({ queryKey: [join(filename, 'list')] })
      query.invalidateQueries({ queryKey: [join(filename, 'find')] })
      toast.success('Account created!')
    },
    onError: ({ response }) => {
      toast.error(response?.data?.message || 'Failed to create account!')
    },
  })

  const {
    reset,
    control,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })
  const image = watch('photo')

  const onSubmit = (data: z.infer<typeof schema>) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
    const callbackUrl = `${origin}/${URL_PATHS.ACCOUNT_ACTIVATION}`
    create({ ...data, callbackUrl })
  }

  const handleClose = async () => {
    if (onClose) onClose()
    query.invalidateQueries({ queryKey: [join(filename, 'list')] })
    reset()
  }
  React.useEffect(() => {
    if (image) {
      setImageView((s) => {
        if (s) URL.revokeObjectURL(s)
        return URL.createObjectURL(image)
      })
    } else {
      setImageView((s) => {
        if (s) URL.revokeObjectURL(s)

        return '/images/avatars/1.png'
      })
    }
  }, [image])

  return (
    <Card>
      <CardHeader
        title="Add User Account"
        action={
          <Box display="flex" gap={1}>
            <Button variant="outlined" startIcon={<IconifyIcon icon="bx:arrow-back" />} onClick={onClose}>
              Back
            </Button>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <Controller
                    name="photo"
                    control={control}
                    render={({ field }) => (
                      <ImageInput
                        src={imageView}
                        disabled={isLoading || isUpdating}
                        onChange={field.onChange}
                        error={errors?.photo?.message}
                        maxFileSize={1024 * 1024 * 1}
                        label="Profile Picture"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        disabled={isLoading || isUpdating}
                        label={'Name'}
                        placeholder="Easy Share"
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
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        disabled={isLoading || isUpdating}
                        label={'Email'}
                        placeholder="easyxxx@xxxx.xxx"
                        inputProps={{ style: { fontSize: '0.875rem', color: 'text.caption', lineHeight: 'normal' } }}
                        {...field}
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl sx={{ mb: 3 }} fullWidth>
                  <InputLabel id="role-select"> Select Role</InputLabel>
                  <Controller
                    name="roleId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        id="select-role"
                        labelId="role-select"
                        label="Select Role"
                        value={value}
                        inputProps={{ placeholder: 'Select Role' }}
                        renderValue={(selected) => {
                          const find = _roles?.result.find((f) => f.id === selected)
                          if (find) return <Chip size="small" key={`chip-${find.id}`} label={find.name} />
                          return null
                        }}
                        error={Boolean(errors.roleId)}
                        onChange={({ target: { value } }) => onChange(value)}
                      >
                        {_roles?.result.map((v, i) => {
                          return (
                            <MenuItem key={`opt-${i}`} value={v.id}>
                              {v.name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button fullWidth disabled={isLoading || isUpdating} variant="outlined" type="submit">
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CreateNew
