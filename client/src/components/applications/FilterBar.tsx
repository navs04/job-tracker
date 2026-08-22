import { Search, X } from "lucide-react";
import type { ApplicationFilters } from "../../api/applications";
import { STATUS_LABELS } from "../../types/application";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface FilterBarProps {
  filters: ApplicationFilters;
  onChange: (filters: ApplicationFilters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function update<K extends keyof ApplicationFilters>(key: K, value: ApplicationFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({ sortBy: filters.sortBy, sortOrder: filters.sortOrder });
  }

  const hasActiveFilters = !!(filters.search || filters.status || filters.workMode || filters.employmentType || filters.location);

  return (
    <div className="bg-surface border border-border rounded-lg p-3 flex flex-wrap items-center gap-2 mb-5">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" strokeWidth={2} />
        <Input
          placeholder="Search company or job title..."
          value={filters.search ?? ""}
          onChange={(e) => update("search", e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={filters.status ?? ""} onChange={(e) => update("status", e.target.value as any)}>
        <option value="">All statuses</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>

      <Select value={filters.workMode ?? ""} onChange={(e) => update("workMode", e.target.value as any)}>
        <option value="">All work modes</option>
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
        <option value="ONSITE">On-site</option>
      </Select>

      <Select value={filters.employmentType ?? ""} onChange={(e) => update("employmentType", e.target.value as any)}>
        <option value="">All types</option>
        <option value="INTERNSHIP">Internship</option>
        <option value="FULL_TIME">Full-time</option>
        <option value="PART_TIME">Part-time</option>
        <option value="CONTRACT">Contract</option>
      </Select>

      <Select
        value={`${filters.sortBy ?? "createdAt"}:${filters.sortOrder ?? "desc"}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(":") as [ApplicationFilters["sortBy"], ApplicationFilters["sortOrder"]];
          onChange({ ...filters, sortBy, sortOrder });
        }}
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="company:asc">Company (A–Z)</option>
        <option value="company:desc">Company (Z–A)</option>
        <option value="deadline:asc">Deadline (soonest)</option>
        <option value="applicationDate:desc">Application date (newest)</option>
      </Select>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-sm text-muted hover:text-ink px-2 py-2 transition-colors duration-150"
        >
          <X size={14} strokeWidth={2} />
          Clear
        </button>
      )}
    </div>
  );
}