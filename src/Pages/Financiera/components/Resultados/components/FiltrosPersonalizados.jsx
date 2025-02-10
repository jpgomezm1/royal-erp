import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const FiltrosPersonalizados = ({
  showCustomFilters,
  setShowCustomFilters,
  customFilterMode,
  setCustomFilterMode,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  customMonth,
  setCustomMonth,
  customYear,
  setCustomYear,
  applyCustomFilter,
  clearFilters
}) => {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 10}, (_, i) => currentYear - i);

  return (
    <Collapse in={showCustomFilters}>
      <Paper
        elevation={3}
        sx={{ 
          backgroundColor: '#2C2C2C',
          mb: 3,
          borderRadius: 2,
          p: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ color: '#FFFFFF', fontWeight: 500 }}
          >
            Filtro Personalizado
          </Typography>
          <IconButton 
            onClick={() => setShowCustomFilters(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#FFFFFF' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

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
            mb: 3,
            width: '100%',
            '& .MuiToggleButton-root': {
              flex: 1,
              borderColor: 'rgba(255, 255, 255, 0.23)',
              color: '#FFFFFF',
              py: 1.5,
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
            <Stack spacing={2} sx={{ mb: 3 }}>
              <DatePicker
                label="Fecha de Inicio"
                value={customStartDate}
                onChange={setCustomStartDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#FFFFFF',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00FFD1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00FFD1',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
              />
              <DatePicker
                label="Fecha de Fin"
                value={customEndDate}
                onChange={setCustomEndDate}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#FFFFFF',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00FFD1',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00FFD1',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
              />
            </Stack>
          )}

          {customFilterMode === 'month' && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel 
                id="month-select-label"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Selecciona Mes
              </InputLabel>
              <Select
                labelId="month-select-label"
                value={customMonth || ''}
                onChange={(e) => setCustomMonth(e.target.value)}
                label="Selecciona Mes"
                sx={{
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00FFD1',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00FFD1',
                  },
                }}
              >
                {monthNames.map((month, index) => (
                  <MenuItem key={index} value={index}>{month}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {customFilterMode === 'year' && (
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel 
                id="year-select-label"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Selecciona Año
              </InputLabel>
              <Select
                labelId="year-select-label"
                value={customYear || ''}
                onChange={(e) => setCustomYear(e.target.value)}
                label="Selecciona Año"
                sx={{
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00FFD1',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00FFD1',
                  },
                }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </LocalizationProvider>

        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="flex-end"
          sx={{ mt: 2 }}
        >
          <Button 
            variant="outlined" 
            startIcon={<DeleteOutlineIcon />}
            onClick={clearFilters}
            sx={{
              borderColor: '#FF5252',
              color: '#FF5252',
              '&:hover': {
                backgroundColor: 'rgba(255, 82, 82, 0.1)',
                borderColor: '#FF5252'
              }
            }}
          >
            Limpiar Filtros
          </Button>
          <Button 
            variant="contained"
            startIcon={<CalendarTodayIcon />}
            onClick={applyCustomFilter}
            sx={{
              backgroundColor: '#00FFD1',
              color: '#1E1E1E',
              '&:hover': {
                backgroundColor: '#00CCB7'
              }
            }}
          >
            Aplicar Filtro
          </Button>
        </Stack>
      </Paper>
    </Collapse>
  );
};

export default FiltrosPersonalizados;