// mockData.js
import { DateTime } from 'luxon';

const CONCEPTOS = {
  PLAN_ANUAL: "Plan Anual",
  CLUB_PRIVADO: "Club Privado"
};

export const PLATAFORMAS = ['PayPal', 'Stripe', 'BBVA', 'Crypto'];

export const PLATAFORMA_COLORS = {
  PayPal: '#00457C',
  Stripe: '#6772E5',
  BBVA: '#004481',
  Crypto: '#F7931A'
};

// Precios fijos por concepto
const PRECIOS = {
  [CONCEPTOS.PLAN_ANUAL]: 270,
  [CONCEPTOS.CLUB_PRIVADO]: 75
};

// Función para generar datos de ingresos
const generateIngresos = () => {
  const ingresos = [];
  let id = 1;
  const now = DateTime.now();
  
  // Generar datos para los últimos 3 meses
  for (let i = 90; i >= 0; i--) {
    // Algunos días tendrán múltiples transacciones
    const numTransactions = Math.random() < 0.3 ? 2 : 1;
    
    for (let j = 0; j < numTransactions; j++) {
      // Alternar entre Plan Anual y Club Privado
      const concepto = Math.random() < 0.4 ? CONCEPTOS.PLAN_ANUAL : CONCEPTOS.CLUB_PRIVADO;
      const monto = PRECIOS[concepto];

      // Generar fecha con hora aleatoria (horario comercial)
      const hora = Math.floor(Math.random() * (20 - 9 + 1)) + 9; // Entre 9 y 20
      const minuto = Math.floor(Math.random() * 60);
      const fecha = now.minus({ days: i })
        .set({ hour: hora, minute: minuto });

      ingresos.push({
        id: id++,
        fecha: fecha.toISO(),
        concepto,
        monto,
        plataforma: PLATAFORMAS[Math.floor(Math.random() * PLATAFORMAS.length)]
      });
    }
  }

  // Ordenar por fecha descendente
  return ingresos.sort((a, b) => 
    DateTime.fromISO(b.fecha).toMillis() - DateTime.fromISO(a.fecha).toMillis()
  );
};

export const mockIngresos = generateIngresos();

// Constantes adicionales para análisis
export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const PERIODOS_ANALISIS = [
  { label: 'Últimos 7 días', days: 7 },
  { label: 'Últimos 30 días', days: 30 },
  { label: 'Últimos 90 días', days: 90 }
];


