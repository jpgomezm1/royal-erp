import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Tooltip } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  WhatshotOutlined as TrendingIcon,
  AccountBalanceWallet as WalletIcon,
  Analytics as AnalyticsIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { PLATAFORMA_COLORS } from '../../../mockData';

const MetricCard = ({ 
  title, 
  mainMetric,
  secondaryMetric,
  trendMetric, 
  sparkData,
  platformColor,
  icon: Icon,
  progress,
  tooltip
}) => (
  <Card 
    sx={{ 
      backgroundColor: '#2C2C2C',
      backgroundImage: 'linear-gradient(to bottom right, rgba(0, 255, 209, 0.03), rgba(0, 255, 209, 0))',
      height: '100%',
      position: 'relative',
      '&:hover': {
        '& .metric-highlight': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 255, 209, 0.15)'
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
              backgroundColor: 'rgba(0, 255, 209, 0.1)',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: '#00FFD1', fontSize: 24 }} />
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
                  ? 'rgba(76, 175, 80, 0.1)' 
                  : 'rgba(244, 67, 54, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            >
              {trendMetric >= 0 ? (
                <TrendingUpIcon 
                  sx={{ 
                    color: '#4CAF50',
                    fontSize: '1rem'
                  }} 
                />
              ) : (
                <TrendingDownIcon 
                  sx={{ 
                    color: '#F44336',
                    fontSize: '1rem'
                  }} 
                />
              )}
              <Typography 
                variant="caption"
                sx={{ 
                  color: trendMetric >= 0 ? '#4CAF50' : '#F44336',
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
              backgroundColor: 'rgba(0, 255, 209, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: platformColor || '#00FFD1',
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

const IngresosMetrics = ({ ingresos }) => {
  const calculateMetrics = () => {
    // -- Aquí estaba la lógica que siempre filtraba por el mes actual y anterior --
    //    const now = DateTime.now();
    //    const currentMonth = now.startOf('month');
    //    const previousMonth = currentMonth.minus({ months: 1 });
    //    const daysInMonth = now.daysInMonth;
    //    const currentDay = now.day;
    //
    //    // Filtrar ingresos por período
    //    const currentMonthIngresos = ingresos.filter(ingreso => 
    //      DateTime.fromISO(ingreso.fecha) >= currentMonth
    //    );
    //    const previousMonthIngresos = ingresos.filter(ingreso => 
    //      DateTime.fromISO(ingreso.fecha) >= previousMonth &&
    //      DateTime.fromISO(ingreso.fecha) < currentMonth
    //    );
    //
    // Para mostrar las métricas de la data FILTRADA (que ya nos pasa el padre),
    // usaremos directamente "ingresos" como si fuera "currentMonthIngresos".
    
    const currentMonthIngresos = ingresos;
    // Si deseamos, dejamos un arreglo vacío para "previousMonthIngresos",
    // para no romper la referencia en la suma anterior:
    const previousMonthIngresos = [];

    // Mantenemos la lógica de "mes actual" para la proyección, 
    // aunque ahora esté algo desconectada del rango filtrado.
    const now = DateTime.now();
    const daysInMonth = now.daysInMonth;
    const currentDay = now.day;

    // Totales
    const currentMonthTotal = currentMonthIngresos.reduce((sum, ingreso) => 
      sum + ingreso.monto, 0
    );
    const previousMonthTotal = previousMonthIngresos.reduce((sum, ingreso) => 
      sum + ingreso.monto, 0
    );

    // Métricas por producto (basadas en la data que llega filtrada)
    const productMetrics = currentMonthIngresos.reduce((acc, ingreso) => {
      acc[ingreso.concepto] = {
        count: (acc[ingreso.concepto]?.count || 0) + 1,
        total: (acc[ingreso.concepto]?.total || 0) + ingreso.monto
      };
      return acc;
    }, {});

    // Métricas por plataforma
    const platformMetrics = currentMonthIngresos.reduce((acc, ingreso) => {
      if (!acc[ingreso.plataforma]) {
        acc[ingreso.plataforma] = {
          total: 0,
          count: 0
        };
      }
      acc[ingreso.plataforma].total += ingreso.monto;
      acc[ingreso.plataforma].count += 1;
      return acc;
    }, {});

    // Calcular proyección mensual (basado en día actual vs. mes completo).
    // Si el rango filtrado no coincide con el mes entero, este valor será "aprox".
    const dailyAverage = currentDay ? (currentMonthTotal / currentDay) : 0;
    const projectedTotal = dailyAverage * daysInMonth;
    const progressPercentage = projectedTotal ? (currentMonthTotal / projectedTotal) * 100 : 0;

    // Identificar plataforma principal
    const topPlatform = Object.entries(platformMetrics)
      .sort(([,a], [,b]) => b.total - a.total)[0] || ['N/A', { total: 0, count: 0 }];

    return {
      currentMonthTotal,
      previousMonthTotal,
      // Para la variación vs. mes anterior, como no tenemos "previousMonthIngresos",
      // quedará forzado a 100%. Si deseas otra lógica, deberías pasar data no filtrada:
      percentageChange: previousMonthTotal === 0
        ? 100
        : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100,
      dailyAverage,
      projectedTotal,
      progressPercentage,
      productMetrics,
      topPlatform,
      transactionCount: currentMonthIngresos.length
    };
  };

  const metrics = calculateMetrics();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          title="Ingresos del Mes"
          mainMetric={`$${metrics.currentMonthTotal.toLocaleString()}`}
          secondaryMetric={`${metrics.transactionCount} transacciones totales`}
          trendMetric={metrics.percentageChange}
          icon={WalletIcon}
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
          title="Plataforma Principal"
          mainMetric={metrics.topPlatform[0]}
          secondaryMetric={`$${metrics.topPlatform[1].total.toLocaleString()}`}
          icon={PaymentsIcon}
          platformColor={PLATAFORMA_COLORS[metrics.topPlatform[0]]}
          progress={metrics.currentMonthTotal 
            ? (metrics.topPlatform[1].total / metrics.currentMonthTotal) * 100 
            : 0}
          tooltip={`${metrics.topPlatform[1].count} transacciones`}
        />
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <MetricCard
          title="Productos Vendidos"
          mainMetric={metrics.transactionCount}
          secondaryMetric={Object.entries(metrics.productMetrics)
            .map(([product, data]) => `${data.count} ${product}`)
            .join(' · ')}
          icon={TrendingIcon}
          progress={metrics.projectedTotal 
            ? (metrics.currentMonthTotal / metrics.projectedTotal) * 100 
            : 0}
          tooltip={`Total: $${metrics.currentMonthTotal.toLocaleString()}`}
        />
      </Grid>
    </Grid>
  );
};

export default IngresosMetrics;
