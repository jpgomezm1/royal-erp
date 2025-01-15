import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Stack,
  LinearProgress,
  ButtonBase,
  Grid
} from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import {
  North as NorthIcon,
  South as SouthIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { PLATAFORMA_COLORS } from '../../../mockData';

// Importar componente de filtros
import IngresosChartsFilters from './IngresosChartsFilters';

const VIEW_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

const COMPARISON_OPTIONS = {
  PREVIOUS_PERIOD: 'previous_period',
  PREVIOUS_YEAR: 'previous_year',
  NONE: 'none'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const currentValue = payload[0]?.value || 0;
  const previousValue = payload[1]?.value || 0;
  const difference = currentValue - previousValue;
  const percentageChange = previousValue ? (difference / previousValue) * 100 : 0;

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
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ color: '#00FFD1' }}>
          ${currentValue.toLocaleString()}
        </Typography>
        {payload.length > 1 && (
          <>
            <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
              Período anterior: ${previousValue.toLocaleString()}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: difference >= 0 ? '#4CAF50' : '#F44336',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {difference >= 0 ? <NorthIcon fontSize="small" /> : <SouthIcon fontSize="small" />}
              {Math.abs(percentageChange).toFixed(1)}%
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

const StatCard = ({ title, value, trend, percentage, onClick, selected }) => (
  <ButtonBase
    onClick={onClick}
    sx={{ 
      width: '100%',
      textAlign: 'left',
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'all 0.2s ease-in-out'
    }}
  >
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: 2,
        bgcolor: selected ? 'rgba(0, 255, 209, 0.1)' : '#2C2C2C',
        border: '1px solid',
        borderColor: selected ? '#00FFD1' : 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          bgcolor: 'rgba(0, 255, 209, 0.05)',
          borderColor: selected ? '#00FFD1' : 'rgba(0, 255, 209, 0.5)'
        }
      }}
    >
      <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 1 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {trend === 'up' ? (
          <NorthIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
        ) : (
          <SouthIcon sx={{ color: '#F44336', fontSize: 16 }} />
        )}
        <Typography 
          variant="body2"
          sx={{ 
            color: trend === 'up' ? '#4CAF50' : '#F44336',
            fontWeight: 500
          }}
        >
          {percentage}%
        </Typography>
      </Box>
    </Paper>
  </ButtonBase>
);

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
          borderRadius: 2
        }
      }}
    />
  </Box>
);

const IngresosCharts = ({ ingresos, loading }) => {
  const [selectedMetric, setSelectedMetric] = useState('general');
  const [chartFilters, setChartFilters] = useState({
    startDate: DateTime.now().minus({ days: 30 }),
    endDate: DateTime.now(),
    platforms: ['all'],
    viewType: VIEW_TYPES.DAILY,
    comparisonType: COMPARISON_OPTIONS.PREVIOUS_PERIOD
  });

  // Filtrar datos según los filtros del chart
  const filteredChartData = useMemo(() => {
    return ingresos.filter(ingreso => {
      const ingresoDate = DateTime.fromISO(ingreso.fecha);
      const matchesDate = ingresoDate >= chartFilters.startDate && 
                         ingresoDate <= chartFilters.endDate;
      const matchesPlatform = chartFilters.platforms.includes('all') || 
                             chartFilters.platforms.includes(ingreso.plataforma);
      
      return matchesDate && matchesPlatform;
    });
  }, [ingresos, chartFilters]);

  // Procesar datos para el gráfico
  const processDataForChart = (data, startDate, endDate) => {
    const dateFormat = {
      [VIEW_TYPES.DAILY]: 'yyyy-MM-dd',
      [VIEW_TYPES.WEEKLY]: 'kkkk-WW',
      [VIEW_TYPES.MONTHLY]: 'yyyy-MM'
    }[chartFilters.viewType];

    const displayFormat = {
      [VIEW_TYPES.DAILY]: 'd MMM yy',
      [VIEW_TYPES.WEEKLY]: "'Sem' WW, MMM yy",
      [VIEW_TYPES.MONTHLY]: 'MMM yyyy'
    }[chartFilters.viewType];

    const groupedData = data.reduce((acc, ingreso) => {
      const ingresoDate = DateTime.fromISO(ingreso.fecha);
      const dateKey = ingresoDate.toFormat(dateFormat);
      const displayDate = ingresoDate.toFormat(displayFormat);
      
      if (!acc[dateKey]) {
        acc[dateKey] = { 
          date: displayDate,
          total: 0,
          sortDate: dateKey
        };
      }
      acc[dateKey].total += ingreso.monto;
      return acc;
    }, {});

    return Object.values(groupedData)
      .sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  };

  // Procesar datos filtrados
  const data = useMemo(() => {
    const currentPeriodData = processDataForChart(
      filteredChartData,
      chartFilters.startDate,
      chartFilters.endDate
    );

    let comparisonData = [];
    if (chartFilters.comparisonType !== COMPARISON_OPTIONS.NONE) {
      const periodDuration = chartFilters.endDate.diff(chartFilters.startDate);
      let comparisonStartDate, comparisonEndDate;

      if (chartFilters.comparisonType === COMPARISON_OPTIONS.PREVIOUS_YEAR) {
        comparisonStartDate = chartFilters.startDate.minus({ years: 1 });
        comparisonEndDate = chartFilters.endDate.minus({ years: 1 });
      } else {
        comparisonStartDate = chartFilters.startDate.minus(periodDuration);
        comparisonEndDate = chartFilters.startDate;
      }

      const comparisonPeriodData = processDataForChart(
        ingresos.filter(ingreso => {
          const ingresoDate = DateTime.fromISO(ingreso.fecha);
          return ingresoDate >= comparisonStartDate && 
                 ingresoDate <= comparisonEndDate &&
                 (chartFilters.platforms.includes('all') || 
                  chartFilters.platforms.includes(ingreso.plataforma));
        }),
        comparisonStartDate,
        comparisonEndDate
      );

      comparisonData = comparisonPeriodData;
    }

    // Datos por plataforma
    const platformData = filteredChartData.reduce((acc, ingreso) => {
      if (!acc[ingreso.plataforma]) {
        acc[ingreso.plataforma] = { total: 0, count: 0 };
      }
      acc[ingreso.plataforma].total += ingreso.monto;
      acc[ingreso.plataforma].count += 1;
      return acc;
    }, {});

    const totalAmount = filteredChartData.reduce((sum, i) => sum + i.monto, 0);
    const platformStats = Object.entries(platformData)
      .map(([name, data]) => ({
        name,
        total: data.total,
        percentage: (data.total / totalAmount) * 100,
        count: data.count
      }))
      .sort((a, b) => b.total - a.total);

    // Métricas por producto
    const productData = filteredChartData.reduce((acc, ingreso) => {
      const product = ingreso.concepto.split(' - ')[0];
      if (!acc[product]) acc[product] = { total: 0, count: 0 };
      acc[product].total += ingreso.monto;
      acc[product].count += 1;
      return acc;
    }, {});

    // Calcular variaciones
    const previousTotal = comparisonData.reduce((sum, item) => sum + item.total, 0);
    const growth = previousTotal ? ((totalAmount - previousTotal) / previousTotal) * 100 : 0;

    const avgTicket = totalAmount / filteredChartData.length || 0;
    const previousAvgTicket = previousTotal / comparisonData.length || 0;
    const ticketGrowth = previousAvgTicket ? 
      ((avgTicket - previousAvgTicket) / previousAvgTicket) * 100 : 0;

    // Combinar datos actuales y de comparación para el gráfico
    const chartData = currentPeriodData.map((item, index) => ({
      date: item.date,
      total: item.total,
      previousTotal: comparisonData[index]?.total || null
    }));

    return {
      chartData,
      platformStats,
      metrics: {
        total: totalAmount,
        growth,
        count: filteredChartData.length,
        avgTicket,
        ticketGrowth,
        products: Object.entries(productData).map(([name, data]) => ({
          name,
          total: data.total,
          count: data.count,
          percentage: (data.total / totalAmount) * 100
        }))
      }
    };
  }, [filteredChartData, chartFilters, ingresos]);

  const handleFilterChange = (newFilters) => {
    setChartFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleResetFilters = () => {
    setChartFilters({
      startDate: DateTime.now().minus({ days: 30 }),
      endDate: DateTime.now(),
      platforms: ['all'],
      viewType: VIEW_TYPES.DAILY,
      comparisonType: COMPARISON_OPTIONS.PREVIOUS_PERIOD
    });
  };

  return (
    <Box sx={{ height: '100%', p: 0 }}>
      {/* Componente de Filtros */}
      <IngresosChartsFilters 
        filters={chartFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Métricas Principales */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Ingresos Totales"
              value={`$${data.metrics.total.toLocaleString()}`}
              trend={data.metrics.growth >= 0 ? 'up' : 'down'}
              percentage={Math.abs(data.metrics.growth).toFixed(1)}
              onClick={() => setSelectedMetric('general')}
              selected={selectedMetric === 'general'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Ticket Promedio"
              value={`$${data.metrics.avgTicket.toFixed(2)}`}
              trend={data.metrics.ticketGrowth >= 0 ? 'up' : 'down'}
              percentage={Math.abs(data.metrics.ticketGrowth).toFixed(1)}
              onClick={() => setSelectedMetric('ticket')}
              selected={selectedMetric === 'ticket'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Total Ventas"
              value={data.metrics.count}
              trend={data.metrics.growth >= 0 ? 'up' : 'down'}
              percentage={Math.abs(data.metrics.growth).toFixed(1)}
              onClick={() => setSelectedMetric('sales')}
              selected={selectedMetric === 'sales'}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Gráfico Principal */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#2C2C2C',
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          height: 300
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FFD1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00FFD1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#666666" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#666666" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              stroke="rgba(255, 255, 255, 0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#AAAAAA', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#AAAAAA', fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <RechartsTooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: '#00FFD1',
                strokeWidth: 1,
                strokeDasharray: '3 3'
              }}
            />
            {chartFilters.comparisonType !== COMPARISON_OPTIONS.NONE && (
              <Area
                type="monotone"
                dataKey="previousTotal"
                stroke="#666666"
                strokeWidth={2}
                fill="url(#colorPrevious)"
                dot={false}
                activeDot={{ r: 6, fill: '#666666' }}
                name="Período anterior"
              />
            )}
            <Area
              type="monotone"
              dataKey="total"
              stroke="#00FFD1"
              strokeWidth={2}
              fill="url(#colorTotal)"
              dot={false}
              activeDot={{ r: 6, fill: '#00FFD1' }}
              name="Período actual"
            />
            {chartFilters.comparisonType !== COMPARISON_OPTIONS.NONE && (
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ color: '#FFFFFF' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Distribución */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#2C2C2C',
          p: 3,
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography variant="subtitle1" sx={{ color: '#FFFFFF', mb: 3 }}>
          Distribución por Plataforma
        </Typography>
        <Box>
          {data.platformStats.map((platform) => (
            <PlatformStat
              key={platform.name}
              platform={platform.name}
              value={platform.total}
              percentage={platform.percentage}
              color={PLATAFORMA_COLORS[platform.name]}
            />
          ))}
        </Box>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Typography variant="subtitle1" sx={{ color: '#FFFFFF', mb: 3 }}>
          Distribución por Producto
        </Typography>
        <Box>
          {data.metrics.products.map((product) => (
            <Box key={product.name} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                  {product.name}
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: '#00FFD1' }}>
                    ${product.total.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                    {product.count} ventas
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={product.percentage}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#00FFD1',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default IngresosCharts;