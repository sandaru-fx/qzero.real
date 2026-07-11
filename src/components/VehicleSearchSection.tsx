import { Suspense } from 'react';
import { getFilterOptions } from '@/actions/search';
import VehicleSearch from './VehicleSearch';
import type { FilterOptions } from '@/types/filters';

type VehicleSearchSectionProps = {
  showTextSearch?: boolean;
  showHeroCopy?: boolean;
  fullWidth?: boolean;
};

function SearchFallback({ fullWidth = false }: { fullWidth?: boolean }) {
  return (
    <div
      className={`mx-auto h-72 w-full animate-pulse rounded-2xl border border-white/5 bg-brand-card/80 ${
          fullWidth ? 'max-w-none' : 'max-w-[1600px]'
      }`}
    />
  );
}

async function VehicleSearchLoader({
  showTextSearch,
  showHeroCopy,
  fullWidth,
}: VehicleSearchSectionProps) {
  let filterOptions: FilterOptions;
  try {
    filterOptions = await getFilterOptions();
  } catch {
    filterOptions = {
      makes: [],
      models: [],
      modelsByMake: {},
      years: [],
      conditions: ['Brand New', 'Reconditioned', 'Used'],
      priceRanges: [
        'Under Rs 5M',
        'Rs 5M - 10M',
        'Rs 10M - 20M',
        'Rs 20M - 30M',
        'Over Rs 30M',
      ],
    };
  }

  // useSearchParams() requires its own Suspense boundary
  return (
    <Suspense fallback={<SearchFallback fullWidth={fullWidth} />}>
      <VehicleSearch
        filterOptions={filterOptions}
        showTextSearch={showTextSearch}
        showHeroCopy={showHeroCopy}
        fullWidth={fullWidth}
      />
    </Suspense>
  );
}

export default function VehicleSearchSection({
  showTextSearch = false,
  showHeroCopy = false,
  fullWidth = false,
}: VehicleSearchSectionProps) {
  return (
    <Suspense fallback={<SearchFallback fullWidth={fullWidth} />}>
      <VehicleSearchLoader
        showTextSearch={showTextSearch}
        showHeroCopy={showHeroCopy}
        fullWidth={fullWidth}
      />
    </Suspense>
  );
}
