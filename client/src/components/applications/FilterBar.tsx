import type { ApplicationFilters } from "../../api/applications";
import { STATUS_LABELS } from "../../types/application";

interface FilterBarProps {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const selectClass =
    "px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";

  function update<K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({ sortBy: filters.sortBy, sortOrder: filters.sortOrder });
  }

  const hasActiveFilters = !!(filters.search || filters.status || filters.workMode || filters.employmentType || filters.location);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Search company or job title..."
        value={filters.search ?? ""}
        onChange={(e) => update("search", e.target.value)}
        className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <select value={filters.status ?? ""} onChange={(e) => update("status", e.target.value as any)} className={selectClass}>
        <option value="">All statuses</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select value={filters.workMode ?? ""} onChange={(e) => update("workMode", e.target.value as any)} className={selectClass}>
        <option value="">All work modes</option>
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
        <option value="ONSITE">On-site</option>
      </select>

      <select value={filters.employmentType ?? ""} onChange={(e) => update("employmentType", e.target.value as any)} className={selectClass}>
        <option value="">All types</option>
        <option value="INTERNSHIP">Internship</option>
        <option value="FULL_TIME">Full-time</option>
        <option value="PART_TIME">Part-time</option>
        <option value="CONTRACT">Contract</option>
      </select>

      <select
        value={`${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(":") as [ApplicationFilters["sortBy"], ApplicationFilters["sortOrder"]];
          onChange({ ...filters, sortBy, sortOrder });
        }}
        className={selectClass}
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="company:asc">Company (A–Z)</option>
        <option value="company:desc">Company (Z–A)</option>
        <option value="deadline:asc">Deadline (soonest)</option>
        <option value="applicationDate:desc">Application date (newest)</option>
      </select>

      {hasActiveFilters && (
        <button onClick={clearAll} className="text-sm text-gray-500 hover:text-gray-700 underline">
          Clear filters
        </button>
      )}
    </div>
  );
}