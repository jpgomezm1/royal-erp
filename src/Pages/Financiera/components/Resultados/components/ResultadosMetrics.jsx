import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color, info }) => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: '#2C2C2C',
      p: 2.5,
      height: '100%',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          p: 1,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon sx={{ color, fontSize: 24 }} />
      </Box>
      {trend && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backgroundColor: trend >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            p: '4px 8px',
            borderRadius: '6px'
          }}
        >
          {trend >= 0 ? (
            <TrendingUpIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
          ) : (
            <TrendingDownIcon sx={{ color: '#F44336', fontSize: 16 }} />
          )}
          <Typography
            variant="caption"
            sx={{
              color: trend >= 0 ? '#4CAF50' : '#F44336',
              fontWeight: 600
            }}
          >
            {Math.abs(trend)}%
          </Typography>
        </Box>
      )}
    </Box>

    <Tooltip title={info || ''} arrow placement="top">
      <Box>
        <Typography
          variant="body2"
          sx={{
            color: '#AAAAAA',
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: '#FFFFFF',
            fontWeight: 600,
            mb: 0.5
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: '#AAAAAA'
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Tooltip>
  </Paper>
);

const ResultadosMetrics = ({ data }) => {
  if (!data) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Ingresos Totales"
          value={`$${data.total_ingresos.toLocaleString()}`}
          icon={MoneyIcon}
          color="#00FFD1"
          info="Total de ingresos en el período seleccionado"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Egresos Totales"
          value={`$${data.total_egresos.toLocaleString()}`}
          icon={BalanceIcon}
          color="#FF6347"
          info="Total de egresos en el período seleccionado"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Utilidad"
          value={`$${data.utilidad.toLocaleString()}`}
          subtitle={`Margen: ${data.margen}%`}
          icon={TimelineIcon}
          trend={data.margen}
          color="#4CAF50"
          info="Utilidad neta y margen de beneficio"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="ROI"
          value={`${data.roi}%`}
          subtitle={`Operating Ratio: ${data.operating_ratio}%`}
          icon={AssessmentIcon}
          color="#FFC107"
          info="Retorno sobre la inversión y ratio operativo"
        />
      </Grid>
    </Grid>
  );
};

export default ResultadosMetrics;