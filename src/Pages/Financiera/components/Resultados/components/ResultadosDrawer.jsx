import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Grid,
  Button,
  ButtonGroup,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  ShowChart as ShowChartIcon,
  FilterList as FilterIcon,
  LocalAtm as MoneyIcon,
  AccountBalance as ExpenseIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DateTime } from 'luxon';
import EstadoResultados from './EstadoResultados';

const MetricTrend = ({ title, data, color }) => {
  const chartData = data?.tendencia_temporal || [];

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: '#2C2C2C',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100%'
      }}
    >
      <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis 
              dataKey="periodo" 
              tick={{ fill: '#AAAAAA' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis 
              tick={{ fill: '#AAAAAA' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              labelStyle={{ color: '#FFFFFF' }}
            />
            <Line 
              type="monotone" 
              dataKey="ingresos" 
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

const ResultadosDrawer = ({ open, onClose, data, filters, onFilterChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('charts'); // 'charts' o 'statement'

  const handleExportData = () => {
    // Aquí iría la lógica para exportar los datos
    console.log('Exportando datos...');
  };

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : '80%',
          height: isMobile ? '90%' : '100%',
          backgroundColor: '#1E1E1E',
          backgroundImage: 'linear-gradient(to bottom right, rgba(0, 255, 209, 0.03), rgba(0, 0, 0, 0))'
        }
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          backgroundColor: '#2C2C2C',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {activeTab === 'charts' ? (
            <ShowChartIcon sx={{ color: '#00FFD1', fontSize: 24 }} />
          ) : (
            <AssessmentIcon sx={{ color: '#00FFD1', fontSize: 24 }} />
          )}
          <Box>
            <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
              {activeTab === 'charts' ? 'Análisis Gráfico' : 'Estado de Resultados'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
              {filters.startDate.toFormat('dd/MM/yyyy')} - {filters.endDate.toFormat('dd/MM/yyyy')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
            <Button
              onClick={() => setActiveTab('charts')}
              sx={{
                color: activeTab === 'charts' ? '#00FFD1' : '#AAAAAA',
                borderColor: 'rgba(255, 255, 255, 0.23)',
                '&:hover': {
                  borderColor: '#00FFD1',
                  backgroundColor: 'rgba(0, 255, 209, 0.1)'
                }
              }}
              startIcon={<ShowChartIcon />}
            >
              Gráficos
            </Button>
            <Button
              onClick={() => setActiveTab('statement')}
              sx={{
                color: activeTab === 'statement' ? '#00FFD1' : '#AAAAAA',
                borderColor: 'rgba(255, 255, 255, 0.23)',
                '&:hover': {
                  borderColor: '#00FFD1',
                  backgroundColor: 'rgba(0, 255, 209, 0.1)'
                }
              }}
              startIcon={<AssessmentIcon />}
            >
              Estado de Resultados
            </Button>
          </ButtonGroup>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
            sx={{
              color: '#00FFD1',
              borderColor: '#00FFD1',
              '&:hover': {
                borderColor: '#00FFD1',
                backgroundColor: 'rgba(0, 255, 209, 0.1)'
              }
            }}
          >
            Exportar Datos
          </Button>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Content */}
      <Box sx={{ p: 3, overflow: 'auto' }}>
        {activeTab === 'charts' ? (
          <Grid container spacing={3}>
            {/* Tendencias */}
            <Grid item xs={12} md={6}>
              <MetricTrend 
                title="Tendencia de Ingresos" 
                data={data} 
                color="#00FFD1"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MetricTrend 
                title="Tendencia de Egresos" 
                data={data} 
                color="#FF6347"
              />
            </Grid>

            {/* KPIs detallados */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: '#2C2C2C',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3 }}>
                  Indicadores Financieros
                </Typography>
                <Grid container spacing={3}>
                  {/* ROI */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                        ROI
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#00FFD1' }}>
                        {data?.resumen?.roi}%
                      </Typography>
                    </Box>
                  </Grid>
                  {/* Operating Ratio */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                        Operating Ratio
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#FF6347' }}>
                        {data?.resumen?.operating_ratio}%
                      </Typography>
                    </Box>
                  </Grid>
                  {/* Margen */}
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                        Margen
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                        {data?.resumen?.margen}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <EstadoResultados 
            data={data} 
            period={`${filters.startDate.toFormat('dd/MM/yyyy')} - ${filters.endDate.toFormat('dd/MM/yyyy')}`}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default ResultadosDrawer;