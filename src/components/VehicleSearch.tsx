"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FilterOptions } from '@/types/filters';

type DropdownProps = {
  value: string;
  options: string[];
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

const CustomDropdown = ({ value, options, placeholder, isOpen, onToggle, onSelect }: DropdownProps) => {
  if (options.length === 0) {
    return (
      <div className="flex h-12 w-full items-center rounded-md border border-brand-line bg-brand-card px-4 text-sm text-brand-muted">
        {placeholder}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-12 w-full items-center justify-between rounded-md border bg-brand-card px-4 text-sm transition-all ${
          isOpen ? 'border-brand-gold/50 ring-1 ring-brand-gold/30' : 'border-brand-line hover:border-brand-gold/30'
        }`}
      >
        <span className={value ? 'text-white font-medium' : 'text-brand-muted tracking-wide'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-brand-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-brand-line bg-brand-card py-1 shadow-lg shadow-black/50">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onSelect(option);
                onToggle();
              }}
              className="flex w-full items-center px-4 py-2.5 text-sm text-brand-muted transition-colors hover:bg-black hover:text-white"
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
};

export default function VehicleSearch({ filterOptions, showTextSearch = false }: VehicleSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    year: searchParams.get('year') || '',
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    condition: searchParams.get('condition') || '',
    priceRange: searchParams.get('price') || '',
    query: searchParams.get('q') || '',
  });

  useEffect(() => {
    setFilters({
      year: searchParams.get('year') || '',
      make: searchParams.get('make') || '',
      model: searchParams.get('model') || '',
      condition: searchParams.get('condition') || '',
      priceRange: searchParams.get('price') || '',
      query: searchParams.get('q') || '',
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

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.make) params.append('make', filters.make);
    if (filters.model && filters.model !== 'Any Model') params.append('model', filters.model);
    if (filters.year) params.append('year', filters.year);
    if (filters.condition) params.append('condition', filters.condition);
    if (filters.priceRange) params.append('price', filters.priceRange);
    if (filters.query.trim()) params.append('q', filters.query.trim());

    const queryString = params.toString();
    router.push(queryString ? `/vehicles?${queryString}` : '/vehicles');
  };

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-7xl rounded-xl border border-white/5 bg-brand-card/80 p-4 shadow-2xl backdrop-blur-md sm:p-6"
    >
      {showTextSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search brand, model, or feature"
            className="h-12 w-full rounded-full border border-brand-line bg-black pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-brand-muted focus:border-brand-gold"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:items-end">
        <CustomDropdown
          placeholder="Select Make"
          value={filters.make}
          options={filterOptions.makes}
          isOpen={activeDropdown === 'make'}
          onToggle={() => setActiveDropdown(activeDropdown === 'make' ? null : 'make')}
          onSelect={(val) => setFilters({ ...filters, make: val })}
        />

        <CustomDropdown
          placeholder="Select Model"
          value={filters.model}
          options={['Any Model', ...filterOptions.models]}
          isOpen={activeDropdown === 'model'}
          onToggle={() => setActiveDropdown(activeDropdown === 'model' ? null : 'model')}
          onSelect={(val) => setFilters({ ...filters, model: val === 'Any Model' ? '' : val })}
        />

        <CustomDropdown
          placeholder="Select Year"
          value={filters.year}
          options={filterOptions.years}
          isOpen={activeDropdown === 'year'}
          onToggle={() => setActiveDropdown(activeDropdown === 'year' ? null : 'year')}
          onSelect={(val) => setFilters({ ...filters, year: val })}
        />

        <CustomDropdown
          placeholder="Select Condition"
          value={filters.condition}
          options={filterOptions.conditions}
          isOpen={activeDropdown === 'condition'}
          onToggle={() => setActiveDropdown(activeDropdown === 'condition' ? null : 'condition')}
          onSelect={(val) => setFilters({ ...filters, condition: val })}
        />

        <CustomDropdown
          placeholder="Select Price"
          value={filters.priceRange}
          options={filterOptions.priceRanges}
          isOpen={activeDropdown === 'priceRange'}
          onToggle={() => setActiveDropdown(activeDropdown === 'priceRange' ? null : 'priceRange')}
          onSelect={(val) => setFilters({ ...filters, priceRange: val })}
        />

        <button
          onClick={handleSearch}
          className="group flex h-12 w-full items-center justify-center gap-2 rounded-full gold-gradient text-sm font-bold text-black shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-gold/40"
        >
          <Search className="h-4 w-4 transition-transform group-hover:rotate-12" />
          <span>Search Vehicle</span>
        </button>
      </div>
    </div>
  );
}
