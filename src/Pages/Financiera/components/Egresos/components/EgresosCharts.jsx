import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  ButtonBase,
  LinearProgress
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
import { TIPOS_GASTO, TIPO_GASTO_COLORS, METODO_PAGO_COLORS } from '../../../../../constants/gastos';

// Importar componente de filtros
import EgresosChartsFilters from './EgresosChartsFilters';

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
        border: '1px solid rgba(255, 99, 71, 0.2)',
        p: 1.5,
        minWidth: 200
      }}
    >
      <Typography sx={{ color: '#AAAAAA', mb: 1 }}>
        {label}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Typography variant="h6" sx={{ color: '#FF6347' }}>
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
                color: difference >= 0 ? '#F44336' : '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {difference >= 0? <NorthIcon fontSize="small" /> : <SouthIcon fontSize="small" />}
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
  const [selectedMetric, setSelectedMetric] = useState('general');
  const [chartFilters, setChartFilters] = useState({
    startDate: DateTime.now().minus({ days: 30 }),
    endDate: DateTime.now(),
    tipoGasto: ['all'],
    metodoPago: ['all'],
    viewType: VIEW_TYPES.DAILY,
    comparisonType: COMPARISON_OPTIONS.PREVIOUS_PERIOD
  });

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

    const groupedData = data.reduce((acc, egreso) => {
      const egresoDate = DateTime.fromISO(egreso.fecha);
      const dateKey = egresoDate.toFormat(dateFormat);
      const displayDate = egresoDate.toFormat(displayFormat);
      
      if (!acc[dateKey]) {
        acc[dateKey] = { 
          date: displayDate,
          total: 0,
          sortDate: dateKey
        };
      }
      acc[dateKey].total += egreso.monto;
      return acc;
    }, {});

    return Object.values(groupedData)
      .sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  };

  // Filtrar datos según los filtros
  const filteredData = useMemo(() => {
    return egresos.filter(egreso => {
      const egresoDate = DateTime.fromISO(egreso.fecha);
      const matchesDate = egresoDate >= chartFilters.startDate && 
                         egresoDate <= chartFilters.endDate;
      const matchesTipoGasto = chartFilters.tipoGasto.includes('all') || 
                              chartFilters.tipoGasto.includes(egreso.tipo_gasto);
      const matchesMetodoPago = chartFilters.metodoPago.includes('all') || 
                               chartFilters.metodoPago.includes(egreso.metodo_pago);
      
      return matchesDate && matchesTipoGasto && matchesMetodoPago;
    });
  }, [egresos, chartFilters]);

  // Procesar datos para visualización
  const data = useMemo(() => {
    const currentPeriodData = processDataForChart(
      filteredData,
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
        egresos.filter(egreso => {
          const egresoDate = DateTime.fromISO(egreso.fecha);
          return egresoDate >= comparisonStartDate && 
                 egresoDate <= comparisonEndDate &&
                 (chartFilters.tipoGasto.includes('all') || 
                  chartFilters.tipoGasto.includes(egreso.tipo_gasto)) &&
                 (chartFilters.metodoPago.includes('all') || 
                  chartFilters.metodoPago.includes(egreso.metodo_pago));
        }),
        comparisonStartDate,
        comparisonEndDate
      );

      comparisonData = comparisonPeriodData;
    }

    // Datos por tipo de gasto
    const tipoGastoData = filteredData.reduce((acc, egreso) => {
      if (!acc[egreso.tipo_gasto]) {
        acc[egreso.tipo_gasto] = { total: 0, count: 0 };
      }
      acc[egreso.tipo_gasto].total += egreso.monto;
      acc[egreso.tipo_gasto].count += 1;
      return acc;
    }, {});

    const totalAmount = filteredData.reduce((sum, i) => sum + i.monto, 0);

    const tipoGastoStats = Object.entries(tipoGastoData)
      .map(([key, data]) => ({
        name: key,
        fullName: TIPOS_GASTO[key],
        total: data.total,
        percentage: (data.total / totalAmount) * 100,
        count: data.count,
        color: TIPO_GASTO_COLORS[key]
      }))
      .sort((a, b) => b.total - a.total);

    // Datos por método de pago
    const metodoPagoData = filteredData.reduce((acc, egreso) => {
      if (!acc[egreso.metodo_pago]) {
        acc[egreso.metodo_pago] = { total: 0, count: 0 };
      }
      acc[egreso.metodo_pago].total += egreso.monto;
      acc[egreso.metodo_pago].count += 1;
      return acc;
    }, {});

    const metodoPagoStats = Object.entries(metodoPagoData)
      .map(([name, data]) => ({
        name,
        total: data.total,
        percentage: (data.total / totalAmount) * 100,
        count: data.count,
        color: METODO_PAGO_COLORS[name]
      }))
      .sort((a, b) => b.total - a.total);

    // Calcular métricas de comparación
    const previousTotal = comparisonData.reduce((sum, item) => sum + item.total, 0);
    const growth = previousTotal ? ((totalAmount - previousTotal) / previousTotal) * 100 : 0;

    const avgGasto = totalAmount / filteredData.length || 0;
    const previousAvgGasto = previousTotal / comparisonData.length || 0;
    const avgGrowth = previousAvgGasto ? 
      ((avgGasto - previousAvgGasto) / previousAvgGasto) * 100 : 0;

    // Combinar datos para el gráfico
    const chartData = currentPeriodData.map((item, index) => ({
      date: item.date,
      total: item.total,
      previousTotal: comparisonData[index]?.total || null
    }));

    return {
      chartData,
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
  }, [filteredData, chartFilters, egresos]);

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
      tipoGasto: ['all'],
      metodoPago: ['all'],
      viewType: VIEW_TYPES.DAILY,
      comparisonType: COMPARISON_OPTIONS.PREVIOUS_PERIOD
    });
  };

  return (
    <Box sx={{ height: '100%', p: 0 }}>
      {/* Componente de Filtros */}
      <EgresosChartsFilters 
        filters={chartFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

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
          <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6347" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#FF6347" stopOpacity={0}/>
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
              cursor={{stroke: '#FF6347',
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
            stroke="#FF6347"
            strokeWidth={2}
            fill="url(#colorTotal)"
            dot={false}
            activeDot={{ r: 6, fill: '#FF6347' }}
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