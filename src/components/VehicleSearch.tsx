"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FilterOptions } from '@/types/filters';

type Category = {
  id: string;
  label: string;
  bodyTypes: string[];
};

const categories: Category[] = [
  { id: 'car', label: 'Cars', bodyTypes: ['Car', 'Sedan', 'Hatchback', 'Coupe', 'Convertible'] },
  { id: 'suv', label: 'SUV', bodyTypes: ['SUV'] },
  { id: 'pickup', label: 'Double Cab', bodyTypes: ['Pickup'] },
  { id: 'van', label: 'Van', bodyTypes: ['Van'] },
  { id: 'wagon', label: 'Wagon', bodyTypes: ['Wagon'] },
  { id: 'truck', label: 'Truck', bodyTypes: ['Truck'] },
];

function CategoryIcon({ id, active }: { id: string; active: boolean }) {
  const stroke = active ? 'currentColor' : 'currentColor';
  const common = {
    viewBox: '0 0 64 32',
    className: `h-8 w-14 transition-colors ${active ? 'text-brand-gold' : 'text-white/55'}`,
    fill: 'none' as const,
    stroke,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (id) {
    case 'suv':
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22l4-10h28l6 10M18 12v-2h10M38 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-20 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'pickup':
      return (
        <svg {...common}>
          <path d="M6 22h52M10 22l3-9h18v9M31 13h18l5 9M16 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm28 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'van':
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22V10h28l12 8v4M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm26 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'wagon':
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22l3-10h34l5 10M18 12h20M16 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm28 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common}>
          <path d="M6 22h52M8 22V11h26v11M34 14h14l6 8v0M16 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M8 22h48M12 22l5-10h26l7 10M20 12h16M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm24 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        </svg>
      );
  }
}

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

const FilterField = ({
  label,
  value,
  options,
  placeholder,
  isOpen,
  onToggle,
  onSelect,
}: DropdownProps) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        disabled={options.length === 0}
        className={`flex min-h-[80px] w-full items-center justify-between rounded-md border px-5 py-4 text-left transition-all ${
          isOpen
            ? 'border-brand-gold/50 bg-[#1a1a1a] ring-1 ring-brand-gold/25'
            : 'border-white/10 bg-[#1c1c1c] hover:border-brand-gold/35'
        } ${options.length === 0 ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <span className="min-w-0">
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
            {label}
          </span>
          <span
            className={`mt-2 block truncate text-base font-bold tracking-wide ${
              value ? 'text-white' : 'text-white/85'
            }`}
          >
            {value || placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-white/70 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-gold' : ''
          }`}
        />
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-md border border-white/10 bg-[#161616] py-1 shadow-2xl shadow-black/60">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                onToggle();
              }}
              className="flex w-full items-center px-5 py-3.5 text-sm font-medium text-white/75 transition-colors hover:bg-black hover:text-white"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

type VehicleSearchProps = {
  filterOptions: FilterOptions;
  showTextSearch?: boolean;
  showHeroCopy?: boolean;
  fullWidth?: boolean;
};

function emptyFilters() {
  return {
    year: '',
    make: '',
    model: '',
    condition: '',
    priceRange: '',
    query: '',
    bodyType: '',
  };
}

function VehicleSearchContent({
  filterOptions,
  showTextSearch = false,
  showHeroCopy = false,
  fullWidth = false,
}: VehicleSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState(emptyFilters);

  const activeCategory =
    categories.find((cat) =>
      cat.bodyTypes.some((t) => t.toLowerCase() === filters.bodyType.toLowerCase())
    )?.id ?? '';

  useEffect(() => {
    setFilters({
      year: searchParams.get('year') || '',
      make: searchParams.get('make') || '',
      model: searchParams.get('model') || '',
      condition: searchParams.get('condition') || '',
      priceRange: searchParams.get('price') || '',
      query: searchParams.get('q') || '',
      bodyType: searchParams.get('bodyType') || '',
    });
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (override?: Partial<typeof filters>) => {
    const next = { ...filters, ...override };
    const params = new URLSearchParams();

    if (next.make) params.append('make', next.make);
    if (next.model && next.model !== 'Any Model') params.append('model', next.model);
    if (next.year) params.append('year', next.year);
    if (next.condition) params.append('condition', next.condition);
    if (next.priceRange) params.append('price', next.priceRange);
    if (next.query.trim()) params.append('q', next.query.trim());
    if (next.bodyType) params.append('bodyType', next.bodyType);

    const queryString = params.toString();
    router.push(queryString ? `/vehicles?${queryString}` : '/vehicles');
  };

  const selectCategory = (category: Category) => {
    const nextBody =
      activeCategory === category.id ? '' : category.bodyTypes[0];
    setFilters((prev) => ({ ...prev, bodyType: nextBody }));
  };

  return (
    <div ref={containerRef} className={`mx-auto w-full ${fullWidth ? 'max-w-none' : 'max-w-[1600px]'}`}>
      {showHeroCopy && (
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            Discover, Select,{' '}
            <span className="font-bold text-brand-gold">Own Your Car.</span>
          </h2>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-end justify-center gap-x-6 gap-y-5 sm:gap-x-10">
        {categories.map((category) => {
          const active = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category)}
              className="group flex flex-col items-center gap-2"
            >
              <CategoryIcon id={category.id} active={active} />
              <span
                className={`border-b-2 pb-1 text-xs font-bold uppercase tracking-[0.14em] transition-colors sm:text-sm ${
                  active
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-white/70 group-hover:text-white'
                }`}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-6">
        {showTextSearch && (
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search brand, model, or feature"
              className="h-12 w-full rounded-md border border-white/10 bg-[#1c1c1c] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-brand-muted focus:border-brand-gold"
            />
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          <FilterField
            label="Year"
            placeholder="Select Year"
            value={filters.year}
            options={filterOptions.years}
            isOpen={activeDropdown === 'year'}
            onToggle={() => setActiveDropdown(activeDropdown === 'year' ? null : 'year')}
            onSelect={(val) => setFilters({ ...filters, year: val })}
          />

          <FilterField
            label="Make"
            placeholder="Select Make"
            value={filters.make}
            options={filterOptions.makes}
            isOpen={activeDropdown === 'make'}
            onToggle={() => setActiveDropdown(activeDropdown === 'make' ? null : 'make')}
            onSelect={(val) => setFilters({ ...filters, make: val })}
          />

          <FilterField
            label="Model"
            placeholder="Select Model"
            value={filters.model}
            options={['Any Model', ...filterOptions.models]}
            isOpen={activeDropdown === 'model'}
            onToggle={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
            onSelect={(val) => setFilters({ ...filters, model: val === 'Any Model' ? '' : val })}
          />

          <FilterField
            label="Condition"
            placeholder="Select Condition"
            value={filters.condition}
            options={filterOptions.conditions}
            isOpen={activeDropdown === 'condition'}
            onToggle={() => setActiveDropdown(activeDropdown === 'condition' ? null : 'condition')}
            onSelect={(val) => setFilters({ ...filters, condition: val })}
          />

          <FilterField
            label="Price"
            placeholder="Select Price"
            value={filters.priceRange}
            options={filterOptions.priceRanges}
            isOpen={activeDropdown === 'priceRange'}
            onToggle={() => setActiveDropdown(activeDropdown === 'priceRange' ? null : 'priceRange')}
            onSelect={(val) => setFilters({ ...filters, priceRange: val })}
          />

          <button
            type="button"
            onClick={() => handleSearch()}
            className="group flex min-h-[80px] w-full items-center justify-center gap-2.5 rounded-md px-5 py-4 text-base font-bold uppercase tracking-[0.12em] text-black gold-gradient shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-brand-gold/35 sm:text-lg"
          >
            <Search className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span>Search Vehicle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VehicleSearch(props: VehicleSearchProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`mx-auto h-72 w-full animate-pulse rounded-2xl border border-white/5 bg-brand-card/80 ${
            props.fullWidth ? 'max-w-none' : 'max-w-[1600px]'
          }`}
        />
      }
    >
      <VehicleSearchContent {...props} />
    </Suspense>
  );
}
