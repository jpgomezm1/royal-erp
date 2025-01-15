import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  ButtonBase,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Analytics as ChartIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { ingresoService } from '../../../../services/api';

// Importación de subcomponentes
import IngresosMetrics from './components/IngresosMetrics';
import IngresosTable from './components/IngresosTable';
import IngresosCharts from './components/IngresosCharts';
import NewIngresoDialog from './components/NewIngresoDialog';
import BulkUploadDialog from './components/BulkUploadDialog';

const Ingresos = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estado global de ingresos
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIngreso, setSelectedIngreso] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openCharts, setOpenCharts] = useState(false);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  
  // Filtros específicos para Table y Metrics
  const [tableFilters, setTableFilters] = useState({
    startDate: DateTime.now().startOf('month'),
    endDate: DateTime.now().endOf('month'),
    plataforma: 'all',
    searchTerm: ''
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchIngresos();
  }, []);

  const fetchIngresos = async () => {
    try {
      const data = await ingresoService.getAllIngresos();
      setIngresos(data);
    } catch (error) {
      showNotification('Error al cargar los ingresos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAddIngreso = async (newIngreso) => {
    try {
      const saved = await ingresoService.createIngreso(newIngreso);
      setIngresos([saved, ...ingresos]);
      setOpenNewDialog(false);
      showNotification('Ingreso registrado exitosamente');
    } catch (error) {
      showNotification('Error al registrar el ingreso', 'error');
    }
  };

  const handleEditIngreso = (ingreso) => {
    setSelectedIngreso(ingreso);
    setOpenNewDialog(true);
  };

  const handleDeleteIngreso = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este ingreso?')) {
      try {
        await ingresoService.deleteIngreso(id);
        setIngresos(ingresos.filter(ing => ing.id !== id));
        showNotification('Ingreso eliminado exitosamente');
      } catch (error) {
        showNotification('Error al eliminar el ingreso', 'error');
      }
    }
  };

  const handleTableFilterChange = (newFilters) => {
    setTableFilters(newFilters);
  };

  const handleBulkUploadSuccess = async (result) => {
    fetchIngresos();
    showNotification(result.message || 'Registros cargados exitosamente');
  };

  // Filtrar ingresos para Table y Metrics
  const filteredIngresos = ingresos.filter(ingreso => {
    const ingresoDate = DateTime.fromISO(ingreso.fecha);
    
    const matchesDate = (!tableFilters.startDate || ingresoDate >= tableFilters.startDate) &&
                     (!tableFilters.endDate || ingresoDate <= tableFilters.endDate);
    const matchesPlatform = tableFilters.plataforma === 'all' || ingreso.plataforma === tableFilters.plataforma;
    const matchesSearch = ingreso.concepto.toLowerCase().includes(tableFilters.searchTerm.toLowerCase());
    
    return matchesDate && matchesPlatform && matchesSearch;
  });

  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh',
        backgroundColor: '#1E1E1E',
        pt: 3,
        px: { xs: 2, sm: 3 },
        pb: 4,
        position: 'relative'
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
              Gestión de Ingresos
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#AAAAAA'
              }}
            >
              {DateTime.now().toFormat('MMMM yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Ver análisis gráfico">
              <ButtonBase
                onClick={() => setOpenCharts(true)}
                sx={{
                  backgroundColor: 'rgba(0, 255, 209, 0.1)',
                  borderRadius: '50%',
                  width: 45,
                  height: 45,
                  color: '#00FFD1',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 209, 0.2)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <ChartIcon />
              </ButtonBase>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewDialog(true)}
              sx={{
                backgroundColor: '#00FFD1',
                color: '#1E1E1E',
                px: 3,
                '&:hover': {
                  backgroundColor: '#00CCB7',
                },
              }}
            >
              Nuevo Ingreso
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenBulkUploadDialog(true)}
              sx={{
                backgroundColor: '#00AC47',
                color: '#FFF',
                '&:hover': { backgroundColor: '#00712f' },
              }}
            >
              Carga Masiva
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Metrics Summary - Using filtered data */}
      <Box sx={{ mb: 4, width: '100%' }}>
        <IngresosMetrics 
          ingresos={filteredIngresos}
          loading={loading} 
        />
      </Box>

      {/* Main Content - Table with filters */}
      <Fade in={!openCharts || isMobile}>
        <Box 
          sx={{ 
            width: '100%',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <IngresosTable 
            ingresos={filteredIngresos}
            filters={tableFilters}
            onFilterChange={handleTableFilterChange}
            loading={loading}
            onEdit={handleEditIngreso}
            onDelete={handleDeleteIngreso}
          />
        </Box>
      </Fade>

      {/* Drawer para Gráficos - Using all data */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={openCharts}
        onClose={() => setOpenCharts(false)}
        elevation={0}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : '85%',
            height: isMobile ? '90%' : '100%',
            backgroundColor: '#1E1E1E',
            borderLeft: '1px solid rgba(0, 255, 209, 0.1)',
            backgroundImage: 'linear-gradient(to bottom right, rgba(0, 255, 209, 0.03), rgba(0, 0, 0, 0))',
            overflow: 'hidden'
          }
        }}
        SlideProps={{
          timeout: 400
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
          }}
        >
          {/* Drawer Header */}
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
              <ChartIcon sx={{ color: '#00FFD1', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                  Análisis Gráfico
                </Typography>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  {ingresos.length} transacciones disponibles
                </Typography>
              </Box>
            </Box>
            
            <IconButton 
              onClick={() => setOpenCharts(false)}
              sx={{ 
                color: '#FFFFFF',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Paper>

          {/* Drawer Content - Using all data */}
          <Box 
            sx={{ 
              flex: 1,
              overflow: 'auto',
              p: 3
            }}
          >
            <IngresosCharts 
              ingresos={ingresos}  // Passing all ingresos without filters
              loading={loading}
            />
          </Box>
        </Box>
      </Drawer>

      {/* Dialogs */}
      <NewIngresoDialog
        open={openNewDialog}
        onClose={() => setOpenNewDialog(false)}
        onSave={handleAddIngreso}
        ingreso={selectedIngreso}
      />

      <BulkUploadDialog
        open={openBulkUploadDialog}
        onClose={() => setOpenBulkUploadDialog(false)}
        onUploadSuccess={handleBulkUploadSuccess}
      />

      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Ingresos;