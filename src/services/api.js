// Seleccionar la URL base del API según el entorno
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL_PROD
    : process.env.REACT_APP_API_BASE_URL_DEV;

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
    const response = await fetch(`${API_BASE_URL}/financial/ingresos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingresoData),
    });
    if (!response.ok) throw new Error('Error creating ingreso');
    return response.json();
  },

  async getIngresoStats(filters) {
    const queryParams = new URLSearchParams({
      start_date: filters.startDate?.toISO(),
      end_date: filters.endDate?.toISO(),
      plataforma: filters.plataforma,
    });

    const response = await fetch(`${API_BASE_URL}/financial/ingresos/stats?${queryParams}`);
    if (!response.ok) throw new Error('Error fetching stats');
    return response.json();
  },
  async updateIngreso(id, ingresoData) {
    const response = await fetch(`${API_BASE_URL}/financial/ingresos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingresoData),
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
