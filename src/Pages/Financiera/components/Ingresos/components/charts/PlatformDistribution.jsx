import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';

const PlatformStat = ({ platform, value, percentage, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircleIcon sx={{ color, fontSize: 10 }} />
        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
          {platform}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#00FFD1' }}>
        ${value.toLocaleString()}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={percentage}
      sx={{
        height: 4,
        borderRadius: 2,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        '& .MuiLinearProgress-bar': {
          bgcolor: color,
          borderRadius: 2,
        },
      }}
    />
  </Box>
);

const PlatformDistribution = ({ platformStats, colors }) => (
  <Paper
    elevation={0}
    sx={{
      bgcolor: '#2C2C2C',
      p: 3,
      borderRadius: 2,
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <Typography variant="subtitle1" sx={{ color: '#FFFFFF', mb: 3 }}>
      Distribución por Plataforma
    </Typography>
    <Box>
      {platformStats.map((platform) => (
        <PlatformStat
          key={platform.name}
          platform={platform.name}
          value={platform.total}
          percentage={platform.percentage}
          color={colors[platform.name]}
        />
      ))}
    </Box>
  </Paper>
);

export default PlatformDistribution;
