'use client'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'

const items = [
  {
    icon: <MicRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Voice Detection',
    description:
      'Analyze sales conversations with advanced voice detection technology to understand customer interactions.',
  },
  {
    icon: <AssessmentRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Performance Reports',
    description: 'Get detailed performance reports to evaluate and improve sales strategies and outcomes.',
  },
  {
    icon: <InsightsRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Actionable Insights',
    description: 'Gain actionable insights from sales data to make informed decisions and drive growth.',
  },
  {
    icon: <TrendingUpRoundedIcon sx={{ color: 'text.secondary' }} />,
    title: 'Sales Trends',
    description: 'Identify sales trends and patterns to optimize your sales approach and increase conversions.',
  },
]

export default function SideContent() {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignSelf: 'center',
        gap: 4,
        maxWidth: 450,
      }}
    >
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  )
}
