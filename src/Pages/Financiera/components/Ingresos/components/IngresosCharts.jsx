import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Cell
} from 'recharts';
import {
  North as NorthIcon,
  South as SouthIcon,
  TrendingUp as TrendingUpIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { PLATAFORMA_COLORS } from '../../../mockData';

const PERIODS = {
  WEEK: { label: 'Esta Semana', days: 7 },
  MONTH: { label: 'Este Mes', days: 30 },
  QUARTER: { label: 'Este Trimestre', days: 90 }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: '#1E1E1E',
        border: '1px solid rgba(0, 255, 209, 0.2)',
        p: 1.5,
        minWidth: 180
      }}
    >
      <Typography sx={{ color: '#AAAAAA', mb: 1 }}>
        {label}
      </Typography>
      {payload.map((entry) => (
        <Box key={entry.name} sx={{ mt: 1 }}>
          <Typography variant="h6" sx={{ color: '#00FFD1' }}>
            ${entry.value.toLocaleString()}
          </Typography>
        </Box>
      ))}
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

const IngresosCharts = ({ ingresos }) => {
  const [period, setPeriod] = useState(PERIODS.MONTH.days);
  const [selectedMetric, setSelectedMetric] = useState('general');

  const data = useMemo(() => {
    const now = DateTime.now();
    const startDate = now.minus({ days: period });
    const filteredData = ingresos.filter(
      ingreso => DateTime.fromISO(ingreso.fecha) >= startDate
    );

    // Datos agrupados por fecha
    const dailyData = filteredData.reduce((acc, ingreso) => {
      const date = DateTime.fromISO(ingreso.fecha).toFormat('d MMM');
      if (!acc[date]) acc[date] = { date, total: 0 };
      acc[date].total += ingreso.monto;
      return acc;
    }, {});

    // Datos por plataforma
    const platformData = filteredData.reduce((acc, ingreso) => {
      if (!acc[ingreso.plataforma]) {
        acc[ingreso.plataforma] = { total: 0, count: 0 };
      }
      acc[ingreso.plataforma].total += ingreso.monto;
      acc[ingreso.plataforma].count += 1;
      return acc;
    }, {});

    // Calcular porcentajes y totales
    const totalAmount = filteredData.reduce((sum, i) => sum + i.monto, 0);
    const platformStats = Object.entries(platformData).map(([name, data]) => ({
      name,
      total: data.total,
      percentage: (data.total / totalAmount) * 100,
      count: data.count
    })).sort((a, b) => b.total - a.total);

    // Calcular métricas de comparación
    const previousPeriodStart = startDate.minus({ days: period });
    const previousData = ingresos.filter(
      ingreso => {
        const date = DateTime.fromISO(ingreso.fecha);
        return date >= previousPeriodStart && date < startDate;
      }
    );
    const previousTotal = previousData.reduce((sum, i) => sum + i.monto, 0);
    const growth = previousTotal ? ((totalAmount - previousTotal) / previousTotal) * 100 : 100;

    // Métricas por producto
    const productData = filteredData.reduce((acc, ingreso) => {
      const product = ingreso.concepto.split(' - ')[0];
      if (!acc[product]) acc[product] = { total: 0, count: 0 };
      acc[product].total += ingreso.monto;
      acc[product].count += 1;
      return acc;
    }, {});

    const avgTicket = totalAmount / filteredData.length || 0;
    const previousAvgTicket = previousTotal / previousData.length || 0;
    const ticketGrowth = previousAvgTicket ? 
      ((avgTicket - previousAvgTicket) / previousAvgTicket) * 100 : 0;

    return {
      dailyData: Object.values(dailyData),
      platformStats,
      metrics: {
        total: totalAmount,
        growth,
        count: filteredData.length,
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
  }, [ingresos, period]);

  return (
    <Box sx={{ height: '100%', p: 0 }}>
      {/* Header - Periodo */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1}>
          {Object.entries(PERIODS).map(([key, { label, days }]) => (
            <Button
              key={key}
              variant={period === days ? 'contained' : 'text'}
              onClick={() => setPeriod(days)}
              sx={{
                color: period === days ? '#1E1E1E' : '#FFFFFF',
                backgroundColor: period === days ? '#00FFD1' : 'transparent',
                '&:hover': {
                  backgroundColor: period === days ? '#00CCB7' : 'rgba(0, 255, 209, 0.1)'
                }
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Box>

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
          <AreaChart data={data.dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FFD1" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00FFD1" stopOpacity={0}/>
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
            <Area
              type="monotone"
              dataKey="total"
              stroke="#00FFD1"
              strokeWidth={2}
              fill="url(#colorTotal)"
              dot={false}
              activeDot={{ r: 6, fill: '#00FFD1' }}
            />
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