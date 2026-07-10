export type FilterOptions = {
  makes: string[];
  models: string[];
  years: string[];
  conditions: Array<'Brand New' | 'Reconditioned' | 'Used'>;
  priceRanges: string[];
};
