import { zodResolver } from '@hookform/resolvers/zod'

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Paper, { PaperProps } from '@mui/material/Paper'
import * as z from 'zod'

import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import IconifyIcon from '~/core/components/icon'
import { useGroupPermission } from '~/query/permission'
import { useCreateRole, useFindRole, useUpdateRole } from '~/query/role'
import Draggable from 'react-draggable'

function DraggablePaper(props: PaperProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null)
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper ref={nodeRef} {...props} />
    </Draggable>
  )
}

type ModalProps = {
  open?: boolean
  onClose?: () => void
  refetch: () => void
  id?: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

type Input = {
  permissionIds?: string[] | undefined
  name: string
  description: string
}
const schema = z.object({
  name: z.string().min(3).nonempty(),
  description: z.string().nonempty(),
  permissionIds: z.array(z.string().nonempty()).optional(),
})

const defaultValues = {
  name: '',
  email: '',
  description: '',
  permissionIds: [],
}
const desiredOrder: string[] = ['read', 'create', 'update', 'delete']

export function ModalCERole({ open, onClose, id, refetch }: ModalProps) {
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = React.useState<boolean>(false)
  const [selectedCheckbox, setSelectedCheckbox] = React.useState<{ id: string; action: string; subject: string }[]>([])
  const [totalPermissions, setTotalPermissions] = React.useState<number>(0)
  const [formId, setFormId] = React.useState<string>('')
  const [maxCols, setMaxCols] = React.useState(0)

  const { data: _role } = useFindRole({
    params: { id: id || '' },
    enabled: open && Boolean(id),
    refetchOnWindowFocus: false,
  })
  const { data: _permissions } = useGroupPermission({ params: { all: 1 }, enabled: open })
  const { mutate: create, isPending: isCreating } = useCreateRole({
    onSuccess: () => {
      handleClose()
      refetch()
      toast.success('Role created successfully !')
    },
    onError: (err) => {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to create new role')
    },
  })
  const { mutate: update, isPending: isUpdating } = useUpdateRole({
    onSuccess: () => {
      handleClose()
      refetch()
      toast.success('Role updated successfully !')
    },
    onError: (err) => {
      console.error(err)
      toast.error(err.response?.data?.message || 'Update failed')
    },
  })

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const handleSelectAllCheckbox = () => {
    const all = (_permissions?.result || []).reduce<{ id: string; action: string; subject: string }[]>((prev, curr) => {
      curr.actions.forEach(({ id, action }) => prev.push({ id, action, subject: curr.subject }))
      return prev
    }, [])
    setSelectedCheckbox((s) => (s.length !== all.length ? all : []))
  }

  const handleClose = () => {
    if (onClose) onClose()
    reset()
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  const togglePermission = (id: string, action: string, subject: string) => {
    const arr = selectedCheckbox
    const permissions = _permissions?.result || []
    if (selectedCheckbox.find((v) => v.id === id)) {
      if (action === 'read') setSelectedCheckbox(arr.filter((v) => v.subject !== subject))
      else setSelectedCheckbox(arr.filter((v) => v.id !== id))
    } else {
      if (action !== 'read') {
        const data = arr.find((v) => v.subject === subject && v.action === 'read')
        if (!data) {
          const perm = permissions.find((a) => a.subject === subject)
          const find = perm?.actions.find((a) => a.action === 'read')
          if (find) arr.push({ id: find.id, action: find.action, subject })
        }
      }
      arr.push({ id, action, subject })
      setSelectedCheckbox([...arr])
    }
  }

  const onSubmit = (data: Input) => {
    if (selectedCheckbox.length === 0) {
      setError('permissionIds', { message: 'Please select at least one permission to continue' })
    } else {
      if (id) {
        update({
          id,
          body: {
            name: data.name,
            description: data.description,
            permissionIds: selectedCheckbox.flatMap((v) => v.id),
          },
        })
      } else {
        create({
          name: data.name,
          description: data.description,
          permissionIds: selectedCheckbox.flatMap((v) => v.id),
        })
      }
    }
  }

  React.useEffect(() => {
    const data = _role?.result
    if (data) {
      setValue('name', data.name)
      setValue('description', data.description || '')
      setSelectedCheckbox(data.permissions?.flatMap(({ id, action, subject }) => ({ id, action, subject })) || [])
    }
  }, [_role, setValue])

  React.useEffect(() => {
    if (_permissions?.result) {
      let maxCount = 0
      const total = _permissions.result.reduce<number>((prev, curr) => {
        const count = curr.actions.length
        if (maxCount < count) maxCount = count
        prev += curr.actions.length
        return prev
      }, 0)
      setMaxCols(maxCount)
      setTotalPermissions(total)
    }
  }, [_permissions])
  React.useEffect(() => {
    setFormId(`form-${Math.random().toString()}`)
  }, [])
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      scroll="body"
      onClose={handleClose}
      open={open || false}
      PaperComponent={DraggablePaper}
    >
      <DialogTitle
        id="draggable-dialog-title"
        sx={{
          textAlign: 'center',
          position: 'relative',
          cursor: 'move',
          userSelect: 'none',
        }}
      >
        <IconButton sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => handleClose()}>
          <IconifyIcon icon="material-symbols:close-rounded" />
        </IconButton>
        <Typography variant="h5" component="span">
          {`${id ? 'Edit' : 'Create'} Role`}
        </Typography>
        <Typography variant="body2">Configure your own role access here.</Typography>{' '}
      </DialogTitle>
      <DialogContent
        sx={{
          pb: (theme) => `${theme.spacing(5)} !important`,
          px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
        }}
      >
        <form id={formId} style={{ margin: '0.25rem' }} onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Name"
                  required
                  onChange={onChange}
                  placeholder="Manager"
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="description"
                  value={value}
                  required
                  label="Note"
                  onChange={onChange}
                  placeholder="Show all available features"
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>
        </form>
        <Typography variant="h6">
          Role Permissions
          <span style={{ color: 'red' }}>*</span>
        </Typography>
        {errors.permissionIds && (
          <FormHelperText sx={{ color: 'error.main' }}>{errors.permissionIds.message}</FormHelperText>
        )}
        <TableContainer style={{ maxHeight: '20rem' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                      alignItems: 'center',
                      textTransform: 'capitalize',
                      '& svg': { ml: 1, cursor: 'pointer' },
                    }}
                  >
                    Administrator Access
                    <Tooltip arrow placement="top" title="Allows a full access to the system">
                      <Box sx={{ display: 'flex' }}>
                        <IconifyIcon icon="mdi:information-outline" fontSize="1rem" />
                      </Box>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell colSpan={maxCols}>
                  <FormControlLabel
                    label="Select All"
                    sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                    control={
                      <Checkbox
                        size="small"
                        onChange={handleSelectAllCheckbox}
                        indeterminate={isIndeterminateCheckbox}
                        checked={selectedCheckbox.length === totalPermissions}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_permissions?.result.map((i, index: number) => {
                const left = maxCols - i.actions.length + 1
                console.log(i.name, left)
                return (
                  <TableRow key={`${i.subject}-${index}`}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        color: (theme) => `${theme.palette.text.primary} !important`,
                      }}
                    >
                      {i.name}
                    </TableCell>

                    {i.actions
                      .toSorted((a, b) => desiredOrder.indexOf(a.action) - desiredOrder.indexOf(b.action))
                      .map((v) => (
                        <TableCell key={`${v.id}-${v.action}`}>
                          <FormControlLabel
                            label={v.action}
                            checked={!!selectedCheckbox.find((sc) => sc.id === v.id)}
                            control={
                              <Checkbox
                                size="small"
                                id={`${i.subject}-${v.action}`}
                                onChange={() => togglePermission(v.id, v.action, i.subject)}
                              />
                            }
                          />
                        </TableCell>
                      ))}
                    <TableCell colSpan={left} />
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: (theme) => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pb: (theme) => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
        }}
      >
        <Box className="demo-space-x">
          <Button
            size="large"
            color="secondary"
            variant="outlined"
            disabled={isCreating || isUpdating}
            onClick={handleClose}
          >
            Back
          </Button>
          <Button size="large" type="submit" variant="contained" disabled={isCreating || isUpdating} form={formId}>
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
