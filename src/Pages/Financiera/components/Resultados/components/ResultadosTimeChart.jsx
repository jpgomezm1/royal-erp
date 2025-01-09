import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  useTheme,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  Chip
} from '@mui/material';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts';

const VIEW_MODES = {
  COMBINED: 'combined',
  MARGINS: 'margins',
  GROWTH: 'growth'
};

const CustomTooltip = ({ active, payload, label, viewMode }) => {
  if (!active || !payload?.length) return null;

  const getGrowthIndicator = (value) => {
    if (value > 0) return '▲';
    if (value < 0) return '▼';
    return '●';
  };

  const getGrowthColor = (value) => {
    if (value > 0) return '#4CAF50';
    if (value < 0) return '#FF6347';
    return '#AAAAAA';
  };

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: '#1E1E1E',
        border: '1px solid rgba(0, 255, 209, 0.2)',
        p: 1.5,
        minWidth: 200
      }}
    >
      <Typography sx={{ color: '#AAAAAA', mb: 1 }}>
        {label}
      </Typography>
      {payload.map((entry) => {
        const value = entry.value;
        const isPercentage = entry.name.includes('Margen') || entry.name.includes('Crecimiento');
        
        return (
          <Box key={entry.name} sx={{ mb: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                color: entry.color,
                fontWeight: 500,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2
              }}
            >
              {entry.name}:
              <span>
                {isPercentage ? (
                  <span style={{ color: getGrowthColor(value) }}>
                    {getGrowthIndicator(value)} {value.toFixed(1)}%
                  </span>
                ) : (
                  `$${value.toLocaleString()}`
                )}
              </span>
            </Typography>
          </Box>
        );
      })}
    </Paper>
  );
};

const ResultadosTimeChart = ({ data, period }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewMode, setViewMode] = useState(VIEW_MODES.COMBINED);

  if (!data?.length) return null;

  // Calculate additional metrics
  const enrichedData = data.map((item, index) => {
    const prevItem = data[index - 1];
    const margenBruto =
      item.ingresos !== 0
        ? ((item.ingresos - item.egresos) / item.ingresos) * 100
        : 0;
    const crecimientoIngresos = prevItem && prevItem.ingresos !== 0
      ? ((item.ingresos - prevItem.ingresos) / prevItem.ingresos) * 100
      : 0;
    
    return {
      ...item,
      margenBruto,
      crecimientoIngresos,
    };
  });

  const formatYAxis = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const formatPercentage = (value) => `${value.toFixed(1)}%`;

  const renderChart = () => {
    switch (viewMode) {
      case VIEW_MODES.MARGINS:
        return (
          <ComposedChart data={enrichedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis 
              dataKey="periodo" 
              tick={{ fill: '#AAAAAA' }} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} 
              tickLine={false} 
            />
            {/* Separamos los ejes para que no se aplaste la línea de margen */}
            <YAxis
              yAxisId="margenAxis"
              orientation="left"
              tickFormatter={formatPercentage}
              tick={{ fill: '#AAAAAA' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              domain={[-100, 100]}
            />
            <YAxis
              yAxisId="crecimientoAxis"
              orientation="right"
              tickFormatter={formatPercentage}
              tick={{ fill: '#AAAAAA' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              domain={[-100, 100]}
            />
            <Tooltip content={props => <CustomTooltip {...props} viewMode={viewMode} />} />
            <Legend />
            <ReferenceLine
              yAxisId="margenAxis"
              y={0}
              stroke="rgba(255, 255, 255, 0.2)"
            />
            <Line
              yAxisId="margenAxis"
              type="monotone"
              dataKey="margenBruto"
              name="Margen Bruto"
              stroke="#00FFD1"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="crecimientoAxis"
              type="monotone"
              dataKey="crecimientoIngresos"
              name="Crecimiento Ingresos"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Brush dataKey="periodo" height={30} stroke="#00FFD1" fill="#1E1E1E" />
          </ComposedChart>
        );
      case VIEW_MODES.GROWTH:
        return (
          <ComposedChart data={enrichedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis 
              dataKey="periodo" 
              tick={{ fill: '#AAAAAA' }} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} 
              tickLine={false} 
            />
            <YAxis 
              yAxisId="left" 
              tickFormatter={formatYAxis} 
              tick={{ fill: '#AAAAAA' }} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={formatPercentage}
              tick={{ fill: '#AAAAAA' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Tooltip content={props => <CustomTooltip {...props} viewMode={viewMode} />} />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="ingresos" 
              name="Ingresos" 
              fill="#00FFD1" 
              fillOpacity={0.3} 
              radius={[4, 4, 0, 0]} 
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="crecimientoIngresos"
              name="% Crecimiento"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Brush dataKey="periodo" height={30} stroke="#00FFD1" fill="#1E1E1E" />
          </ComposedChart>
        );
      default:
        return (
          <ComposedChart data={enrichedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis 
              dataKey="periodo" 
              tick={{ fill: '#AAAAAA' }} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }} 
              tickLine={false} 
            />
            <YAxis 
              yAxisId="left" 
              tickFormatter={formatYAxis} 
              tick={{ fill: '#AAAAAA' }} 
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Tooltip content={props => <CustomTooltip {...props} viewMode={viewMode} />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="ingresos"
              name="Ingresos"
              fill="#00FFD1"
              fillOpacity={0.3}
              radius={[4, 4, 0, 0]}
              stackId="stack"
            />
            <Bar
              yAxisId="left"
              dataKey="egresos"
              name="Egresos"
              fill="#FF6347"
              fillOpacity={0.3}
              radius={[4, 4, 0, 0]}
              stackId="stack"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="utilidad"
              name="Utilidad"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Brush dataKey="periodo" height={30} stroke="#00FFD1" fill="#1E1E1E" />
          </ComposedChart>
        );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: '#2C2C2C',
        p: 3,
        height: 500,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
          Tendencia {period === 'week' ? 'Semanal' : 
                    period === 'month' ? 'Mensual' :
                    period === 'quarter' ? 'Trimestral' : 'Anual'}
        </Typography>
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              color: '#AAAAAA',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
                color: '#00FFD1',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 209, 0.2)',
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }
            }
          }}
        >
          <ToggleButton value={VIEW_MODES.COMBINED}>
            General
          </ToggleButton>
          <ToggleButton value={VIEW_MODES.MARGINS}>
            Márgenes
          </ToggleButton>
          <ToggleButton value={VIEW_MODES.GROWTH}>
            Crecimiento
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height="90%">
        {renderChart()}
      </ResponsiveContainer>
    </Paper>
  );
};

export default ResultadosTimeChart;
