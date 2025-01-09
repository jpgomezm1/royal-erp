import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  List,
  ListItem,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
  Circle as CircleIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = {
  success: ['#00FFD1', '#00E5BB', '#00CCB7', '#00B3A3', '#009A8F', '#00807B'],
  error: ['#FF6347', '#FF4500', '#FF3300', '#FF2200', '#FF1100', '#FF0000']
};

const CustomLabel = ({ title, value, color, percentage }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircleIcon sx={{ color, fontSize: 10 }} />
        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2" sx={{ color: color }}>
          ${value.toLocaleString()}
        </Typography>
        <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
          {percentage.toFixed(1)}%
        </Typography>
      </Box>
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
          borderRadius: 2
        }
      }}
    />
  </Box>
);

const ResultadosDesglose = ({ title, data, total, colorScheme = 'success' }) => {
  if (!data || !total) return null;

  const items = Object.entries(data).map(([key, value], index) => ({
    name: key,
    value: value,
    percentage: (value / total) * 100,
    color: COLORS[colorScheme][index % COLORS[colorScheme].length]
  })).sort((a, b) => b.value - a.value);

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#2C2C2C',
        p: 3,
        height: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PieChartIcon sx={{ color: COLORS[colorScheme][0] }} />
          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: COLORS[colorScheme][0] }}>
          ${total.toLocaleString()}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Chart */}
        <Box sx={{ width: '40%', height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {items.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Labels */}
        <Box sx={{ width: '60%' }}>
          {items.map((item, index) => (
            <CustomLabel
              key={item.name}
              title={item.name}
              value={item.value}
              color={item.color}
              percentage={item.percentage}
            />
          ))}
        </Box>
      </Box>

      {/* Summary */}
      <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
          {items.length} categorías analizadas
        </Typography>
      </Box>
    </Paper>
  );
};

export default ResultadosDesglose;