import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Dialog,
} from '@mui/material';
// Asegúrate de que las rutas de importación sean correctas
import SummaryCards from './components/SummaryCards';
import LeadTable from './components/LeadTable';
import LeadDetails from './components/LeadDetails';
import LeadFilters from './components/LeadFilters';

const CRM = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    dateRange: 'all'
  });

  // Mock data
  const leads = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan@email.com',
      telefono: '+58 412-1234567',
      status: 'STUDENT',
      source: 'Facebook Ads',
      lastContact: '2024-01-01T10:00:00',
      enrollmentDate: '2024-01-15',
      totalPaid: 2500,
      program: 'Curso Avanzado',
      contacts: []
    },
    // Puedes agregar más leads aquí
  ];

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
  };

  const handleCloseDetails = () => {
    setSelectedLead(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 3 }}>
        CRM
      </Typography>

      <SummaryCards leads={leads} />

      <Paper 
        sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: '#2C2C2C',
          border: '1px solid rgba(0, 255, 209, 0.1)'
        }}
      >
        <LeadFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        <LeadTable 
          leads={leads} 
          onLeadClick={handleLeadClick}
          filters={filters}
        />
      </Paper>

      <Dialog
        open={Boolean(selectedLead)}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2C2C2C',
            color: '#FFFFFF',
            minHeight: '80vh'
          }
        }}
      >
        {selectedLead && (
          <LeadDetails 
            lead={selectedLead}
            onClose={handleCloseDetails}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default CRM;