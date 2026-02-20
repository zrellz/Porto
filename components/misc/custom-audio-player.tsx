import { Box, IconButton, Slider, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import IconifyIcon from '~/core/components/icon'

type CustomAudioPlayerProps = {
  src: string
  onChangeDuration?: (duration: number) => void
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ src, onChangeDuration }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSliderChange = (event: Event, value: number | number[]) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = value as number
    }
  }
  const handleTimeBegin = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = 0
    }
  }

  const handleTImeEnd = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = audio.duration
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
    }
  }
  const handleTImeBackward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime -= 5
    }
  }

  const handleTimeForward = () => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime += 5
    }
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (audio) {
      onChangeDuration?.(audio.duration)
      setDuration(audio.duration)
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio && src) {
      audio.src = src
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('ended', () => setIsPlaying(false))
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('ended', () => setIsPlaying(false))
      }
    }
  }, [src])

  return (
    <Box className="rounded-xl bg-white drop-shadow-md dark:bg-slate-800">
      <audio ref={audioRef} className={`mx-auto mt-2 block hidden w-full max-w-md`} controls></audio>
      <div className="items-center space-y-6 rounded-t-xl border-b border-slate-100 bg-primary/10 p-4 pb-6 dark:border-slate-500 dark:bg-slate-800 sm:space-y-8 sm:p-10 sm:pb-8 lg:space-y-6 lg:p-6 xl:space-y-8 xl:p-10 xl:pb-8">
        <div className="space-y-2">
          <div className="relative">
            <Slider value={currentTime} max={duration} onChange={handleSliderChange} />
          </div>
          <div className="flex justify-between text-sm font-medium tabular-nums leading-6">
            <Typography color="primary.main">
              {Math.floor(currentTime / 60)}:
              {Math.floor(currentTime % 60)
                .toString()
                .padStart(2, '0')}
            </Typography>
            <Typography color="text.primary">
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60)
                .toString()
                .padStart(2, '0')}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex items-center rounded-b-xl bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200">
        <div className="flex flex-auto items-center justify-evenly">
          <IconButton type="button" sx={{ color: 'text.primary' }} aria-label="Reset" onClick={handleTimeBegin}>
            <IconifyIcon icon="mingcute:skip-previous-fill" fontSize="1.75rem" />
          </IconButton>
          <IconButton
            type="button"
            sx={{ color: 'text.primary' }}
            aria-label="Forward 10 seconds"
            onClick={handleTImeBackward}
          >
            <IconifyIcon icon="tabler:rewind-backward-5" fontSize="1.75rem" />
          </IconButton>
        </div>
        <IconButton
          type="button"
          className="mx-auto flex h-20 w-20 flex-none items-center justify-center rounded-full text-slate-900 shadow-md ring-1 ring-slate-900/5 hover:bg-slate-200 dark:bg-slate-100 dark:text-slate-700 dark:hover:text-slate-800"
          sx={({ palette }) => ({
            color: palette.mode === 'light' ? 'white' : 'text.primary',
            bgcolor: palette.mode === 'light' ? 'primary.main' : 'white',
            mt: -2,
            mb: -2,
            '&:hover': {
              bgcolor: palette.mode === 'light' ? 'primary.dark' : 'white',
            },
          })}
          aria-label="Pause"
          onClick={togglePlayPause}
        >
          <IconifyIcon icon={isPlaying ? 'mdi:pause' : 'mdi:play'} fontSize="3rem" />
        </IconButton>
        <div className="flex flex-auto items-center justify-evenly">
          <IconButton
            type="button"
            sx={{ color: 'text.primary' }}
            aria-label="Forward 5 seconds"
            onClick={handleTimeForward}
          >
            <IconifyIcon icon="tabler:rewind-forward-5" fontSize="1.75rem" />
          </IconButton>
          <IconButton type="button" sx={{ color: 'text.primary' }} aria-label="Reset" onClick={handleTImeEnd}>
            <IconifyIcon icon="mingcute:skip-forward-fill" fontSize="1.75rem" />
          </IconButton>
        </div>
      </div>
    </Box>
  )
}

export default CustomAudioPlayer
