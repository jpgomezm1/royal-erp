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
} from 'recharts';
import {
  North as NorthIcon,
  South as SouthIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { TIPOS_GASTO, TIPO_GASTO_COLORS, METODO_PAGO_COLORS } from '../../../../../constants/gastos';

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
        border: '1px solid rgba(255, 99, 71, 0.2)',
        p: 1.5,
        minWidth: 180
      }}
    >
      <Typography sx={{ color: '#AAAAAA', mb: 1 }}>
        {label}
      </Typography>
      {payload.map((entry) => (
        <Box key={entry.name} sx={{ mt: 1 }}>
          <Typography variant="h6" sx={{ color: '#FF6347' }}>
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
        bgcolor: selected ? 'rgba(255, 99, 71, 0.1)' : '#2C2C2C',
        border: '1px solid',
        borderColor: selected ? '#FF6347' : 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          bgcolor: 'rgba(255, 99, 71, 0.05)',
          borderColor: selected ? '#FF6347' : 'rgba(255, 99, 71, 0.5)'
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
          <NorthIcon sx={{ color: '#F44336', fontSize: 16 }} />
        ) : (
          <SouthIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
        )}
        <Typography 
          variant="body2"
          sx={{ 
            color: trend === 'up' ? '#F44336' : '#4CAF50',
            fontWeight: 500
          }}
        >
          {percentage}%
        </Typography>
      </Box>
    </Paper>
  </ButtonBase>
);

const CategoryStat = ({ category, value, percentage, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircleIcon sx={{ color, fontSize: 10 }} />
        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
          {category}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#FF6347' }}>
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

const EgresosCharts = ({ egresos }) => {
  const [period, setPeriod] = useState(PERIODS.MONTH.days);
  const [selectedMetric, setSelectedMetric] = useState('general');

  const data = useMemo(() => {
    const now = DateTime.now();
    const startDate = now.minus({ days: period });
    const filteredData = egresos.filter(
      egreso => DateTime.fromISO(egreso.fecha) >= startDate
    );

    // Datos agrupados por fecha
    const dailyData = filteredData.reduce((acc, egreso) => {
      const date = DateTime.fromISO(egreso.fecha).toFormat('d MMM');
      if (!acc[date]) acc[date] = { date, total: 0 };
      acc[date].total += egreso.monto;
      return acc;
    }, {});

    // Datos por tipo de gasto
    const tipoGastoData = filteredData.reduce((acc, egreso) => {
      if (!acc[egreso.tipo_gasto]) {
        acc[egreso.tipo_gasto] = { total: 0, count: 0 };
      }
      acc[egreso.tipo_gasto].total += egreso.monto;
      acc[egreso.tipo_gasto].count += 1;
      return acc;
    }, {});

    // Datos por método de pago
    const metodoPagoData = filteredData.reduce((acc, egreso) => {
      if (!acc[egreso.metodo_pago]) {
        acc[egreso.metodo_pago] = { total: 0, count: 0 };
      }
      acc[egreso.metodo_pago].total += egreso.monto;
      acc[egreso.metodo_pago].count += 1;
      return acc;
    }, {});

    // Calcular porcentajes y totales
    const totalAmount = filteredData.reduce((sum, i) => sum + i.monto, 0);
    
    const tipoGastoStats = Object.entries(tipoGastoData).map(([name, data]) => ({
      name,
      fullName: TIPOS_GASTO[name],
      total: data.total,
      percentage: (data.total / totalAmount) * 100,
      count: data.count,
      color: TIPO_GASTO_COLORS[name]
    })).sort((a, b) => b.total - a.total);

    const metodoPagoStats = Object.entries(metodoPagoData).map(([name, data]) => ({
      name,
      total: data.total,
      percentage: (data.total / totalAmount) * 100,
      count: data.count,
      color: METODO_PAGO_COLORS[name]
    })).sort((a, b) => b.total - a.total);

    // Calcular métricas de comparación
    const previousPeriodStart = startDate.minus({ days: period });
    const previousData = egresos.filter(
      egreso => {
        const date = DateTime.fromISO(egreso.fecha);
        return date >= previousPeriodStart && date < startDate;
      }
    );
    const previousTotal = previousData.reduce((sum, i) => sum + i.monto, 0);
    const growth = previousTotal ? ((totalAmount - previousTotal) / previousTotal) * 100 : 100;

    const avgGasto = totalAmount / filteredData.length || 0;
    const previousAvgGasto = previousTotal / previousData.length || 0;
    const avgGrowth = previousAvgGasto ? 
      ((avgGasto - previousAvgGasto) / previousAvgGasto) * 100 : 0;

    return {
      dailyData: Object.values(dailyData),
      tipoGastoStats,
      metodoPagoStats,
      metrics: {
        total: totalAmount,
        growth,
        count: filteredData.length,
        avgGasto,
        avgGrowth
      }
    };
  }, [egresos, period]);

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
                color: period === days ? '#FFFFFF' : '#FFFFFF',
                backgroundColor: period === days ? '#FF6347' : 'transparent',
                '&:hover': {
                  backgroundColor: period === days ? '#FF4500' : 'rgba(255, 99, 71, 0.1)'
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
              title="Egresos Totales"
              value={`$${data.metrics.total.toLocaleString()}`}
              trend={data.metrics.growth >= 0 ? 'up' : 'down'}
              percentage={Math.abs(data.metrics.growth).toFixed(1)}
              onClick={() => setSelectedMetric('general')}
              selected={selectedMetric === 'general'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Gasto Promedio"
              value={`$${data.metrics.avgGasto.toFixed(2)}`}
              trend={data.metrics.avgGrowth >= 0 ? 'up' : 'down'}
              percentage={Math.abs(data.metrics.avgGrowth).toFixed(1)}
              onClick={() => setSelectedMetric('average')}
              selected={selectedMetric === 'average'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard
              title="Total Transacciones"
              value={data.metrics.count}
              trend={data.metrics.growth >= 0 ? 'up' : 'down'}
              percentage={Math.abs(data.metrics.growth).toFixed(1)}
              onClick={() => setSelectedMetric('transactions')}
              selected={selectedMetric === 'transactions'}
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
                <stop offset="5%" stopColor="#FF6347" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#FF6347" stopOpacity={0}/>
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
                stroke: '#FF6347',
                strokeWidth: 1,
                strokeDasharray: '3 3'
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#FF6347"
              strokeWidth={2}
              fill="url(#colorTotal)"
              dot={false}
              activeDot={{ r: 6, fill: '#FF6347' }}
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
          Distribución por Tipo de Gasto
        </Typography>
        <Box>
          {data.tipoGastoStats.map((tipo) => (
            <CategoryStat
              key={tipo.name}
              category={tipo.fullName}
              value={tipo.total}
              percentage={tipo.percentage}
              color={tipo.color}
            />
          ))}
        </Box>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <Typography variant="subtitle1" sx={{ color: '#FFFFFF', mb: 3 }}>
          Distribución por Método de Pago
        </Typography>
        <Box>
          {data.metodoPagoStats.map((metodo) => (
            <CategoryStat
              key={metodo.name}
              category={metodo.name}
              value={metodo.total}
              percentage={metodo.percentage}
              color={metodo.color}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default EgresosCharts;