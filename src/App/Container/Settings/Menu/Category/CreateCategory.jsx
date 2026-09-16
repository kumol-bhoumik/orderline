import axios from "axios";
import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

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

function createEmptyCategory(priority) {
  return {
    id: generateRandomId(6),
    title: { ln_us: '' },
    image: '',
    priority,
    show: true,
  };
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="8.5" cy="9" r="1.5" fill="currentColor" />
      <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.8} />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CreateCategory() {
  
  const [internalCategories, setInternalCategories] = useState([
    // { id: generateRandomId(6), title: { ln_us: 'Burgers' }, image: '', priority: 1, show: true },
    // { id: generateRandomId(6), title: { ln_us: 'Drinks' }, image: '', priority: 2, show: true },
  ]);
  const [menuId, setMenuId] = useState("menu_001"); 
  const categories = internalCategories;
  const setCategories = (next) => {
      setInternalCategories(next);
  };

  const renumber = (list) => list.map((cat, index) => ({ ...cat, priority: index + 1 }));

  const updateCategory = (index, patch) => {
    console.log(patch)
    const next = categories.map((cat, i) => (i === index ? { ...cat, ...patch } : cat));
    setCategories(next);
  };

  const saveCategory = async() => {
        try{
            const response = await axios.put(`http://localhost:8080/api/v1/menu/category/${menuId}`, { categories });
            if (response.status !== 200) {
              throw new Error(`Failed to fetch orders: ${response.data.message}`);
            }
            const data = await response.data;
            console.log("Fetched orders:", data);
        } catch(err){
            console.log(err);
        }
  }

  const addCategory = () => {
    setCategories(renumber([...categories, createEmptyCategory(categories.length + 1)]));
  };

  const removeCategory = (index) => {
    setCategories(renumber(categories.filter((_, i) => i !== index)));
  };

  const moveCategory = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const next = [...categories];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setCategories(renumber(next));
  };

  useEffect(()=>{
    loadData()
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/menu/category/${menuId}`);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch menu categories: ${response.data.message}`);
      }
      const data = await response.data;
      setCategories(data.categories);
    } catch (error) {
      setCategories([]);
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="w-full p-6">
        {/* <Link to='/'>Back</Link>
        <Link to='/item'>Create Item</Link> */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">
            Drag order sets display priority
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <Link
              type="button"
              to="/menu"
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                'bg-white text-gray-900 shadow-sm'
              }`}
            > {/* : 'text-gray-500 hover:text-gray-700' */}
              <EyeIcon />
              View
            </Link>
{/* currentMode === 'view' ? 'bg-white text-gray-900 shadow-sm' :  */}
            <button
              type="button"
              to="/menu"
              onClick={()=> saveCategory()}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Save />
              Save
            </button>
            {/* <Link
              type="button"
              
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                currentMode === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PencilIcon />
              Edit
            </Link> */}
          </div>

          
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <PlusIcon />
              Add category
            </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3"
          >
            {/* Reorder controls */}
            <div className="flex flex-col items-center gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => moveCategory(index, -1)}
                disabled={index === 0}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Move up"
              >
                <ChevronUpIcon />
              </button>
              <span className="text-xs font-semibold text-gray-400">{category.priority}</span>
              <button
                type="button"
                onClick={() => moveCategory(index, 1)}
                disabled={index === categories.length - 1}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Move down"
              >
                <ChevronDownIcon />
              </button>
            </div>

            {/* Image preview */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 text-gray-300">
              {category.image ? (
                <img src={category.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlaceholderIcon />
              )}
            </div>

            {/* Fields */}
            <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-2">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  Category name
                </label>
                <input
                  type="text"
                  value={category.title.ln_us}
                  onChange={(e) => {
                    const nextTitle = e.target.value;
                    updateCategory(index, {title: {ln_us: nextTitle}})
                  }}
                  placeholder="e.g. Burgers"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs font-semibold text-gray-500">ID</label>
                <input
                  type="text"
                  value={category.id}
                  onChange={(e) => updateCategory(index, { id: slugify(e.target.value) })}
                  placeholder="e.g. burgers"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div> */}
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs font-semibold text-gray-500">
                  Image URL
                </label>
                <input
                  type="text"
                  value={category.image}
                  onChange={(e) => updateCategory(index, { image: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Show toggle + delete */}
            <div className="flex flex-col items-end justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="text-gray-400 hover:text-red-600"
                aria-label="Remove category"
              >
                <TrashIcon />
              </button>

              <label className="flex cursor-pointer items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">
                  {category.show ? 'Visible' : 'Hidden'}
                </span>
                <span
                  role="switch"
                  aria-checked={category.show}
                  tabIndex={0}
                  onClick={() => updateCategory(index, { show: !category.show })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') updateCategory(index, { show: !category.show });
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    category.show ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      category.show ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                    style={{ transform: category.show ? 'translateX(0px)' : 'translateX(0px)' }}
                  />
                </span>
              </label>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
            No categories yet — add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}