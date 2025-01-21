// api.js

import { DateTime } from 'luxon';

// Seleccionar la URL base del API según el entorno
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL_PROD
    : process.env.REACT_APP_API_BASE_URL_DEV;


function convertLocalBogotaToUTC(dateString) {
  if (!dateString) return dateString;
  // Interpreta la cadena en zona de Bogotá, luego conviértela a UTC y devuélvela en ISO
  return DateTime.fromISO(dateString, { zone: 'America/Bogota' })
                  .toUTC()
                  .toISO(); // Ej: "2025-02-01T05:00:00.000Z"
}

export const leadService = {
  // Get all leads
  getAllLeads: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  // Create new lead
  createLead: async (leadData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  // Update lead stage
  updateLeadStage: async (leadId, stage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error updating lead stage:', error);
      throw error;
    }
  },
};

export const logService = {
  // Create new log
  createLog: async (leadId, logData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating log:', error);
      throw error;
    }
  },

  // Complete reminder
  completeReminder: async (reminderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/logs/reminder/${reminderId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error completing reminder:', error);
      throw error;
    }
  },
};

export const dealService = {
  createDeal: async (leadId, dealData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deals/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  },
  closeLead: async (leadId, dealData) => {
    try {
      // Primero creamos el deal
      const dealResponse = await fetch(`${API_BASE_URL}/deals/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (!dealResponse.ok) throw new Error('Error creating deal');

      // Si el deal se creó exitosamente, actualizamos el estado del lead
      const stageResponse = await fetch(`${API_BASE_URL}/leads/${leadId}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: 'CLOSED' }),
      });

      if (!stageResponse.ok) throw new Error('Error updating lead stage');

      return await dealResponse.json();
    } catch (error) {
      console.error('Error closing lead:', error);
      throw error;
    }
  },
};

export const ingresoService = {
  async getAllIngresos() {
    const response = await fetch(`${API_BASE_URL}/financial/ingresos/`);
    if (!response.ok) throw new Error('Error fetching ingresos');
    return response.json();
  },

  async createIngreso(ingresoData) {
    // Clonamos para no mutar el original
    const dataToSend = { ...ingresoData };

    // Convertir fecha local a UTC
    if (dataToSend.fecha) {
      dataToSend.fecha = convertLocalBogotaToUTC(dataToSend.fecha);
    }

    const response = await fetch(`${API_BASE_URL}/financial/ingresos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) throw new Error('Error creating ingreso');
    return response.json();
  },

  async getIngresoStats(filters) {
    // Si quieres que los filtros se interpreten en Bogotá y se manden en UTC:
    // (Opcional, depende de cómo hayas configurado el backend)
    const startDate = filters.startDate 
      ? convertLocalBogotaToUTC(filters.startDate.toISO())
      : undefined;
    const endDate = filters.endDate
      ? convertLocalBogotaToUTC(filters.endDate.toISO())
      : undefined;

    const queryParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      plataforma: filters.plataforma,
    });

    const response = await fetch(`${API_BASE_URL}/financial/ingresos/stats?${queryParams}`);
    if (!response.ok) throw new Error('Error fetching stats');
    return response.json();
  },

  async updateIngreso(id, ingresoData) {
    const dataToSend = { ...ingresoData };
    
    if (dataToSend.fecha) {
      dataToSend.fecha = convertLocalBogotaToUTC(dataToSend.fecha);
    }

    const response = await fetch(`${API_BASE_URL}/financial/ingresos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) throw new Error('Error updating ingreso');
    return response.json();
  },

  async deleteIngreso(id) {
    const response = await fetch(`${API_BASE_URL}/financial/ingresos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting ingreso');
    return true;
  },

  async bulkUpload(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/financial/ingresos/bulk-upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Error al cargar el archivo');
    return response.json();
  },
};


export const egresoService = {
  async getAllEgresos() {
    const response = await fetch(`${API_BASE_URL}/financial/egresos/`);
    if (!response.ok) throw new Error('Error fetching egresos');
    return response.json();
  },

  async createEgreso(egresoData) {
    const dataToSend = { ...egresoData };

    // Convertir fecha local a UTC
    if (dataToSend.fecha) {
      dataToSend.fecha = convertLocalBogotaToUTC(dataToSend.fecha);
    }

    const response = await fetch(`${API_BASE_URL}/financial/egresos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) throw new Error('Error creating egreso');
    return response.json();
  },

  async getEgresoStats(filters) {
    // Si también deseas convertir startDate/endDate a UTC
    const startDate = filters.startDate
      ? convertLocalBogotaToUTC(filters.startDate.toISO())
      : undefined;
    const endDate = filters.endDate
      ? convertLocalBogotaToUTC(filters.endDate.toISO())
      : undefined;

    const queryParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      tipo_gasto: filters.tipoGasto,
    });

    const response = await fetch(`${API_BASE_URL}/financial/egresos/stats?${queryParams}`);
    if (!response.ok) throw new Error('Error fetching stats');
    return response.json();
  },

  async updateEgreso(id, egresoData) {
    const dataToSend = { ...egresoData };

    if (dataToSend.fecha) {
      dataToSend.fecha = convertLocalBogotaToUTC(dataToSend.fecha);
    }

    const response = await fetch(`${API_BASE_URL}/financial/egresos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    if (!response.ok) throw new Error('Error updating egreso');
    return response.json();
  },

  async deleteEgreso(id) {
    const response = await fetch(`${API_BASE_URL}/financial/egresos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting egreso');
    return true;
  },

  async bulkUpload(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/financial/egresos/bulk-upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Error al cargar el archivo');
    return response.json();
  },
};


export const egresoRecurrenteService = {
  async getAllEgresosRecurrentes() {
    const response = await fetch(`${API_BASE_URL}/financial/egresos-recurrentes/`);
    if (!response.ok) throw new Error('Error fetching egresos recurrentes');
    return response.json();
  },

  async createEgresoRecurrente(egresoData) {
    const response = await fetch(`${API_BASE_URL}/financial/egresos-recurrentes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(egresoData),
    });
    if (!response.ok) throw new Error('Error creating egreso recurrente');
    return response.json();
  },

  async updateEgresoRecurrente(id, egresoData) {
    const response = await fetch(`${API_BASE_URL}/financial/egresos-recurrentes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(egresoData),
    });
    if (!response.ok) throw new Error('Error updating egreso recurrente');
    return response.json();
  },

  async deleteEgresoRecurrente(id) {
    const response = await fetch(`${API_BASE_URL}/financial/egresos-recurrentes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting egreso recurrente');
    return true;
  },

  async procesarEgresosRecurrentes() {
    const response = await fetch(`${API_BASE_URL}/financial/egresos-recurrentes/procesar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Error al procesar egresos recurrentes');
    return response.json();
  },
};


export const resultadosService = {
  async getResultadosStats(filters) {
    const queryParams = new URLSearchParams({
      start_date: filters.startDate?.toISO(),
      end_date: filters.endDate?.toISO(),
      period: filters.period || 'month'
    });

    const response = await fetch(`${API_BASE_URL}/financial/resultados/stats?${queryParams}`);
    if (!response.ok) throw new Error('Error fetching resultados stats');
    return response.json();
  }
};


export const legacyClientService = {
  getAllLegacyClients: async () => {
    const res = await fetch(`${API_BASE_URL}/legacy/`);
    if (!res.ok) throw new Error('Error fetching legacy clients');
    return res.json();
  },

  createLegacyClient: async (data) => {
    const res = await fetch(`${API_BASE_URL}/legacy/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creating legacy client');
    return res.json();
  },

  addPayment: async (clientId, data) => {
    const res = await fetch(`${API_BASE_URL}/legacy/${clientId}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error adding payment');
    return res.json();
  },
  
  // etc. (bulkImport if you want to call from UI)
};