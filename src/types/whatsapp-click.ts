export type WhatsAppClickSource =
  | 'floating'
  | 'vehicle_inquire'
  | 'contact_owner'
  | 'contact_manager';

export type WhatsAppClickStats = {
  todayTotal: number;
  todayFloating: number;
  todayVehicleInquire: number;
  todayContact: number;
  weekTotal: number;
  weekFloating: number;
  weekVehicleInquire: number;
  weekContact: number;
  allTimeTotal: number;
};
