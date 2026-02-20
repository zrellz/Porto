'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import ImageInput from '~/components/form/image-input'
import { URL_PATHS } from '~/core/constants'

import { useFindProfile, useUpdateProfile } from '~/query/account'

type InputForm = {
  name: string
  email: string
  photo?: File
}

const schema = z.object({
  name: z.string().nonempty('name is required'),
  email: z.string().nonempty('email is required'),
  photo: z
    .instanceof(File)
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), 'Unsupported format')
    .optional(),
})

const defaultValues: InputForm = {
  name: '',
  email: '',
}

const General = () => {
  const router = useRouter()
  const pathmane = usePathname()
  const { data, update: updateSession } = useSession()

  const [formId, setFormId] = React.useState<string>('')
  const [userId, setUserId] = React.useState<string>('')

  const [imageView, setImageView] = React.useState<string>()

  const { data: _data, refetch } = useFindProfile()

  const { mutate: update, isPending: isUpdating } = useUpdateProfile({
    onSuccess: async (response) => {
      refetch()
      const user = response.result
      updateSession({ ...data, user: { ...data?.user, image: user.photoUrl, name: user.name, email: user.email } })
      toast.success('Profile updated successfully!')
      router.replace(`${pathmane}`)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile!')
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })
  const image = watch('photo')

  const onSubmit = (data: InputForm) => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
    const callbackUrl = `${origin}/${URL_PATHS.EMAIL_CHANGE}`
    update({
      id: userId,
      body: { ...data, callbackUrl },
    })
  }

  React.useEffect(() => {
    const data = _data?.result
    if (data) {
      setUserId(data.id)
      setValue('name', data.name)
      setValue('email', data.email)
    }
  }, [_data, setValue])
  React.useEffect(() => {
    if (image) {
      setImageView((s) => {
        if (s) URL.revokeObjectURL(s)
        return URL.createObjectURL(image)
      })
    } else {
      setImageView((s) => {
        if (s) URL.revokeObjectURL(s)
        if (_data?.result?.photoUrl) return _data?.result.photoUrl
        return '/images/avatars/1.png'
      })
    }
  }, [_data?.result?.photoUrl, image])
  React.useEffect(() => {
    setFormId(`form-${Math.random().toString()}`)
  }, [])

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} style={{ margin: '0.25rem' }}>
      <Card sx={{ mb: 3, border: ({ palette }) => `1px solid ${palette.divider}` }}>
        <CardHeader sx={{ mb: 4 }} title="Change User Info" subheader="Update your account information." />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <Controller
                  name="photo"
                  control={control}
                  render={({ field }) => (
                    <ImageInput
                      src={imageView}
                      disabled={isUpdating}
                      onChange={field.onChange}
                      error={errors?.photo?.message}
                      maxFileSize={1024 * 1024 * 1}
                      label="Profile Picture"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth disabled={isUpdating}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      size="small"
                      value={value}
                      disabled={isUpdating}
                      label="Your Name"
                      onChange={onChange}
                      placeholder="Insert name"
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth disabled={isUpdating}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      size="small"
                      disabled={isUpdating || !_data?.result?.emailVerifiedAt}
                      value={value}
                      label="Insert Email"
                      onChange={onChange}
                      placeholder="Insert email"
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {!_data?.result?.emailVerifiedAt && (
                  <FormHelperText sx={{ color: 'text.secondary' }}>
                    Your email is not verified. Please verify your email to change it.
                  </FormHelperText>
                )}
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 4 }} disableSpacing>
          <Box flex={1}>You can change this information anytime you want.</Box>
          <Button size="small" type="submit" variant="contained" disabled={isUpdating} form={formId}>
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}

export default General
