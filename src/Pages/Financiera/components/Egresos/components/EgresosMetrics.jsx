import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Tooltip } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  WhatshotOutlined as TrendingIcon,
  AccountBalance as ExpenseIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { TIPOS_GASTO, METODO_PAGO_COLORS } from '../../../../../constants/gastos';

const MetricCard = ({ 
  title, 
  mainMetric,
  secondaryMetric,
  trendMetric, 
  sparkData,
  color,
  icon: Icon,
  progress,
  tooltip
}) => (
  <Card 
    sx={{ 
      backgroundColor: '#2C2C2C',
      backgroundImage: 'linear-gradient(to bottom right, rgba(255, 99, 71, 0.03), rgba(255, 99, 71, 0))',
      height: '100%',
      position: 'relative',
      '&:hover': {
        '& .metric-highlight': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(255, 99, 71, 0.15)'
        }
      }
    }}
  >
    <CardContent sx={{ height: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 99, 71, 0.1)',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: '#FF6347', fontSize: 24 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ 
            color: '#FFFFFF',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}>
            {title}
          </Typography>
        </Box>
        
        {trendMetric && (
          <Tooltip title="Variación vs mes anterior" arrow>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5,
                backgroundColor: trendMetric >= 0 
                  ? 'rgba(244, 67, 54, 0.1)' 
                  : 'rgba(76, 175, 80, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            >
              {trendMetric >= 0 ? (
                <TrendingUpIcon 
                  sx={{ 
                    color: '#F44336',
                    fontSize: '1rem'
                  }} 
                />
              ) : (
                <TrendingDownIcon 
                  sx={{ 
                    color: '#4CAF50',
                    fontSize: '1rem'
                  }} 
                />
              )}
              <Typography 
                variant="caption"
                sx={{ 
                  color: trendMetric >= 0 ? '#F44336' : '#4CAF50',
                  fontWeight: 600
                }}
              >
                {Math.abs(trendMetric).toFixed(1)}%
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Box>

      {/* Main Metric */}
      <Box 
        className="metric-highlight"
        sx={{ 
          transition: 'all 0.3s ease',
          mb: 2
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            color: '#FFFFFF',
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: '1.8rem', sm: '2.2rem' }
          }}
        >
          {mainMetric}
        </Typography>
        {secondaryMetric && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500
            }}
          >
            {secondaryMetric}
          </Typography>
        )}
      </Box>

      {/* Progress Bar if applicable */}
      {progress && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 99, 71, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color || '#FF6347',
                borderRadius: 3
              }
            }}
          />
          {tooltip && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                display: 'block',
                mt: 1,
                textAlign: 'right'
              }}
            >
              {tooltip}
            </Typography>
          )}
        </Box>
      )}
    </CardContent>
  </Card>
);

const EgresosMetrics = ({ egresos }) => {
  const calculateMetrics = () => {
    const now = DateTime.now();
    const currentMonth = now.startOf('month');
    const previousMonth = currentMonth.minus({ months: 1 });
    const daysInMonth = now.daysInMonth;
    const currentDay = now.day;

    // Filtrar egresos por período
    const currentMonthEgresos = egresos.filter(egreso => 
      DateTime.fromISO(egreso.fecha) >= currentMonth
    );

    const previousMonthEgresos = egresos.filter(egreso => 
      DateTime.fromISO(egreso.fecha) >= previousMonth &&
      DateTime.fromISO(egreso.fecha) < currentMonth
    );

    // Totales
    const currentMonthTotal = currentMonthEgresos.reduce((sum, egreso) => 
      sum + egreso.monto, 0
    );
    const previousMonthTotal = previousMonthEgresos.reduce((sum, egreso) => 
      sum + egreso.monto, 0
    );

    // Métricas por tipo de gasto
    const tipoGastoMetrics = currentMonthEgresos.reduce((acc, egreso) => {
      if (!acc[egreso.tipo_gasto]) {
        acc[egreso.tipo_gasto] = {
          total: 0,
          count: 0
        };
      }
      acc[egreso.tipo_gasto].total += egreso.monto;
      acc[egreso.tipo_gasto].count += 1;
      return acc;
    }, {});

    // Métricas por método de pago
    const metodoPagoMetrics = currentMonthEgresos.reduce((acc, egreso) => {
      if (!acc[egreso.metodo_pago]) {
        acc[egreso.metodo_pago] = {
          total: 0,
          count: 0
        };
      }
      acc[egreso.metodo_pago].total += egreso.monto;
      acc[egreso.metodo_pago].count += 1;
      return acc;
    }, {});

    // Calcular proyección mensual
    const dailyAverage = currentMonthTotal / currentDay;
    const projectedTotal = dailyAverage * daysInMonth;
    const progressPercentage = (currentMonthTotal / projectedTotal) * 100;

    // Identificar tipo de gasto principal
    const topTipoGasto = Object.entries(tipoGastoMetrics)
      .sort(([,a], [,b]) => b.total - a.total)[0] || ['N/A', { total: 0, count: 0 }];

    // Identificar método de pago principal
    const topMetodoPago = Object.entries(metodoPagoMetrics)
      .sort(([,a], [,b]) => b.total - a.total)[0] || ['N/A', { total: 0, count: 0 }];

    return {
      currentMonthTotal,
      previousMonthTotal,
      percentageChange: previousMonthTotal === 0 ? 100 :
        ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100,
      dailyAverage,
      projectedTotal,
      progressPercentage,
      tipoGastoMetrics,
      metodoPagoMetrics,
      topTipoGasto,
      topMetodoPago,
      transactionCount: currentMonthEgresos.length
    };
  };

  const metrics = calculateMetrics();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          title="Egresos del Mes"
          mainMetric={`$${metrics.currentMonthTotal.toLocaleString()}`}
          secondaryMetric={`${metrics.transactionCount} transacciones totales`}
          trendMetric={metrics.percentageChange}
          icon={ExpenseIcon}
          progress={metrics.progressPercentage}
          tooltip={`Proyección: $${Math.round(metrics.projectedTotal).toLocaleString()}`}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          title="Promedio Diario"
          mainMetric={`$${metrics.dailyAverage.toFixed(2).toLocaleString()}`}
          secondaryMetric="por día del mes actual"
          icon={AnalyticsIcon}
          trendMetric={metrics.percentageChange}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          title="Método de Pago Principal"
          mainMetric={metrics.topMetodoPago[0]}
          secondaryMetric={`$${metrics.topMetodoPago[1].total.toLocaleString()}`}
          icon={PaymentIcon}
          color={METODO_PAGO_COLORS[metrics.topMetodoPago[0]]}
          progress={(metrics.topMetodoPago[1].total / metrics.currentMonthTotal) * 100}
          tooltip={`${metrics.topMetodoPago[1].count} transacciones`}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          title="Tipo de Gasto Principal"
          mainMetric={TIPOS_GASTO[metrics.topTipoGasto[0]] || metrics.topTipoGasto[0]}
          secondaryMetric={`$${metrics.topTipoGasto[1].total.toLocaleString()}`}
          icon={TrendingIcon}
          progress={(metrics.topTipoGasto[1].total / metrics.currentMonthTotal) * 100}
          tooltip={`${metrics.topTipoGasto[1].count} transacciones`}
        />
      </Grid>
    </Grid>
  );
};

export default EgresosMetrics;