import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Collapse,
  Paper,
  Button,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

// Ajustamos las opciones de status para que correspondan a tus 4 estados de CRM
// o a los que uses. Aquí solo está un ejemplo, adáptalo a tu caso real.
const crmStatusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'LEAD', label: 'Lead Potencial' },
  { value: 'CLIENTE_INACTIVO', label: 'Cliente Inactivo' },
  { value: 'CLIENTE_ACTIVO', label: 'Cliente Activo' },
  { value: 'EX_CLIENTE', label: 'Ex Cliente' },
];

// Opciones de fuente
const sourceOptions = [
  { value: 'all', label: 'Todas las fuentes' },
  { value: 'Facebook Ads', label: 'Facebook Ads' },
  { value: 'Instagram Ads', label: 'Instagram Ads' },
  { value: 'Referido', label: 'Referido' },
  { value: 'Orgánico', label: 'Orgánico' },
  { value: 'TikTok', label: 'TikTok' },
];

const dateRangeOptions = [
  { value: 'all', label: 'Todo el tiempo' },
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'quarter', label: 'Este trimestre' },
];

const LeadFilters = ({ filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  // Sincronizamos el estado local con los filtros que nos llegan por props
  const [activeFilters, setActiveFilters] = useState({
    status: filters.status || 'all',
    source: filters.source || 'all',
    dateRange: filters.dateRange || 'all',
    searchTerm: filters.searchTerm || '',
  });

  // Para controlar la barra de búsqueda
  const handleSearchChange = (event) => {
    const newValue = event.target.value;
    const newFilters = { ...activeFilters, searchTerm: newValue };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Controla cambios de estado, fuente, etc.
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: value,
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Limpia todos los filtros
  const clearFilters = () => {
    const defaultFilters = {
      status: 'all',
      source: 'all',
      dateRange: 'all',
      searchTerm: '',
    };
    setActiveFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Contamos cuántos filtros están activos (excluyendo 'all' y searchTerm vacío)
  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.status !== 'all') count++;
    if (activeFilters.source !== 'all') count++;
    if (activeFilters.dateRange !== 'all') count++;
    // El searchTerm también lo contamos como un "filtro" si está lleno
    if (activeFilters.searchTerm.trim().length > 0) count++;
    return count;
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search and Filter Toggle */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nombre, email o país..."
          value={activeFilters.searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#AAAAAA', mr: 1 }} />,
            sx: { 
              color: '#FFFFFF',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              '&:hover fieldset': { borderColor: '#FFFFFF' },
              '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
            }
          }}
          sx={{
            '& label': { color: '#FFFFFF' },
            '& label.Mui-focused': { color: '#00FFD1' },
          }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          endIcon={
            getActiveFilterCount() > 0 && (
              <Chip 
                label={getActiveFilterCount()} 
                size="small"
                sx={{
                  backgroundColor: '#00FFD1',
                  color: '#1E1E1E',
                  height: 20,
                  minWidth: 20,
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            )
          }
          sx={{
            color: '#00FFD1',
            borderColor: 'rgba(0, 255, 209, 0.5)',
            '&:hover': {
              borderColor: '#00FFD1',
              backgroundColor: 'rgba(0, 255, 209, 0.1)',
            }
          }}
        >
          Filtros
        </Button>
      </Box>

      {/* Filter Panel */}
      <Collapse in={showFilters}>
        <Paper sx={{ 
          p: 2, 
          mb: 2, 
          backgroundColor: '#262626',
          border: '1px solid rgba(0, 255, 209, 0.1)'
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Estado (CRM)"
                value={activeFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                sx={{
                  '& label': { color: '#FFFFFF' },
                  '& label.Mui-focused': { color: '#00FFD1' },
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                  },
                }}
              >
                {crmStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Fuente"
                value={activeFilters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                sx={{
                  '& label': { color: '#FFFFFF' },
                  '& label.Mui-focused': { color: '#00FFD1' },
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                  },
                }}
              >
                {sourceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Rango de fecha"
                value={activeFilters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                sx={{
                  '& label': { color: '#FFFFFF' },
                  '& label.Mui-focused': { color: '#00FFD1' },
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#00FFD1' },
                  },
                }}
              >
                {dateRangeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{ color: '#AAAAAA' }}
            >
              Limpiar filtros
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {/* status */}
          {activeFilters.status !== 'all' && (
            <Chip
              label={
                crmStatusOptions.find((opt) => opt.value === activeFilters.status)?.label
              }
              onDelete={() => handleFilterChange('status', 'all')}
              sx={{
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
                color: '#00FFD1',
                '& .MuiChip-deleteIcon': {
                  color: '#00FFD1',
                  '&:hover': { color: '#FFFFFF' }
                }
              }}
            />
          )}

          {/* source */}
          {activeFilters.source !== 'all' && (
            <Chip
              label={
                sourceOptions.find((opt) => opt.value === activeFilters.source)?.label
              }
              onDelete={() => handleFilterChange('source', 'all')}
              sx={{
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
                color: '#00FFD1',
                '& .MuiChip-deleteIcon': {
                  color: '#00FFD1',
                  '&:hover': { color: '#FFFFFF' }
                }
              }}
            />
          )}

          {/* dateRange */}
          {activeFilters.dateRange !== 'all' && (
            <Chip
              label={
                dateRangeOptions.find((opt) => opt.value === activeFilters.dateRange)?.label
              }
              onDelete={() => handleFilterChange('dateRange', 'all')}
              sx={{
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
                color: '#00FFD1',
                '& .MuiChip-deleteIcon': {
                  color: '#00FFD1',
                  '&:hover': { color: '#FFFFFF' }
                }
              }}
            />
          )}

          {/* searchTerm */}
          {activeFilters.searchTerm.trim().length > 0 && (
            <Chip
              label={`Buscar: "${activeFilters.searchTerm}"`}
              onDelete={() => handleFilterChange('searchTerm', '')}
              sx={{
                backgroundColor: 'rgba(0, 255, 209, 0.1)',
                color: '#00FFD1',
                '& .MuiChip-deleteIcon': {
                  color: '#00FFD1',
                  '&:hover': { color: '#FFFFFF' }
                }
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default LeadFilters;
