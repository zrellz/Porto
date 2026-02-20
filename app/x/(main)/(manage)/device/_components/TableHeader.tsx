// ** MUI Imports
import { zodResolver } from '@hookform/resolvers/zod'
import { Divider, FormControl, Grid, Popover, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

// ** Icon Imports
import Icon from '~/core/components/icon'

interface TableHeaderProps {
  title?: string
  values: SubmitValue
  defaultOptions: SubmitValue
  changeOptions: (data: SubmitValue) => void
  onCreate?: () => void
}

const schema = z.object({
  name: z.string().optional(),
  serial: z.string().optional(),
})

export type SubmitValue = z.infer<typeof schema>

const defaultValues: SubmitValue = {}

const TableHeader = (props: TableHeaderProps) => {
  // Props

  const {
    reset,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const { changeOptions, values } = props

  const menuMoreState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

  const onSubmit = React.useCallback(
    (data: SubmitValue) => {
      changeOptions(data)
      menuMoreState.close()
    },
    [changeOptions, menuMoreState],
  )
  const onReset = React.useCallback(() => {
    changeOptions(props.defaultOptions)
    menuMoreState.close()
  }, [changeOptions, menuMoreState, props.defaultOptions])

  React.useEffect(() => {
    if (menuMoreState.isOpen) {
      setValue('name', values.name)
      setValue('serial', values.serial)
    }
  }, [values, menuMoreState.isOpen, setValue])

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
        <Box flex={1}>
          <Button variant="outlined" startIcon={<Icon icon="mdi:cogs" fontSize={20} />} {...bindTrigger(menuMoreState)}>
            Filter
          </Button>
        </Box>
        {props.onCreate && (
          <Button variant="contained" onClick={props.onCreate}>
            Create New
          </Button>
        )}
      </Box>
      <Popover
        {...bindMenu(menuMoreState)}
        slotProps={{
          paper: {
            sx: { bgcolor: 'background.default', mt: 2, overflowX: 'unset', overflowY: 'unset' },
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ px: 4, py: 2, maxWidth: '15rem' }}>
          <Typography variant="subtitle1" textAlign="center">
            Available Filter
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <Controller
                  name="serial"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      label={'Serial'}
                      placeholder="Device serial..."
                      inputProps={{ style: { fontSize: '0.875rem', color: 'text.caption', lineHeight: 'normal' } }}
                      {...field}
                    />
                  )}
                />
                {errors.serial && <Typography color="error">{errors.serial.message}</Typography>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      label={'Name'}
                      placeholder="Name here..."
                      inputProps={{ style: { fontSize: '0.875rem', color: 'text.caption', lineHeight: 'normal' } }}
                      {...field}
                    />
                  )}
                />
                {errors.name && <Typography color="error">{errors.name.message}</Typography>}
              </FormControl>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, mt: 4 }} />
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Box flex={1}>
              <Button size="small" variant="outlined" onClick={() => onReset()}>
                Reset
              </Button>
            </Box>

            <Button size="small" variant="contained" onClick={handleSubmit(onSubmit)}>
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}

export default TableHeader
