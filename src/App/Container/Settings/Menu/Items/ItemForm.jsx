import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import LocalizedTextEditor from "./LocalizedTextEditor";
import MultiSelectPicker from "./MultiSelectPicker";
import TextInput from "./Layout/TextInput";
import NumberInput from "./Layout/NumberInput";

function generateRandomId(d) {
    if(d<6){
        d = 6;
    }
    let lowerLevel = "1";
    let upperLevel = "9";
    for(let i = 1; i<d; i++){
        lowerLevel += 0;
        upperLevel += 0;
    }
    return Math.floor((+lowerLevel) + Math.random() * (+upperLevel)).toString();
}

const emptyItemForm = () => ({
  id: generateRandomId(6),
  category_id: "",
  type: "item",
  title: { en: "" },
  description: { en: "" },
  image: "",
  price: { collection: 0, dine_in: 0, walk_in: 0, delivery: 0, default: 0 },
  tax_info: { tax_rate: 0, vat_rate_percentage: 0 },
  nutritional_info: { allergens: [] },
  modifiers: [],
});

const ALLERGEN_PRESETS = [
  "Gluten",
  "Dairy",
  "Eggs",
  "Nuts",
  "Peanuts",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
];

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 flex items-center gap-1 text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}


export default function ItemForm({ modifiersList, onSave, categories, item }) {
  const [form, setForm] = useState(item ? item : emptyItemForm());
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState(!item);
  const navigate = useNavigate();
  const modifierOptions = modifiersList.map((m) => ({ id: m.id, label: m.title.en || m.id }));

  const handleTitleBlurAutoId = () => {
    if (!form.id && form.title.en) {
      setForm((f) => ({ ...f, id: slugify(f.title.en) || genId("item") }));
    }
  };

  const toggleAllergen = (allergen) => {
    setForm((f) => {
      const has = f.nutritional_info.allergens.includes(allergen);
      return {
        ...f,
        nutritional_info: {
          allergens: has
            ? f.nutritional_info.allergens.filter((a) => a !== allergen)
            : [...f.nutritional_info.allergens, allergen],
        },
      };
    });
  };

  const handleSubmit = async() => {
    if (!form.id.trim()) return setError("Item ID is required.");
    if (!form.title.en?.trim()) return setError("An English title is recommended before saving.");
    const priceFields = ["collection", "dine_in", "walk_in", "delivery", "default"];
    for (const f of priceFields) {
      if (form.price[f] === undefined || form.price[f] === null || Number.isNaN(form.price[f])) {
        return setError(`Price for "${f}" is required.`);
      }
    }
    if (!form.tax_info.vat_rate_percentage && form.tax_info.vat_rate_percentage !== 0) {
      return setError("VAT rate percentage is required.");
    }

    setError(null);
    //console.log(form);
    let response = await onSave(form, newItem);
    console.log(response)
    //setForm(emptyItemForm());
  };

  return (
    <div className="space-y-4">
      <SectionCard icon={<Tag className="h-4 w-4" />} title="Basic details">
        <Field label="Item ID" required hint="Auto-suggested from the English title; edit if needed.">
          <TextInput
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="e.g. double_smash_burger"
          />
        </Field>

        <Field label="Category">
          <div className="relative">
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title.ln_us}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </Field>

        <Field label="Title" hint="Add extra languages as needed.">
          <div onBlur={handleTitleBlurAutoId}>
            <LocalizedTextEditor
              value={form.title}
              onChange={(title) => setForm({ ...form, title })}
              placeholder="Item name"
            />
          </div>
        </Field>

        <Field label="Description">
          <LocalizedTextEditor
            value={form.description}
            onChange={(description) => setForm({ ...form, description })}
            placeholder="Short description"
            multiline
          />
        </Field>

        <Field label="Image URL">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {form.image ? (
                <img src={form.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-5 w-5 text-gray-300" />
              )}
            </div>
            <TextInput
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </Field>
      </SectionCard>

      <SectionCard
        icon={<Wallet className="h-4 w-4" />}
        title="Pricing"
        subtitle="All five prices are required by the schema."
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
          <Field label="Default price" required>
            <NumberInput
              value={form.price.default}
              onChange={(e) =>
                setForm({ ...form, price: { ...form.price, default: Number(e.target.value) } })
              }
              min={0}
              step="0.01"
            />
          </Field>
          <Field label="Delivery" required>
            <div className="relative">
              <Bike className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
              <NumberInput
                value={form.price.delivery}
                onChange={(e) =>
                  setForm({ ...form, price: { ...form.price, delivery: Number(e.target.value) } })
                }
                className="pl-9"
                min={0}
                step="0.01"
              />
            </div>
          </Field>
          <Field label="Dine in" required>
            <div className="relative">
              <Sofa className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
              <NumberInput
                value={form.price.dine_in}
                onChange={(e) =>
                  setForm({ ...form, price: { ...form.price, dine_in: Number(e.target.value) } })
                }
                className="pl-9"
                min={0}
                step="0.01"
              />
            </div>
          </Field>
          <Field label="Walk in" required>
            <div className="relative">
              <Footprints className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
              <NumberInput
                value={form.price.walk_in}
                onChange={(e) =>
                  setForm({ ...form, price: { ...form.price, walk_in: Number(e.target.value) } })
                }
                className="pl-9"
                min={0}
                step="0.01"
              />
            </div>
          </Field>
          <Field label="Collection" required>
            <div className="relative">
              <PackageCheck className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
              <NumberInput
                value={form.price.collection}
                onChange={(e) =>
                  setForm({ ...form, price: { ...form.price, collection: Number(e.target.value) } })
                }
                className="pl-9"
                min={0}
                step="0.01"
              />
            </div>
          </Field>
        </div>
      </SectionCard>

      <SectionCard icon={<Percent className="h-4 w-4" />} title="Tax information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tax rate" hint="Defaults to 0 if left blank.">
            <NumberInput
              value={form.tax_info.tax_rate}
              onChange={(e) =>
                setForm({ ...form, tax_info: { ...form.tax_info, tax_rate: Number(e.target.value) } })
              }
              min={0}
              step="0.01"
            />
          </Field>
          <Field label="VAT rate (%)" required>
            <NumberInput
              value={form.tax_info.vat_rate_percentage}
              onChange={(e) =>
                setForm({
                  ...form,
                  tax_info: { ...form.tax_info, vat_rate_percentage: Number(e.target.value) },
                })
              }
              min={0}
              step="0.01"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard icon={<AlertTriangle className="h-4 w-4" />} title="Nutritional info" subtitle="Allergens">
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_PRESETS.map((a) => {
            const active = form.nutritional_info.allergens.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAllergen(a)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard icon={<Layers className="h-4 w-4" />} title="Modifiers" subtitle="Attach existing modifier groups">
        <MultiSelectPicker
          allOptions={modifierOptions}
          selectedIds={form.modifiers}
          onChange={(modifiers) => setForm({ ...form, modifiers })}
          emptyLabel="No modifiers created yet — add one from the Modifier tab first."
          icon={<Layers className="h-3.5 w-3.5 text-gray-400" />}
        />
      </SectionCard>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={()=>handleSubmit()}
        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
      >
        Save item
      </button>
    </div>
  );
}