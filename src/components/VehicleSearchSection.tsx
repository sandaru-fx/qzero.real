import { Suspense } from 'react';
import { getFilterOptions } from '@/actions/search';
import VehicleSearch from './VehicleSearch';
import type { FilterOptions } from '@/types/filters';

type VehicleSearchSectionProps = {
  showTextSearch?: boolean;
};

async function VehicleSearchLoader({ showTextSearch }: VehicleSearchSectionProps) {
  const filterOptions: FilterOptions = await getFilterOptions();
  return <VehicleSearch filterOptions={filterOptions} showTextSearch={showTextSearch} />;
}

export default function VehicleSearchSection({ showTextSearch = false }: VehicleSearchSectionProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto h-24 w-full max-w-7xl animate-pulse rounded-xl border border-white/5 bg-brand-card/80" />
      }
    >
      <VehicleSearchLoader showTextSearch={showTextSearch} />
    </Suspense>
  );
}
