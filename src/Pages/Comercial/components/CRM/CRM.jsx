import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Dialog,
  CircularProgress,
} from '@mui/material';

import SummaryCards from './components/SummaryCards';
import LeadTable from './components/LeadTable';
import LeadDetails from './components/LeadDetails';
import LeadFilters from './components/LeadFilters';

// Importamos el servicio leadService que ya tienes en tu api.js
import { leadService } from '../../../../services/api';

const CRM = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    dateRange: 'all',
    searchTerm: '',
  });

  // Estado para almacenar los leads reales del backend
  const [leads, setLeads] = useState([]);
  // Estado de carga
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeadsFromBackend();
  }, []);

  const fetchLeadsFromBackend = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
  };

  const handleCloseDetails = () => {
    setSelectedLead(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Función para filtrar leads en frontend
  const filterLeads = (allLeads) => {
    return allLeads.filter((lead) => {
      // 1. Filtrar por CRM Status
      if (filters.status !== 'all' && lead.crm_status !== filters.status) {
        return false;
      }
      // 2. Filtrar por fuente
      if (filters.source !== 'all' && lead.fuente !== filters.source) {
        return false;
      }
      // 3. Filtrar por rango de fecha (ejemplo sencillo, sólo "hoy", "semana", "mes", etc.)
      //    Podrías basarte en lead.created_at o lead.logs[...].date, etc.
      if (filters.dateRange !== 'all') {
        const createdDate = new Date(lead.created_at);
        const now = new Date();
        if (filters.dateRange === 'today') {
          // Comparamos sólo la fecha
          const sameDay = createdDate.toDateString() === now.toDateString();
          if (!sameDay) return false;
        } else if (filters.dateRange === 'week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (createdDate < oneWeekAgo) return false;
        } else if (filters.dateRange === 'month') {
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (createdDate < oneMonthAgo) return false;
        } else if (filters.dateRange === 'quarter') {
          const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          if (createdDate < threeMonthsAgo) return false;
        }
      }
      // 4. Búsqueda por nombre, email o país
      if (filters.searchTerm.trim()) {
        const term = filters.searchTerm.toLowerCase();
        const nameMatch = lead.nombre.toLowerCase().includes(term);
        const emailMatch = lead.email.toLowerCase().includes(term);
        const countryMatch = lead.pais.toLowerCase().includes(term);
        // Podrías agregar más campos
        if (!nameMatch && !emailMatch && !countryMatch) {
          return false;
        }
      }

      return true;
    });
  };

  // Obtenemos leads filtrados (en memory)
  const filteredLeads = filterLeads(leads);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 3 }}>
        CRM
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress sx={{ color: '#00FFD1' }} />
        </Box>
      ) : (
        <>
          <SummaryCards leads={filteredLeads} />

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
              leads={filteredLeads}
              onLeadClick={handleLeadClick}
              filters={filters} // puedes pasar los filtros si lo deseas, aunque ya filtraste aquí
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
        </>
      )}
    </Box>
  );
};

export default CRM;
