import React, { useState, useEffect } from 'react'; 
import { 
  Box, 
  Typography, 
  Paper,
  ButtonGroup,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
  CircularProgress,
  TextField,
  Collapse
} from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  Analytics as ChartIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { resultadosService } from '../../../../services/api';

// Importación de subcomponentes
import ResultadosMetrics from './components/ResultadosMetrics';
import ResultadosTimeChart from './components/ResultadosTimeChart';
import ResultadosDesglose from './components/ResultadosDesglose';
import ResultadosDrawer from './components/ResultadosDrawer';

const PERIODS = {
  WEEK: { label: 'Semanal', value: 'week' },
  MONTH: { label: 'Mensual', value: 'month' },
  QUARTER: { label: 'Trimestral', value: 'quarter' },
  YEAR: { label: 'Anual', value: 'year' }
};

const DATE_RANGES = {
  MONTH: { label: 'Último Mes', days: 30 },
  QUARTER: { label: 'Último Trimestre', days: 90 },
  SEMESTER: { label: 'Último Semestre', days: 180 },
  YEAR: { label: 'Último Año', days: 365 }
};

const Resultados = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS.MONTH.value);
  const [filters, setFilters] = useState({
    startDate: DateTime.now().minus({ days: 30 }),
    endDate: DateTime.now(),
    period: PERIODS.MONTH.value
  });

  // Estados para el filtro personalizado
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const [customFilterMode, setCustomFilterMode] = useState('dateRange'); // Opciones: 'dateRange', 'month', 'year'
  const [customStartDate, setCustomStartDate] = useState(filters.startDate);
  const [customEndDate, setCustomEndDate] = useState(filters.endDate);
  const [customMonth, setCustomMonth] = useState(DateTime.now());
  const [customYear, setCustomYear] = useState(DateTime.now());

  useEffect(() => {
    fetchResultados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchResultados = async () => {
    try {
      const data = await resultadosService.getResultadosStats(filters);
      setResultados(data);
    } catch (error) {
      console.error('Error fetching resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    setFilters({ ...filters, period: newPeriod });
  };

  const handleDateRangeChange = (days) => {
    setFilters({
      ...filters,
      startDate: DateTime.now().minus({ days }),
      endDate: DateTime.now()
    });
  };

  const applyCustomFilter = () => {
    let newFilters = { ...filters };
    if (customFilterMode === 'dateRange') {
      newFilters.startDate = customStartDate;
      newFilters.endDate = customEndDate;
    } else if (customFilterMode === 'month') {
      newFilters.startDate = customMonth.startOf('month');
      newFilters.endDate = customMonth.endOf('month');
    } else if (customFilterMode === 'year') {
      newFilters.startDate = customYear.startOf('year');
      newFilters.endDate = customYear.endOf('year');
    }
    setFilters(newFilters);
    setShowCustomFilters(false);
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress sx={{ color: '#00FFD1' }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh',
        backgroundColor: '#1E1E1E',
        pt: 3,
        px: { xs: 2, sm: 3 },
        pb: 4,
      }}
    >
      {/* Header section */}
      <Paper
        elevation={0}
        sx={{ 
          backgroundColor: '#2C2C2C',
          mb: 3,
          borderRadius: 2,
          p: 2.5,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#FFFFFF',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              Estado de Resultados
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: '#AAAAAA' }}
            >
              {filters.startDate.toFormat('dd/MM/yyyy')} - {filters.endDate.toFormat('dd/MM/yyyy')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ButtonGroup 
              variant="outlined" 
              sx={{ 
                '& .MuiButton-root': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: '#00FFD1',
                    backgroundColor: 'rgba(0, 255, 209, 0.1)'
                  },
                  '&.active': {
                    backgroundColor: '#00FFD1',
                    color: '#1E1E1E',
                    '&:hover': {
                      backgroundColor: '#00CCB7'
                    }
                  }
                }
              }}
            >
              {Object.values(DATE_RANGES).map(({ label, days }) => (
                <Button
                  key={days}
                  onClick={() => handleDateRangeChange(days)}
                  className={filters.startDate.diffNow('days').days === -days ? 'active' : ''}
                  startIcon={<DateRangeIcon />}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>

            <IconButton
              onClick={() => setOpenDrawer(true)}
              sx={{
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
                borderRadius: '50%',
                width: 45,
                height: 45,
                color: '#00FFD1',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 209, 0.2)'
                }
              }}
            >
              <ChartIcon />
            </IconButton>

            <Button 
              variant="outlined" 
              onClick={() => setShowCustomFilters(!showCustomFilters)}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: '#FFFFFF',
                '&:hover': {
                  borderColor: '#00FFD1',
                  backgroundColor: 'rgba(0, 255, 209, 0.1)'
                }
              }}
            >
              Personalizar Filtro
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Custom Filter Section */}
      <Collapse in={showCustomFilters}>
        <Paper
          elevation={0}
          sx={{ 
            backgroundColor: '#2C2C2C',
            mb: 3,
            borderRadius: 2,
            p: 2.5,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ color: '#FFFFFF', mb: 2 }}
          >
            Filtro Personalizado
          </Typography>
          <ToggleButtonGroup
            value={customFilterMode}
            exclusive
            onChange={(e, newMode) => {
              if(newMode !== null) {
                setCustomFilterMode(newMode);
              }
            }}
            aria-label="Custom Filter Mode"
            sx={{
              mb: 2,
              '& .MuiToggleButton-root': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: '#FFFFFF',
                '&:hover': {
                  borderColor: '#00FFD1',
                  backgroundColor: 'rgba(0, 255, 209, 0.1)'
                },
                '&.Mui-selected': {
                  backgroundColor: '#00FFD1',
                  color: '#1E1E1E',
                  '&:hover': {
                    backgroundColor: '#00CCB7'
                  }
                }
              }
            }}
          >
            <ToggleButton value="dateRange" aria-label="Rango de Fechas">
              Rango de Fechas
            </ToggleButton>
            <ToggleButton value="month" aria-label="Mes">
              Mes
            </ToggleButton>
            <ToggleButton value="year" aria-label="Año">
              Año
            </ToggleButton>
          </ToggleButtonGroup>

          <LocalizationProvider dateAdapter={AdapterLuxon}>
            {customFilterMode === 'dateRange' && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <DatePicker
                  label="Fecha de Inicio"
                  value={customStartDate}
                  onChange={(newValue) => {
                    setCustomStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ input: { color: '#FFFFFF' } }} />}
                />
                <DatePicker
                  label="Fecha de Fin"
                  value={customEndDate}
                  onChange={(newValue) => {
                    setCustomEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ input: { color: '#FFFFFF' } }} />}
                />
              </Box>
            )}
            {customFilterMode === 'month' && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <DatePicker
                  label="Selecciona Mes"
                  views={['year', 'month']}
                  value={customMonth}
                  onChange={(newValue) => {
                    setCustomMonth(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ input: { color: '#FFFFFF' } }} />}
                />
              </Box>
            )}
            {customFilterMode === 'year' && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <DatePicker
                  label="Selecciona Año"
                  views={['year']}
                  value={customYear}
                  onChange={(newValue) => {
                    setCustomYear(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ input: { color: '#FFFFFF' } }} />}
                />
              </Box>
            )}
          </LocalizationProvider>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={applyCustomFilter}
              sx={{
                borderColor: '#00FFD1',
                color: '#00FFD1',
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 209, 0.1)',
                  borderColor: '#00FFD1'
                }
              }}
            >
              Aplicar Filtro
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setShowCustomFilters(false)}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.23)',
                color: '#FFFFFF',
                '&:hover': {
                  borderColor: '#00FFD1',
                  backgroundColor: 'rgba(0, 255, 209, 0.1)'
                }
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* Main Content */}
      <Box sx={{ mb: 4 }}>
        <ResultadosMetrics data={resultados?.resumen} />
      </Box>

      {/* Period Selector */}
      <Box sx={{ mb: 3 }}>
        <ButtonGroup 
          variant="outlined" 
          sx={{ 
            '& .MuiButton-root': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
              color: '#FFFFFF',
              '&:hover': {
                borderColor: '#00FFD1',
                backgroundColor: 'rgba(0, 255, 209, 0.1)'
              },
              '&.active': {
                backgroundColor: '#00FFD1',
                color: '#1E1E1E',
                '&:hover': {
                  backgroundColor: '#00CCB7'
                }
              }
            }
          }}
        >
          {Object.values(PERIODS).map(({ label, value }) => (
            <Button
              key={value}
              onClick={() => handlePeriodChange(value)}
              className={selectedPeriod === value ? 'active' : ''}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ResultadosTimeChart 
            data={resultados?.tendencia_temporal} 
            period={selectedPeriod}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ResultadosDesglose 
            title="Desglose de Ingresos"
            data={resultados?.desglose_ingresos}
            total={resultados?.resumen.total_ingresos}
            colorScheme="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ResultadosDesglose 
            title="Desglose de Egresos"
            data={resultados?.desglose_egresos}
            total={resultados?.resumen.total_egresos}
            colorScheme="error"
          />
        </Grid>
      </Grid>

      {/* Drawer */}
      <ResultadosDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        data={resultados}
        filters={filters}
        onFilterChange={setFilters}
      />
    </Box>
  );
};

export default Resultados;
