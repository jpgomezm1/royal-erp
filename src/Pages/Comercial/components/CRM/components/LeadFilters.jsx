import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Collapse,
  Paper,
  Button,
  Typography,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'STUDENT', label: 'Estudiantes Activos' },
  { value: 'LEAD', label: 'Leads Nuevos' },
  { value: 'CONTACTED', label: 'Contactados' },
  { value: 'INTERESTED', label: 'Interesados' },
  { value: 'ENROLLED', label: 'Matriculados' },
  { value: 'LOST', label: 'Perdidos' },
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: filters.status || 'all',
    source: filters.source || 'all',
    dateRange: filters.dateRange || 'all',
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: value,
    };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Implementar lógica de búsqueda
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: 'all',
      source: 'all',
      dateRange: 'all',
    };
    setActiveFilters(defaultFilters);
    setSearchTerm('');
    onFilterChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== 'all').length;
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Search and Filter Toggle */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar leads..."
          value={searchTerm}
          onChange={handleSearch}
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
                label="Estado"
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
                {statusOptions.map((option) => (
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
          {Object.entries(activeFilters).map(([key, value]) => {
            if (value === 'all') return null;
            const option = [...statusOptions, ...sourceOptions, ...dateRangeOptions]
              .find(opt => opt.value === value);
            return option ? (
              <Chip
                key={key}
                label={option.label}
                onDelete={() => handleFilterChange(key, 'all')}
                sx={{
                  backgroundColor: 'rgba(0, 255, 209, 0.1)',
                  color: '#00FFD1',
                  '& .MuiChip-deleteIcon': {
                    color: '#00FFD1',
                    '&:hover': { color: '#FFFFFF' }
                  }
                }}
              />
            ) : null;
          })}
        </Box>
      )}
    </Box>
  );
};

export default LeadFilters;