'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
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
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useFindProfile, useUpdatePassword } from '~/query/account'

interface State {
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmNewPassword: boolean
}

const schema = z
  .object({
    currentPassword: z.string().min(8, 'Current password must be at least 8 characters'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: z.string().min(8, 'Confirm new password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm new password must be the same',
  })

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

const Security = () => {
  const router = useRouter()
  const pathmane = usePathname()
  const { data } = useSession()
  const auth = data?.session

  const [formId, setFormId] = React.useState<string>('')
  const [imgSrc, setImgSrc] = React.useState<string>('')
  const [imgDef, setImgDef] = React.useState<string>('')
  const [userId, setUserId] = React.useState<string>('')

  const { data: _data, refetch } = useFindProfile({})

  const { mutate: update, isPending: isUpdating } = useUpdatePassword({
    onSuccess: async () => {
      refetch()
      toast.success('Password updated successfully!')
      router.replace(`${pathmane}`)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update password!')
    },
  })

  const [values, setValues] = useState<State>({
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmNewPassword: false,
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: any) => {
    update({
      id: userId,
      body: {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      },
    })
  }

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  React.useEffect(() => {
    const data = _data?.result
    if (data) {
      setUserId(data.id)
      if (data.photoUrl) {
        setImgSrc(data.photoUrl)
        setImgDef(data.photoUrl)
      }
    } else {
      setImgDef('/images/avatars/1.png')
      setImgSrc('/images/avatars/1.png')
    }
  }, [_data])

  React.useEffect(() => {
    setFormId(`form-${Math.random().toString()}`)
  }, [])

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} style={{ margin: '0.25rem' }}>
      <Card sx={{ mb: 3, border: ({ palette }) => `1px solid ${palette.divider}` }}>
        <CardHeader sx={{ mb: 4 }} title="Change Password" subheader="Update your account password." />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel error={Boolean(errors.currentPassword)}>Current Password</InputLabel>
                <Controller
                  name="currentPassword"
                  control={control}
                  render={({ field }) => (
                    <OutlinedInput
                      {...field}
                      label="Current Password"
                      error={Boolean(errors.currentPassword)}
                      type={values.showCurrentPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleClickShowCurrentPassword}
                          >
                            <Icon
                              icon={values.showCurrentPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                              fontSize={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.currentPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.currentPassword.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel error={Boolean(errors.newPassword)}>New Password</InputLabel>
                    <Controller
                      name="newPassword"
                      control={control}
                      render={({ field }) => (
                        <OutlinedInput
                          {...field}
                          label="New Password"
                          error={Boolean(errors.newPassword)}
                          type={values.showNewPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleClickShowNewPassword}
                              >
                                <Icon
                                  icon={values.showNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                  fontSize={20}
                                />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.newPassword && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel error={Boolean(errors.confirmNewPassword)}>Confirm New Password</InputLabel>
                    <Controller
                      name="confirmNewPassword"
                      control={control}
                      render={({ field }) => (
                        <OutlinedInput
                          {...field}
                          size="small"
                          label="Confirm New Password"
                          error={Boolean(errors.confirmNewPassword)}
                          type={values.showConfirmNewPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleClickShowConfirmNewPassword}
                              >
                                <Icon
                                  icon={values.showConfirmNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'}
                                  fontSize={20}
                                />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.confirmNewPassword && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmNewPassword.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 4 }} disableSpacing>
          <Box flex={1}>Please use secure password in order to protect your account.</Box>
          <Button size="small" type="submit" variant="contained" disabled={isUpdating} form={formId}>
            Update
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}

export default Security
