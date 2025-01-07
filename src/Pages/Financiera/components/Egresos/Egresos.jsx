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
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Add as AddIcon,
  Analytics as ChartIcon,
  Close as CloseIcon,
  Loop as RecurrentIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { DateTime } from 'luxon';
import { egresoService } from '../../../../services/api';

// Importación de subcomponentes
import EgresosMetrics from './components/EgresosMetrics';
import EgresosTable from './components/EgresosTable';
import EgresosCharts from './components/EgresosCharts';
import NewEgresoDialog from './components/NewEgresoDialog';
import BulkUploadDialog from './components/BulkUploadDialog';
import EgresosRecurrentes from './components/EgresosRecurrentes';

const Egresos = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEgreso, setSelectedEgreso] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openCharts, setOpenCharts] = useState(false);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [filters, setFilters] = useState({
    startDate: DateTime.now().startOf('month'),
    endDate: DateTime.now().endOf('month'),
    tipoGasto: 'all',
    searchTerm: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchEgresos();
  }, []);

  const fetchEgresos = async () => {
    try {
      const data = await egresoService.getAllEgresos();
      setEgresos(data);
    } catch (error) {
      showNotification('Error al cargar los egresos', 'error');
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

  const handleAddEgreso = async (newEgreso) => {
    try {
      const saved = await egresoService.createEgreso(newEgreso);
      setEgresos([saved, ...egresos]);
      setOpenNewDialog(false);
      showNotification('Egreso registrado exitosamente');
    } catch (error) {
      showNotification('Error al registrar el egreso', 'error');
    }
  };

  const handleEditEgreso = (egreso) => {
    setSelectedEgreso(egreso);
    setOpenNewDialog(true);
  };

  const handleDeleteEgreso = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este egreso?')) {
      try {
        await egresoService.deleteEgreso(id);
        setEgresos(egresos.filter(egr => egr.id !== id));
        showNotification('Egreso eliminado exitosamente');
      } catch (error) {
        showNotification('Error al eliminar el egreso', 'error');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBulkUploadSuccess = async (result) => {
    fetchEgresos();
    showNotification(result.message || 'Registros cargados exitosamente');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredEgresos = egresos.filter(egreso => {
    const egresoDate = DateTime.fromISO(egreso.fecha);
    
    const matchesDate = (!filters.startDate || egresoDate >= filters.startDate) &&
                       (!filters.endDate || egresoDate <= filters.endDate);
    const matchesTipo = filters.tipoGasto === 'all' || egreso.tipo_gasto === filters.tipoGasto;
    const matchesSearch = egreso.concepto.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesDate && matchesTipo && matchesSearch;
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
      {/* Header section with Tabs */}
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
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#FFFFFF',
              fontWeight: 600,
              mb: 0.5
            }}
          >
            Gestión de Egresos
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#AAAAAA',
              mb: 2
            }}
          >
            {DateTime.now().toFormat('MMMM yyyy')}
          </Typography>
        </Box>

        <Tabs 
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#FFFFFF',
              '&.Mui-selected': {
                color: '#FF6347'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF6347'
            }
          }}
        >
          <Tab 
            label="Egresos" 
            value="1" 
            icon={<PaymentIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Recurrentes" 
            value="2" 
            icon={<RecurrentIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {activeTab === '1' && (
        <>
          {/* Acciones principales */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Tooltip title="Ver análisis gráfico">
              <ButtonBase
                onClick={() => setOpenCharts(true)}
                sx={{
                  backgroundColor: 'rgba(255, 99, 71, 0.1)',
                  borderRadius: '50%',
                  width: 45,
                  height: 45,
                  color: '#FF6347',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 99, 71, 0.2)',
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
                backgroundColor: '#FF6347',
                color: '#FFFFFF',
                px: 3,
                '&:hover': {
                  backgroundColor: '#FF4500',
                },
              }}
            >
              Nuevo Egreso
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenBulkUploadDialog(true)}
              sx={{
                backgroundColor: '#FF8C00',
                color: '#FFF',
                '&:hover': { backgroundColor: '#FF7000' },
              }}
            >
              Carga Masiva
            </Button>
          </Box>

          {/* Metrics Summary */}
          <Box sx={{ mb: 4, width: '100%' }}>
            <EgresosMetrics 
              egresos={filteredEgresos}
              loading={loading} 
            />
          </Box>

          {/* Main Content - Tabla con filtros */}
          <Fade in={!openCharts || isMobile}>
            <Box 
              sx={{ 
                width: '100%',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <EgresosTable 
                egresos={filteredEgresos}
                filters={filters}
                onFilterChange={handleFilterChange}
                loading={loading}
                onEdit={handleEditEgreso}
                onDelete={handleDeleteEgreso}
              />
            </Box>
          </Fade>
        </>
      )}

      {activeTab === '2' && (
        <EgresosRecurrentes />
      )}

      {/* Drawer para Gráficos */}
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
            borderLeft: '1px solid rgba(255, 99, 71, 0.1)',
            backgroundImage: 'linear-gradient(to bottom right, rgba(255, 99, 71, 0.03), rgba(0, 0, 0, 0))',
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
              <ChartIcon sx={{ color: '#FF6347', fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ color: '#FFFFFF' }}>
                  Análisis Gráfico
                </Typography>
                <Typography variant="body2" sx={{ color: '#AAAAAA' }}>
                  {filteredEgresos.length} transacciones analizadas
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

          {/* Drawer Content */}
          <Box 
            sx={{ 
              flex: 1,
              overflow: 'auto',
              p: 3
            }}
          >
            <EgresosCharts 
              egresos={filteredEgresos}
              loading={loading}
            />
          </Box>
        </Box>
      </Drawer>

      {/* New Egreso Dialog */}
      <NewEgresoDialog
        open={openNewDialog}
        onClose={() => {
          setOpenNewDialog(false);
          setSelectedEgreso(null);
        }}
        onSave={handleAddEgreso}
        egreso={selectedEgreso}
      />

      {/* Bulk Upload Dialog */}
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

export default Egresos;