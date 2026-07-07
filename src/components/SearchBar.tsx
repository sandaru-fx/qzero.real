import { Search } from 'lucide-react';

type SearchBarProps = {
  query?: string;
  fuelType?: string;
  transmission?: string;
};

export default function SearchBar({ query = '', fuelType = '', transmission = '' }: SearchBarProps) {
  return (
    <form action="/vehicles" className="grid gap-3 rounded-lg border border-brand-line bg-brand-card p-3 md:grid-cols-[1fr_180px_180px_auto]">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gold" />
        <input
          name="q"
          defaultValue={query}
          placeholder="Search brand, model, or feature"
          className="h-12 w-full rounded-full border border-brand-line bg-black pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-brand-muted focus:border-brand-gold"
        />
      </label>
      <select
        name="fuel"
        defaultValue={fuelType}
        className="h-12 rounded-full border border-brand-line bg-black px-4 text-sm text-white outline-none focus:border-brand-gold"
      >
        <option value="">All fuel</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Hybrid">Hybrid</option>
        <option value="Electric">Electric</option>
      </select>
      <select
        name="transmission"
        defaultValue={transmission}
        className="h-12 rounded-full border border-brand-line bg-black px-4 text-sm text-white outline-none focus:border-brand-gold"
      >
        <option value="">All transmission</option>
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
      </select>
      <button className="h-12 rounded-full px-6 text-sm font-semibold text-black gold-gradient transition-opacity hover:opacity-90">
        Search
      </button>
    </form>
  );
}
