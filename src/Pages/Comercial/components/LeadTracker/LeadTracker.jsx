import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// IMPORTACIONES ORIGINALES
import NewLeadDialog from './components/NewLeadDialog';
import LogDialog from './components/LogDialog';
import LeadTable from './components/LeadTable';
import PipelineOverview from './components/PipelineOverview';
import RemindersCard from './components/RemindersCard';

// IMPORTAMOS TAMBIÉN EL SERVICIO DE DEAL Y EL DIALOG PARA CERRAR LEAD
import { leadService, logService, dealService } from '../../../../services/api';
import CloseLeadDialog from './components/CloseLeadDialog';

const LeadTracker = () => {
  // ESTADOS ORIGINALES
  const [leads, setLeads] = useState([]);
  const [openNewLeadDialog, setOpenNewLeadDialog] = useState(false);
  const [openLogDialog, setOpenLogDialog] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // NUEVOS ESTADOS PARA MANEJAR EL CIERRE DEL LEAD
  const [openCloseLeadDialog, setOpenCloseLeadDialog] = useState(false);
  const [leadToClose, setLeadToClose] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (error) {
      showNotification('Error al cargar los leads', 'error');
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

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const handleAddNewLead = async (newLead) => {
    try {
      const savedLead = await leadService.createLead(newLead);
      setLeads([...leads, savedLead]);
      setOpenNewLeadDialog(false);
      showNotification('Lead creado exitosamente');
    } catch (error) {
      showNotification('Error al crear el lead', 'error');
    }
  };

  const handleAddLog = async (leadId, newLog) => {
    try {
      await logService.createLog(leadId, newLog);
      await fetchLeads(); // Recargar leads para obtener datos actualizados
      setOpenLogDialog(false);
      showNotification('Actividad registrada exitosamente');
    } catch (error) {
      showNotification('Error al registrar la actividad', 'error');
    }
  };

  const handleOpenLogDialog = (lead) => {
    setCurrentLead(lead);
    setOpenLogDialog(true);
  };

  // MODIFICAMOS LA FUNCIÓN PARA DETECTAR STAGE "CLOSED" Y ABRIR EL DIALOG
  const handleUpdateLeadStage = async (leadId, newStage) => {
    try {
      if (newStage === 'CLOSED') {
        // En vez de actualizar directamente, abrimos el diálogo de cierre
        const foundLead = leads.find((l) => l.id === leadId);
        setLeadToClose(foundLead);
        setOpenCloseLeadDialog(true);
      } else {
        // Para otros stages, se comporta como antes
        await leadService.updateLeadStage(leadId, newStage);
        await fetchLeads(); // Recargar leads para obtener datos actualizados
        showNotification('Estado actualizado exitosamente');
      }
    } catch (error) {
      showNotification('Error al actualizar el estado', 'error');
    }
  };

  // FUNCIÓN QUE SE ENCARGA DE CERRAR EL LEAD (CREAR DEAL + STAGE = CLOSED)
  const handleCloseLead = async (leadId, dealData) => {
    try {
      await dealService.closeLead(leadId, dealData);
      showNotification('Lead cerrado exitosamente');
      await fetchLeads(); // Recargar leads
    } catch (error) {
      showNotification('Error al cerrar el lead', 'error');
    } finally {
      setOpenCloseLeadDialog(false);
      setLeadToClose(null);
    }
  };

  const handleCompleteReminder = async (leadId, reminderId) => {
    try {
      await logService.completeReminder(reminderId);
      await fetchLeads(); // Recargar leads para obtener datos actualizados
      showNotification('Recordatorio completado exitosamente');
    } catch (error) {
      showNotification('Error al completar el recordatorio', 'error');
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h5" sx={{ color: '#FFFFFF' }}>
          Lead Tracker
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewLeadDialog(true)}
          sx={{
            backgroundColor: '#00FFD1',
            color: '#1E1E1E',
            '&:hover': {
              backgroundColor: '#00CCB7',
            },
          }}
        >
          Nuevo Lead
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px' 
        }}>
          <CircularProgress sx={{ color: '#00FFD1' }} />
        </Box>
      ) : (
        <>
          {/* Reminders Section */}
          <RemindersCard 
            leads={leads}
            onComplete={handleCompleteReminder}
          />

          {/* Pipeline Overview */}
          <PipelineOverview leads={leads} />

          {/* Leads Table */}
          <LeadTable 
            leads={leads}
            onOpenLog={handleOpenLogDialog}
            onUpdateStage={handleUpdateLeadStage}
          />
        </>
      )}

      {/* Dialogs */}
      <NewLeadDialog
        open={openNewLeadDialog}
        onClose={() => setOpenNewLeadDialog(false)}
        onSave={handleAddNewLead}
      />

      <LogDialog
        open={openLogDialog}
        lead={currentLead}
        onClose={() => setOpenLogDialog(false)}
        onSave={handleAddLog}
      />

      {/* DIÁLOGO PARA CERRAR LEAD */}
      <CloseLeadDialog
        open={openCloseLeadDialog}
        lead={leadToClose}
        onSave={(dealData) => handleCloseLead(leadToClose?.id, dealData)}
        onClose={() => {
          setOpenCloseLeadDialog(false);
          setLeadToClose(null);
        }}
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
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadTracker;
