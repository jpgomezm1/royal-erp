import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Dialog,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';

import SummaryCards from './components/SummaryCards';
import LeadTable from './components/LeadTable';
import LeadDetails from './components/LeadDetails';
import LeadFilters from './components/LeadFilters';

// Importamos los servicios (Lead y LegacyClient) que ya tienes en tu api.js
import { leadService, legacyClientService } from '../../../../services/api';

// Importamos los componentes para los Legacy Clients
import LegacyClientTable from './components/LegacyClientTable';
import LegacyClientDetails from './components/LegacyClientDetails';
import LegacySummaryCards from './components/LegacySummaryCards';

/**
 * Componente CRM principal que maneja:
 *  - TAB 0: Leads (vista CRM normal)
 *  - TAB 1: Clientes Especiales (Legacy Clients) con su propio resumen, tabla y detalles
 */
const CRM = () => {
  // -------------------- ESTADOS DE LEADS --------------------
  const [selectedLead, setSelectedLead] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    dateRange: 'all',
    searchTerm: '',
  });

  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // -------------------- ESTADOS DE LEGACY CLIENTS --------------------
  const [legacyList, setLegacyList] = useState([]);
  const [loadingLegacy, setLoadingLegacy] = useState(true);
  const [selectedLegacy, setSelectedLegacy] = useState(null);

  // -------------------- TAB CONTROL (0 => LEADS, 1 => LEGACY) --------------------
  const [tabValue, setTabValue] = useState(0);

  // Al montar, cargamos datos de Leads y Legacy Clients
  useEffect(() => {
    fetchLeadsFromBackend();
    fetchLegacyClientsFromBackend();
  }, []);

  // ------------ FUNCIONES PARA CARGAR LEADS ------------
  const fetchLeadsFromBackend = async () => {
    try {
      setLoadingLeads(true);
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads from backend:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  // ------------ FUNCIONES PARA CARGAR LEGACY CLIENTS ------------
  const fetchLegacyClientsFromBackend = async () => {
    try {
      setLoadingLegacy(true);
      const data = await legacyClientService.getAllLegacyClients();
      setLegacyList(data);
    } catch (error) {
      console.error('Error fetching legacy clients:', error);
    } finally {
      setLoadingLegacy(false);
    }
  };

  // ------------ HANDLERS LEADS ------------
  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
  };

  const handleCloseLeadDetails = () => {
    setSelectedLead(null);
  };

  // Filtros de leads en frontend
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtra leads en memoria
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
      // 3. Filtrar por rango de fecha
      if (filters.dateRange !== 'all') {
        const createdDate = new Date(lead.created_at);
        const now = new Date();
        if (filters.dateRange === 'today') {
          // Comparar sólo fecha
          if (createdDate.toDateString() !== now.toDateString()) return false;
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
      // 4. Búsqueda
      if (filters.searchTerm.trim()) {
        const term = filters.searchTerm.toLowerCase();
        const nameMatch = lead.nombre.toLowerCase().includes(term);
        const emailMatch = lead.email.toLowerCase().includes(term);
        const countryMatch = lead.pais.toLowerCase().includes(term);

        if (!nameMatch && !emailMatch && !countryMatch) {
          return false;
        }
      }
      return true;
    });
  };

  const filteredLeads = filterLeads(leads);

  // ------------ HANDLERS LEGACY ------------
  const handleLegacyClick = (legacyClient) => {
    setSelectedLegacy(legacyClient);
  };

  const handleCloseLegacyDetails = (updatedClient) => {
    // Si guardas un pago, updatedClient vendrá con info actualizada
    // Actualizamos la lista local
    if (updatedClient) {
      setLegacyList((prev) =>
        prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
      );
    }
    setSelectedLegacy(null);
  };

  // ------------ CONTROL DE TABS ------------
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>

      {/* Barra de Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="secondary"
        sx={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 2,
          '& .MuiTab-root': {
            color: '#FFFFFF',
            textTransform: 'none',
          },
          '& .Mui-selected': {
            color: '#00FFD1',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#00FFD1',
          },
        }}
      >
        <Tab label="CRM" />
        <Tab label="Leads Anteriores" />
      </Tabs>

      {/* TAB 0: LEADS */}
      {tabValue === 0 && (
        <>
          {loadingLeads ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress sx={{ color: '#00FFD1' }} />
            </Box>
          ) : (
            <>
              {/* Tarjetas de Resumen para Leads */}
              <SummaryCards leads={filteredLeads} />

              <Paper
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: '#2C2C2C',
                  border: '1px solid rgba(0, 255, 209, 0.1)',
                }}
              >
                <LeadFilters filters={filters} onFilterChange={handleFilterChange} />

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <LeadTable
                  leads={filteredLeads}
                  onLeadClick={handleLeadClick}
                  filters={filters}
                />
              </Paper>

              {/* Dialog para Detalles de un Lead */}
              <Dialog
                open={Boolean(selectedLead)}
                onClose={handleCloseLeadDetails}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: {
                    backgroundColor: '#2C2C2C',
                    color: '#FFFFFF',
                    minHeight: '80vh',
                  },
                }}
              >
                {selectedLead && (
                  <LeadDetails lead={selectedLead} onClose={handleCloseLeadDetails} />
                )}
              </Dialog>
            </>
          )}
        </>
      )}

      {/* TAB 1: LEGACY CLIENTS */}
      {tabValue === 1 && (
        <>
          {loadingLegacy ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress sx={{ color: '#00FFD1' }} />
            </Box>
          ) : (
            <>
              {/* Tarjetas de Resumen para Legacy Clients */}
              <LegacySummaryCards clients={legacyList} />

              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  backgroundColor: '#2C2C2C',
                  border: '1px solid rgba(0,255,209,0.1)',
                }}
              >
                <LegacyClientTable onSelectClient={handleLegacyClick} />
              </Paper>
            </>
          )}

          {/* Dialog para Detalles de un LegacyClient */}
          <Dialog
            open={Boolean(selectedLegacy)}
            onClose={() => handleCloseLegacyDetails(null)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                backgroundColor: '#2C2C2C',
                color: '#FFFFFF',
                minHeight: '60vh',
              },
            }}
          >
            {selectedLegacy && (
              <LegacyClientDetails
                client={selectedLegacy}
                onClose={handleCloseLegacyDetails}
              />
            )}
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default CRM;
