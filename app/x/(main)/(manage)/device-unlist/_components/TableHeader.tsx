import { Button, Grid, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import IconifyIcon from '~/core/components/icon'

interface TableHeaderProps {
  title: string
  defaultOptions: {
    serial: string
  }
  values: {
    serial?: string
  }
  changeOptions: (data: { serial: string }) => void
}

export default function TableHeader({ title, defaultOptions, values, changeOptions }: TableHeaderProps) {
  const [options, setOptions] = useState(defaultOptions)

  useEffect(() => {
    setOptions({
      serial: values.serial || '',
    })
  }, [values])

  const handleSearch = () => {
    changeOptions(options)
  }

  const handleReset = () => {
    setOptions(defaultOptions)
    changeOptions(defaultOptions)
  }

  return (
    <Grid container spacing={2} sx={{ p: 3 }}>
      <Grid size={{ xs: 12, md: 'grow' }}>
        <TextField
          fullWidth
          label="Serial Number"
          value={options.serial}
          onChange={(e) => setOptions({ ...options, serial: e.target.value })}
          placeholder="Search by serial number..."
        />
      </Grid>
      <Grid size={{ xs: 12, md: 'auto' }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button variant="contained" startIcon={<IconifyIcon icon="ph:magnifying-glass" />} onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" startIcon={<IconifyIcon icon="ph:arrow-clockwise" />} onClick={handleReset}>
          Reset
        </Button>
      </Grid>
    </Grid>
  )
}
