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
    'Curso Básico',
    'Curso Avanzado',
    'Comunidad Trading',
    'Mentoria 1:1',
    'Señales de Trading'
  ];
  
  export const logTypes = {
    CHAT: { label: 'Chat', icon: 'ChatIcon' },
    CALL: { label: 'Llamada', icon: 'CallIcon' },
    EMAIL: { label: 'Email', icon: 'EmailIcon' },
    MEETING: { label: 'Reunión', icon: 'VideocamIcon' },
    OTHER: { label: 'Otro', icon: 'MoreHorizIcon' }
  };