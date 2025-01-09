import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
  ButtonGroup,
  Button,
  Divider,
  Grid
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
  Circle as CircleIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Bar,
  ComposedChart
} from 'recharts';

const COLORS = {
  success: ['#00FFD1', '#00E5BB', '#00CCB7', '#00B3A3', '#009A8F', '#00807B'],
  error: ['#FF6347', '#FF4500', '#FF3300', '#FF2200', '#FF1100', '#FF0000']
};

const VIEW_TYPES = {
  PIE: 'pie',
  TREND: 'trend',
  COMPARISON: 'comparison'
};

const CategoryMetric = ({ title, value, previousValue, info }) => {
  const variation = previousValue ? ((value - previousValue) / previousValue) * 100 : null;
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
          {title}
        </Typography>
        {info && (
          <Tooltip title={info} arrow>
            <InfoIcon sx={{ fontSize: 16, color: '#AAAAAA' }} />
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
          ${value.toLocaleString()}
        </Typography>
        {variation !== null && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: variation >= 0 ? '#4CAF50' : '#F44336',
            bgcolor: variation >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}>
            {variation >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
            <Typography variant="body2">
              {Math.abs(variation).toFixed(1)}%
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const CustomLabel = ({ 
  title, 
  value, 
  color, 
  percentage, 
  previousValue = null,
  trend = [],
  onShowTrend 
}) => {
  const variation = previousValue ? ((value - previousValue) / previousValue) * 100 : null;
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircleIcon sx={{ color, fontSize: 10 }} />
          <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ color: color }}>
              ${value.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
              {percentage.toFixed(1)}%
            </Typography>
          </Box>
          {variation !== null && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: variation >= 0 ? '#4CAF50' : '#F44336',
              bgcolor: variation >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              px: 1,
              py: 0.5,
              borderRadius: 1
            }}>
              {variation >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
              <Typography variant="caption">
                {Math.abs(variation).toFixed(1)}%
              </Typography>
            </Box>
          )}
          {trend?.length > 0 && (
            <IconButton 
              size="small" 
              onClick={() => onShowTrend(title, trend, color)}
              sx={{ color: '#AAAAAA' }}
            >
              <TimelineIcon fontSize="small" />
            </IconButton>
          )}
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
};

const TrendDialog = ({ 
  title, 
  data, 
  color, 
  onClose 
}) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
      Tendencia: {title}
    </Typography>
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="period" 
            stroke="#AAAAAA"
          />
          <YAxis 
            stroke="#AAAAAA"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

const ResultadosDesglose = ({ 
  title, 
  data, 
  total, 
  colorScheme = 'success',
  previousData = null,
  trendData = {},
  period = 'actual'
}) => {
  const [viewType, setViewType] = useState(VIEW_TYPES.PIE);
  const [selectedTrend, setSelectedTrend] = useState(null);

  if (!data || !total) return null;

  const items = Object.entries(data).map(([key, value], index) => ({
    name: key,
    value: value,
    previousValue: previousData?.[key] || null,
    percentage: (value / total) * 100,
    color: COLORS[colorScheme][index % COLORS[colorScheme].length],
    trend: trendData[key] || []
  })).sort((a, b) => b.value - a.value);

  const handleShowTrend = (title, trend, color) => {
    setSelectedTrend({ title, data: trend, color });
  };

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
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PieChartIcon sx={{ color: COLORS[colorScheme][0] }} />
            <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
              {title}
            </Typography>
          </Box>
          <CategoryMetric
            title="Total"
            value={total}
            previousValue={previousData ? Object.values(previousData).reduce((a, b) => a + b, 0) : null}
          />
        </Box>

        <ButtonGroup size="small" sx={{ mb: 2 }}>
          <Button
            variant={viewType === VIEW_TYPES.PIE ? 'contained' : 'outlined'}
            onClick={() => setViewType(VIEW_TYPES.PIE)}
            startIcon={<PieChartIcon />}
            sx={{
              color: viewType === VIEW_TYPES.PIE ? '#1E1E1E' : COLORS[colorScheme][0],
              backgroundColor: viewType === VIEW_TYPES.PIE ? COLORS[colorScheme][0] : 'transparent',
              borderColor: COLORS[colorScheme][0],
              '&:hover': {
                backgroundColor: viewType === VIEW_TYPES.PIE ? COLORS[colorScheme][1] : 'rgba(0, 255, 209, 0.1)'
              }
            }}
          >
            Distribución
          </Button>
          <Button
            variant={viewType === VIEW_TYPES.TREND ? 'contained' : 'outlined'}
            onClick={() => setViewType(VIEW_TYPES.TREND)}
            startIcon={<TimelineIcon />}
            sx={{
              color: viewType === VIEW_TYPES.TREND ? '#1E1E1E' : COLORS[colorScheme][0],
              backgroundColor: viewType === VIEW_TYPES.TREND ? COLORS[colorScheme][0] : 'transparent',
              borderColor: COLORS[colorScheme][0],
              '&:hover': {
                backgroundColor: viewType === VIEW_TYPES.TREND ? COLORS[colorScheme][1] : 'rgba(0, 255, 209, 0.1)'
              }
            }}
          >
            Tendencia
          </Button>
          <Button
            variant={viewType === VIEW_TYPES.COMPARISON ? 'contained' : 'outlined'}
            onClick={() => setViewType(VIEW_TYPES.COMPARISON)}
            startIcon={<BarChartIcon />}
            sx={{
              color: viewType === VIEW_TYPES.COMPARISON ? '#1E1E1E' : COLORS[colorScheme][0],
              backgroundColor: viewType === VIEW_TYPES.COMPARISON ? COLORS[colorScheme][0] : 'transparent',
              borderColor: COLORS[colorScheme][0],
              '&:hover': {
                backgroundColor: viewType === VIEW_TYPES.COMPARISON ? COLORS[colorScheme][1] : 'rgba(0, 255, 209, 0.1)'
              }
            }}
          >
            Comparativa
          </Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, height: 'calc(100% - 120px)' }}>
        {viewType === VIEW_TYPES.PIE ? (
          <>
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
            <Box sx={{ width: '60%', overflow: 'auto' }}>
              {items.map((item) => (
                <CustomLabel
                  key={item.name}
                  title={item.name}
                  value={item.value}
                  previousValue={item.previousValue}
                  color={item.color}
                  percentage={item.percentage}
                  trend={item.trend}
                  onShowTrend={handleShowTrend}
                />
              ))}
            </Box>
          </>
        ) : viewType === VIEW_TYPES.TREND ? (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={items}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#AAAAAA"
                />
                <YAxis 
                  stroke="#AAAAAA"
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#1E1E1E',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={COLORS[colorScheme][0]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[colorScheme][0] }}
                />
                {previousData && (
                  <Line 
                    type="monotone" 
                    dataKey="previousValue" 
                    stroke={COLORS[colorScheme][2]}
                    strokeWidth={2}
                    dot={{ fill: COLORS[colorScheme][2] }}
                    strokeDasharray="5 5"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={items}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                 <XAxis
                   dataKey="name"
                   stroke="#AAAAAA"
                 />
                 <YAxis
                   yAxisId="left"
                   stroke="#AAAAAA"
                   tickFormatter={(value) => `$${value.toLocaleString()}`}
                 />
                 <YAxis
                   yAxisId="right"
                   orientation="right"
                   stroke="#AAAAAA"
                   tickFormatter={(value) => `${value}%`}
                 />
                 <RechartsTooltip
                   contentStyle={{
                     backgroundColor: '#1E1E1E',
                     border: '1px solid rgba(255, 255, 255, 0.1)'
                   }}
                   labelStyle={{ color: '#FFFFFF' }}
                 />
                 <Bar
                   yAxisId="left"
                   dataKey="value"
                   fill={COLORS[colorScheme][0]}
                   radius={[4, 4, 0, 0]}
                   name="Valor Actual"
                 />
                 {previousData && (
                   <Bar
                     yAxisId="left"
                     dataKey="previousValue"
                     fill={COLORS[colorScheme][2]}
                     radius={[4, 4, 0, 0]}
                     name="Valor Anterior"
                   />
                 )}
                 <Line
                   yAxisId="right"
                   type="monotone"
                   dataKey="percentage"
                   stroke="#FFD700"
                   strokeWidth={2}
                   dot={{ fill: '#FFD700' }}
                   name="Porcentaje"
                 />
               </ComposedChart>
             </ResponsiveContainer>
           </Box>
         )}
       </Box>

       {/* Summary */}
       <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
         <Grid container spacing={2}>
           <Grid item xs={12} md={4}>
             <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
               {items.length} categorías analizadas
             </Typography>
           </Grid>
           <Grid item xs={12} md={4}>
             <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
               Promedio por categoría: ${(total / items.length).toLocaleString()}
             </Typography>
           </Grid>
           <Grid item xs={12} md={4}>
             <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
               Mayor categoría: {items[0]?.name} ({items[0]?.percentage.toFixed(1)}%)
             </Typography>
           </Grid>
         </Grid>
       </Box>

       {/* Trend Dialog */}
       {selectedTrend && (
         <Box
           sx={{
             position: 'absolute',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0,
             backgroundColor: 'rgba(0, 0, 0, 0.9)',
             zIndex: 1000,
             display: 'flex',
             flexDirection: 'column',
             p: 3
           }}
         >
           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
             <IconButton
               onClick={() => setSelectedTrend(null)}
               sx={{ color: '#FFFFFF' }}
             >
               <CloseIcon />
             </IconButton>
           </Box>
           <TrendDialog {...selectedTrend} onClose={() => setSelectedTrend(null)} />
         </Box>
       )}
     </Paper>
   );
};

export default ResultadosDesglose;