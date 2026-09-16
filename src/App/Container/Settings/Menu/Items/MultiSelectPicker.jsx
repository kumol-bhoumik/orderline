import React, { useMemo, useState } from "react";
import {
  Plus,
  X,
  Trash2,
  Image as ImageIcon,
  Percent,
  Globe,
  Tag,
  Search,
  ChevronDown,
  Bike,
  Sofa,
  Footprints,
  PackageCheck,
  Wallet,
  ListChecks,
  Layers,
  AlertTriangle,
  ChevronLeftIcon
} from "lucide-react";
export default function MultiSelectPicker({ allOptions, selectedIds, onChange, emptyLabel, icon }) {
  const [query, setQuery] = useState("");

  const filtered = allOptions.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectedItems = allOptions.filter((o) => selectedIds.includes(o.id));

  return (
    <div>
      {selectedItems.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedItems.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
            >
              {s.label}
              <button type="button" onClick={() => toggle(s.id)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {allOptions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 px-3 py-3 text-xs text-gray-400">
          {emptyLabel}
        </p>
      ) : (
        <div className="rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm outline-none placeholder-gray-400"
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs text-gray-400">No matches</p>
            ) : (
              filtered.map((o) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(o.id)}
                    onChange={() => toggle(o.id)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1.5 text-gray-700">
                    {icon}
                    {o.label}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}