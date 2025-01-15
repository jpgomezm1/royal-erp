import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { 
  FilterList as FilterIcon,
  CalendarMonth as CalendarIcon,
  CompareArrows as CompareIcon,
  Category as CategoryIcon,
  ShowChart as ChartIcon,
  Clear as ClearIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { TIPOS_GASTO, METODO_PAGO_COLORS } from '../../../../../constants/gastos';

const VIEW_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

const TIME_RANGES = {
  LAST_7_DAYS: { label: 'Últimos 7 días', days: 7 },
  LAST_30_DAYS: { label: 'Últimos 30 días', days: 30 },
  LAST_90_DAYS: { label: 'Últimos 90 días', days: 90 },
  LAST_180_DAYS: { label: 'Últimos 6 meses', days: 180 },
  YEAR_TO_DATE: { label: 'Año actual', days: 'ytd' }
};

const COMPARISON_OPTIONS = {
  PREVIOUS_PERIOD: 'previous_period',
  PREVIOUS_YEAR: 'previous_year',
  NONE: 'none'
};

const EgresosChartsFilters = ({ 
  filters, 
  onFilterChange,
  onReset 
}) => {
  const [viewType, setViewType] = useState(VIEW_TYPES.DAILY);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [comparisonType, setComparisonType] = useState(COMPARISON_OPTIONS.PREVIOUS_PERIOD);

  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
      onFilterChange({
        ...filters,
        viewType: newViewType
      });
    }
  };

  const handleTimeRangeChange = (range) => {
    let startDate;
    if (range.days === 'ytd') {
      startDate = DateTime.now().startOf('year');
    } else {
      startDate = DateTime.now().minus({ days: range.days });
    }

    onFilterChange({
      ...filters,
      startDate,
      endDate: DateTime.now()
    });
  };

  const handleCategoryToggle = (category) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newSelection);
    onFilterChange({
      ...filters,
      tipoGasto: newSelection.length ? newSelection : ['all']
    });
  };

  const handlePaymentMethodToggle = (method) => {
    const newSelection = selectedPaymentMethods.includes(method)
      ? selectedPaymentMethods.filter(m => m !== method)
      : [...selectedPaymentMethods, method];
    
    setSelectedPaymentMethods(newSelection);
    onFilterChange({
      ...filters,
      metodoPago: newSelection.length ? newSelection : ['all']
    });
  };

  const handleComparisonChange = (event) => {
    const newComparisonType = event.target.value;
    setComparisonType(newComparisonType);
    onFilterChange({
      ...filters,
      comparisonType: newComparisonType
    });
  };

  const handleReset = () => {
    setViewType(VIEW_TYPES.DAILY);
    setSelectedCategories([]);
    setSelectedPaymentMethods([]);
    setComparisonType(COMPARISON_OPTIONS.PREVIOUS_PERIOD);
    onReset();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: '#2C2C2C',
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header con Título y Botón Reset */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ fontSize: 20 }} />
          Configuración de Visualización
        </Typography>
        <Button
          size="small"
          startIcon={<ClearIcon />}
          onClick={handleReset}
          sx={{
            color: '#FF6347',
            '&:hover': { backgroundColor: 'rgba(255, 99, 71, 0.1)' }
          }}
        >
          Resetear
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Tipo de Vista */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChartIcon sx={{ fontSize: 16 }} />
              Tipo de Vista
            </Typography>
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewTypeChange}
              sx={{ bgcolor: '#1E1E1E' }}
            >
              <ToggleButton 
                value={VIEW_TYPES.DAILY}
                sx={{ 
                  color: '#FFFFFF',
                  '&.Mui-selected': { color: '#FF6347' }
                }}
              >
                Diario
              </ToggleButton>
              <ToggleButton 
                value={VIEW_TYPES.WEEKLY}
                sx={{ 
                  color: '#FFFFFF',
                  '&.Mui-selected': { color: '#FF6347' }
                }}
              >
                Semanal
              </ToggleButton>
              <ToggleButton 
                value={VIEW_TYPES.MONTHLY}
                sx={{ 
                  color: '#FFFFFF',
                  '&.Mui-selected': { color: '#FF6347' }
                }}
              >
                Mensual
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>

        {/* Rango de Tiempo */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon sx={{ fontSize: 16 }} />
            Rango de Tiempo
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {Object.entries(TIME_RANGES).map(([key, range]) => (
              <Button
                key={key}
                variant="outlined"
                size="small"
                onClick={() => handleTimeRangeChange(range)}
                sx={{
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                  '&:hover': {
                    borderColor: '#FF6347',
                    backgroundColor: 'rgba(255, 99, 71, 0.1)'
                  }
                }}
              >
                {range.label}
              </Button>
            ))}
          </Stack>
        </Grid>

        {/* Categorías de Gasto */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon sx={{ fontSize: 16 }} />
            Categorías de Gasto
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {Object.entries(TIPOS_GASTO).map(([key, value]) => (
              <Chip
                key={key}
                label={value}
                onClick={() => handleCategoryToggle(key)}
                sx={{
                  bgcolor: selectedCategories.includes(key) ? 'rgba(255, 99, 71, 0.2)' : 'transparent',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 99, 71, 0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 99, 71, 0.1)'
                  }
                }}
              />
            ))}
          </Stack>
        </Grid>

        {/* Métodos de Pago */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentsIcon sx={{ fontSize: 16 }} />
            Métodos de Pago
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {Object.keys(METODO_PAGO_COLORS).map((method) => (
              <Chip
                key={method}
                label={method}
                onClick={() => handlePaymentMethodToggle(method)}
                sx={{
                  bgcolor: selectedPaymentMethods.includes(method) ? METODO_PAGO_COLORS[method] + '33' : 'transparent',
                  color: '#FFFFFF',
                  border: `1px solid ${METODO_PAGO_COLORS[method]}`,
                  '&:hover': {
                    bgcolor: METODO_PAGO_COLORS[method] + '22'
                  }
                }}
              />
            ))}
          </Stack>
        </Grid>

        {/* Comparación */}
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ color: '#AAAAAA', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CompareIcon sx={{ fontSize: 16 }} />
            Comparar con
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={comparisonType}
              onChange={handleComparisonChange}
              sx={{
                color: '#FFFFFF',
                bgcolor: '#1E1E1E',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                }
              }}
            >
              <MenuItem value={COMPARISON_OPTIONS.NONE}>Sin comparación</MenuItem>
              <MenuItem value={COMPARISON_OPTIONS.PREVIOUS_PERIOD}>Período anterior</MenuItem>
              <MenuItem value={COMPARISON_OPTIONS.PREVIOUS_YEAR}>Año anterior</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EgresosChartsFilters;