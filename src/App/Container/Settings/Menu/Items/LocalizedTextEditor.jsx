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
import TextInput from "./Layout/TextInput";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "bn", label: "Bengali" },
];

export default function LocalizedTextEditor({ value, onChange, multiline, placeholder }) {
  const usedCodes = Object.keys(value);
  const availableToAdd = LANGUAGE_OPTIONS.filter((l) => !usedCodes.includes(l.code));

  const updateLang = (code, text) => {
    onChange({ ...value, [code]: text });
  };

  const removeLang = (code) => {
    const next = { ...value };
    delete next[code];
    onChange(next);
  };

  const addLang = (code) => {
    onChange({ ...value, [code]: "" });
  };

  return (
    <div className="space-y-2">
      {usedCodes.length === 0 && (
        <p className="text-xs text-gray-400">No languages added yet — add one below.</p>
      )}
      {usedCodes.map((code) => {
        const langLabel = LANGUAGE_OPTIONS.find((l) => l.code === code)?.label || code;
        return (
          <div key={code} className="flex items-start gap-2">
            <span className="mt-2 w-16 shrink-0 text-xs font-semibold uppercase text-gray-400">
              {code}
            </span>
            {multiline ? (
              <textarea
                value={value[code]}
                onChange={(e) => updateLang(code, e.target.value)}
                placeholder={`${placeholder || ""} (${langLabel})`}
                rows={2}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            ) : (
              <TextInput
                value={value[code]}
                onChange={(e) => updateLang(code, e.target.value)}
                placeholder={`${placeholder || ""} (${langLabel})`}
              />
            )}
            <button
              type="button"
              onClick={() => removeLang(code)}
              className="mt-1.5 shrink-0 text-gray-300 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      {availableToAdd.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {availableToAdd.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => addLang(l.code)}
              className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 hover:border-emerald-400 hover:text-emerald-600"
            >
              <Plus className="h-3 w-3" />
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}