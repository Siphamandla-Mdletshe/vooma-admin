import type { ApplicationFilters as Filters } from "./application-filters";
import { bodyTypeLabels } from "./application-filters";

export function ApplicationFilters({
  filters,
  cities,
  makes,
  onChange,
  onClear,
}: {
  filters: Filters;
  cities: string[];
  makes: string[];
  onChange: (value: Partial<Filters>) => void;
  onClear: () => void;
}) {
  return (
    <div
      id="application-filters"
      className="application-filters"
      role="group"
      aria-label="Application filters"
    >
      <label>
        City
        <select
          aria-label="City"
          value={filters.city}
          onChange={(event) => onChange({ city: event.target.value })}
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </label>
      <label>
        Vehicle make
        <select
          aria-label="Vehicle make"
          value={filters.make}
          onChange={(event) => onChange({ make: event.target.value })}
        >
          <option value="">All makes</option>
          {makes.map((make) => (
            <option key={make}>{make}</option>
          ))}
        </select>
      </label>
      <label>
        Application created from
        <input
          type="date"
          aria-label="Application created from"
          value={filters.from}
          max={filters.until || undefined}
          onChange={(event) => onChange({ from: event.target.value })}
        />
      </label>
      <label>
        Body type
        <select
          aria-label="Body type"
          value={filters.bodyType}
          onChange={(event) => onChange({ bodyType: event.target.value })}
        >
          <option value="">All body types</option>
          {Object.entries(bodyTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="appeal-filter">
        <input
          type="checkbox"
          aria-label="Appeals awaiting review"
          checked={filters.appealsOnly}
          onChange={(event) => onChange({ appealsOnly: event.target.checked })}
        />
        Appeals awaiting review
      </label>
      <label>
        Application created until
        <input
          type="date"
          aria-label="Application created until"
          value={filters.until}
          min={filters.from || undefined}
          onChange={(event) => onChange({ until: event.target.value })}
        />
      </label>
      {filters.from && filters.until && filters.from > filters.until && (
        <p className="registration-error" role="alert">
          The end date must be on or after the start date.
        </p>
      )}
      <button className="text-link" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
