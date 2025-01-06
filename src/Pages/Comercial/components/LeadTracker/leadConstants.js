export const pipelineStages = {
    LEAD: { 
      label: 'Lead Ingresado', 
      color: '#FFA726',
      description: 'Lead captado vía tráfico o pauta en redes'
    },
    CHAT: { 
      label: 'Contacto Inicial', 
      color: '#29B6F6',
      description: 'Primer acercamiento vía chat realizado'
    },
    CALL: { 
      label: 'Llamada Realizada', 
      color: '#66BB6A',
      description: 'Contacto telefónico establecido'
    },
    PROPOSAL: { 
      label: 'Propuesta Enviada', 
      color: '#AB47BC',
      description: 'Propuesta de valor presentada'
    },
    NEGOTIATION: { 
      label: 'En Negociación', 
      color: '#00FFD1',
      description: 'Discutiendo términos y resolviendo objeciones'
    },
    CLOSED: { 
      label: 'Cerrado', 
      color: '#4CAF50',
      description: 'Venta completada'
    },
    LOST: { 
      label: 'Perdido', 
      color: '#F44336',
      description: 'Oportunidad perdida'
    }
  };
  
  export const leadSources = [
    'Facebook Ads',
    'Instagram Ads',
    'Referido',
    'Orgánico',
    'TikTok',
    'Otro'
  ];
  
  export const interestOptions = [
    'Club Privado',
    'Plan Anual',
    'Instituto Royal' // Nuevo producto
  ];
  
  export const logTypes = {
    CHAT: { label: 'Chat', icon: 'ChatIcon' },
    CALL: { label: 'Llamada', icon: 'CallIcon' },
    EMAIL: { label: 'Email', icon: 'EmailIcon' },
    MEETING: { label: 'Reunión', icon: 'VideocamIcon' },
    OTHER: { label: 'Otro', icon: 'MoreHorizIcon' }
  };

  export const countries = [
    'Argentina',
    'Bolivia',
    'Chile',
    'Colombia',
    'Costa Rica',
    'Ecuador',
    'El Salvador',
    'España',
    'Guatemala',
    'Honduras',
    'México',
    'Nicaragua',
    'Panamá',
    'Paraguay',
    'Perú',
    'República Dominicana',
    'Uruguay',
    'Venezuela',
    'Otro'
  ];
  
  export const productPrices = {
    'Club Privado': 75,
    'Plan Anual': 270,
    'Instituto Royal': 2990 // Precio del nuevo producto
  };