import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
export default function SavedList({ title, items, onDelete, renderMeta }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex justify-between">
            <h3 className="mb-3 text-sm font-bold text-gray-900">
            {title} <span className="text-gray-400">({items.length})</span>
        </h3>
            <Link to="/item/add">Add Item</Link>
        </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">Nothing saved yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{it.label || it.id}</p>
                <p className="text-xs text-gray-400">{it.id}</p>
                {renderMeta && it.meta && <p className="mt-0.5 text-xs text-gray-400">{it.meta}</p>}
              </div>
              <button onClick={() => onDelete(it.id)} className="text-gray-300 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}