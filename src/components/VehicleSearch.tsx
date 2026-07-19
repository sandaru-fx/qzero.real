"use client";

import { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import Image from 'next/image';
import { ChevronDown, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FilterOptions } from '@/types/filters';

type Category = {
  id: string;
  label: string;
  bodyTypes: string[];
  image: string;
  imageAlt: string;
};

const categories: Category[] = [
  {
    id: 'car',
    label: 'Cars',
    bodyTypes: ['Car', 'Sedan', 'Hatchback', 'Coupe', 'Convertible'],
    image: '/categories/car.jpeg',
    imageAlt: 'Luxury sedan',
  },
  {
    id: 'suv',
    label: 'SUV',
    bodyTypes: ['SUV'],
    image: '/categories/suv-side.jpeg',
    imageAlt: 'Black SUV',
  },
  {
    id: 'pickup',
    label: 'Double Cab',
    bodyTypes: ['Pickup'],
    image: '/categories/pickup-side.jpeg',
    imageAlt: 'Double cab pickup',
  },
  {
    id: 'van',
    label: 'Van',
    bodyTypes: ['Van'],
    image: '/categories/van-side.jpeg',
    imageAlt: 'Passenger van',
  },
  {
    id: 'wagon',
    label: 'Wagon',
    bodyTypes: ['Wagon'],
    image: '/categories/wagon.jpeg',
    imageAlt: 'Luxury wagon MPV',
  },
  {
    id: 'truck',
    label: 'Truck',
    bodyTypes: ['Truck'],
    image: '/categories/truck-side.jpeg',
    imageAlt: 'Box truck',
  },
];

function CategoryThumb({
  image,
  imageAlt,
  active,
}: {
  image: string;
  imageAlt: string;
  active: boolean;
}) {
  return (
    <span className="flex w-[7.25rem] flex-col items-center sm:w-[8rem]">
      <span className="relative flex h-[4.25rem] w-full items-center justify-center overflow-hidden rounded-md bg-[#e8e8e8] px-1 sm:h-[4.75rem]">
        <Image
          src={image}
          alt={imageAlt}
          width={160}
          height={88}
          unoptimized
          className={`h-full w-full object-contain object-center transition-transform duration-500 ${
            active ? 'scale-105' : 'group-hover:scale-105'
          }`}
        />
      </span>
      {/* Indra-style active indicator: thick bar under the image */}
      <span
        className={`mt-2 h-[3px] w-full rounded-full transition-colors duration-300 ${
          active ? 'bg-brand-gold' : 'bg-transparent group-hover:bg-brand-gold/35'
        }`}
        aria-hidden
      />
    </span>
  );
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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`relative z-[1] flex min-h-[80px] w-full items-center justify-between rounded-md border px-5 py-4 text-left transition-all ${
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
        <div
          role="listbox"
          className="absolute left-0 right-0 z-[200] mt-1.5 max-h-60 w-full overflow-auto rounded-md border border-white/10 bg-[#161616] py-1 shadow-2xl shadow-black/70"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
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

type Filters = ReturnType<typeof emptyFilters>;

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

  const modelOptions = useMemo(() => {
    if (filters.make && filterOptions.modelsByMake[filters.make]?.length) {
      return ['Any Model', ...filterOptions.modelsByMake[filters.make]];
    }
    return ['Any Model', ...filterOptions.models];
  }, [filters.make, filterOptions.models, filterOptions.modelsByMake]);

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

  const handleSearch = (override?: Partial<Filters>) => {
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

  const clearAll = () => {
    setFilters(emptyFilters());
    router.push('/vehicles');
  };

  const removeFilter = (key: keyof Filters) => {
    const next = { ...filters, [key]: '' };
    if (key === 'make') next.model = '';
    setFilters(next);
    handleSearch(next);
  };

  const selectCategory = (category: Category) => {
    const nextBody = activeCategory === category.id ? '' : category.bodyTypes[0];
    const next = { ...filters, bodyType: nextBody };
    setFilters(next);
    handleSearch(next);
  };

  const chips: { key: keyof Filters; label: string }[] = [
    filters.bodyType && { key: 'bodyType' as const, label: filters.bodyType },
    filters.make && { key: 'make' as const, label: filters.make },
    filters.model && { key: 'model' as const, label: filters.model },
    filters.year && { key: 'year' as const, label: filters.year },
    filters.condition && { key: 'condition' as const, label: filters.condition },
    filters.priceRange && { key: 'priceRange' as const, label: filters.priceRange },
    filters.query && { key: 'query' as const, label: `“${filters.query}”` },
  ].filter(Boolean) as { key: keyof Filters; label: string }[];

  return (
    <div ref={containerRef} className={`mx-auto w-full ${fullWidth ? 'max-w-none' : 'max-w-[1600px]'}`}>
      {showHeroCopy && (
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore curated stock.{' '}
            <span className="font-bold text-brand-gold">Drive what’s yours.</span>
          </h2>
        </div>
      )}

      {/* Set true to bring back Cars / SUV / Double Cab category icons */}
      {false && (
      <div className="mb-8 flex flex-wrap items-end justify-center gap-x-8 gap-y-6 sm:gap-x-12 lg:gap-x-16">
        {categories.map((category) => {
          const active = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category)}
              className="group flex min-w-[7rem] flex-col items-center gap-1 sm:min-w-[8rem]"
            >
              <CategoryThumb
                image={category.image}
                imageAlt={category.imageAlt}
                active={active}
              />
              <span
                className={`text-xs font-bold uppercase tracking-[0.14em] transition-colors sm:text-sm ${
                  active
                    ? 'text-brand-gold'
                    : 'text-white/75 group-hover:text-brand-gold'
                }`}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
      )}

      <div className="relative z-[1] overflow-visible rounded-2xl border border-white/10 bg-black/40 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-6">
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
            onSelect={(val) => setFilters({ ...filters, make: val, model: '' })}
          />

          <FilterField
            label="Model"
            placeholder={filters.make ? 'Select Model' : 'Select make first'}
            value={filters.model}
            options={modelOptions}
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

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeFilter(chip.key)}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/35 bg-brand-gold/10 px-3 py-1.5 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/20"
              >
                {chip.label}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="ml-1 text-sm font-semibold text-white/60 underline-offset-2 hover:text-white hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
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
