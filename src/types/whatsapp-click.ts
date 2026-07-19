export type WhatsAppClickSource = 'floating' | 'vehicle_inquire';

export type WhatsAppClickStats = {
  todayTotal: number;
  todayFloating: number;
  todayVehicleInquire: number;
  weekTotal: number;
  weekFloating: number;
  weekVehicleInquire: number;
  allTimeTotal: number;
};
