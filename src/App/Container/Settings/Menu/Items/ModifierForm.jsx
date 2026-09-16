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
export default function ModifierForm({ itemsList, onSave }) {
  const [form, setForm] = useState(emptyModifierForm());
  const [error, setError] = useState(null);

  const itemOptions = itemsList.map((it) => ({
    id: it.id,
    label: it.title.en || it.id,
  }));

  const handleTitleBlurAutoId = () => {
    if (!form.id && form.title.en) {
      setForm((f) => ({ ...f, id: slugify(f.title.en) || genId("mod") }));
    }
  };

  const applyPreset = (min, max) => {
    setForm((f) => ({ ...f, quantity_info: { min_selections: min, max_selections: max } }));
  };

  const handleOptionsChange = (ids) => {
    setForm((f) => ({
      ...f,
      options: ids.map((id) => ({ id, type: "ITEM" })),
    }));
  };

  const handleSubmit = () => {
    if (!form.id.trim()) return setError("Modifier ID is required.");
    if (!form.title.en?.trim()) return setError("Title (English) is required.");
    if (form.quantity_info.max_selections < form.quantity_info.min_selections) {
      return setError("Max selections cannot be lower than min selections.");
    }
    if (form.options.length === 0) return setError("At least one option is required.");

    setError(null);
    onSave(form);
    setForm(emptyModifierForm());
  };

  return (
    <div className="space-y-4">
      <SectionCard icon={<Tag className="h-4 w-4" />} title="Basic details">
        <Field label="Modifier ID" required hint="Auto-suggested from the title; edit if needed.">
          <TextInput
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="e.g. choice_of_sauce"
          />
        </Field>

        <Field label="Title (English)" required>
          <TextInput
            value={form.title.en}
            onBlur={handleTitleBlurAutoId}
            onChange={(e) => setForm({ ...form, title: { en: e.target.value } })}
            placeholder="e.g. Choose your sauce"
          />
        </Field>

        <Field label="External data" hint="Optional reference id/code from an external POS system.">
          <TextInput
            value={form.external_data}
            onChange={(e) => setForm({ ...form, external_data: e.target.value })}
            placeholder="e.g. ext_ref_1234"
          />
        </Field>
      </SectionCard>

      <SectionCard icon={<Globe className="h-4 w-4" />} title="Selection rules">
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset(1, 1)}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
          >
            Required · single choice
          </button>
          <button
            type="button"
            onClick={() => applyPreset(0, 1)}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
          >
            Optional · single choice
          </button>
          <button
            type="button"
            onClick={() => applyPreset(0, 5)}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
          >
            Optional · up to 5
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Min selections" required>
            <NumberInput
              value={form.quantity_info.min_selections}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity_info: { ...form.quantity_info, min_selections: Number(e.target.value) },
                })
              }
              min={0}
            />
          </Field>
          <Field label="Max selections" required>
            <NumberInput
              value={form.quantity_info.max_selections}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity_info: { ...form.quantity_info, max_selections: Number(e.target.value) },
                })
              }
              min={0}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        icon={<ListChecks className="h-4 w-4" />}
        title="Options"
        subtitle="Each option references an existing menu item"
      >
        <MultiSelectPicker
          allOptions={itemOptions}
          selectedIds={form.options.map((o) => o.id)}
          onChange={handleOptionsChange}
          emptyLabel="No items created yet — add one from the Menu Item tab first."
          icon={<Tag className="h-3.5 w-3.5 text-gray-400" />}
        />
      </SectionCard>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
      >
        Save modifier
      </button>
    </div>
  );
}