import { Box, FormLabel, styled, Typography } from '@mui/material'

import React from 'react'
import IconifyIcon from '~/core/components/icon'

export type FileUploadProps = {
  imageButton?: boolean
  accept: string
  hoverLabel?: string
  dropLabel?: string
  width?: string
  height?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (event: React.DragEvent<HTMLElement>) => void
}
const RootBox = styled(FormLabel)(({ theme }) => ({
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  borderRadius: '0.5rem',
  border: `1px dashed ${theme.palette.primary.main}`,
  transition: 'opacity 2s',
  '& p, svg': {
    opacity: 0.8,
    color: theme.palette.primary.main,
  },
  '&:hover p,&:hover svg,& img': {
    opacity: 1,
  },
}))

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  imageButton = false,
  hoverLabel = 'Click or drag to upload file',
  dropLabel = 'Drop file here',
  width = '100%',
  height = '100px',

  onChange,
  onDrop,
}) => {
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)
  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true)
    },
    onMouseLeave: () => {
      setIsMouseOver(false)
    },
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
      setLabelText(dropLabel)
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
      setLabelText(hoverLabel)
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      stopDefaults(e)
      setLabelText(hoverLabel)
      setIsDragOver(false)

      onDrop(e)
    },
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event)
  }
  const formId = React.useId()
  return (
    <>
      <input onChange={handleChange} accept={accept} style={{ display: 'none' }} id={formId} type="file" />

      <RootBox
        htmlFor={formId}
        {...dragEvents}
        sx={isDragOver ? { '& img': { opacity: 0.3 }, '& p, svg': { opacity: 1 } } : undefined}
      >
        <Box width={width} height={height} sx={{ pointerEvents: 'none' }}>
          {(!imageButton || isDragOver || isMouseOver) && (
            <Box
              height={height}
              width={width}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'absolute',
              }}
            >
              <IconifyIcon icon="ic:sharp-cloud-upload" fontSize="2.5rem" />
              <Typography>{labelText}</Typography>
            </Box>
          )}
        </Box>
      </RootBox>
    </>
  )
}
