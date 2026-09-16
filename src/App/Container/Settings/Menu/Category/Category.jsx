import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {ChevronLeftIcon} from "lucide-react"

function ImagePlaceholderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="8.5" cy="9" r="1.5" fill="currentColor" />
      <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
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

export default function Category() {
    const [internalCategories, setInternalCategories] = useState([
    ]);
    const [menuId, setMenuId] = useState("menu_001"); 
    const categories = internalCategories;

    useEffect(()=>{
        loadData()
    }, []);

    const loadData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/menu/category/${menuId}`);
            if (response.status !== 200) {
                throw new Error(`Failed to fetch menu categories: ${response.data.message}`);
            }
            const data = await response.data.data;
            setInternalCategories(data.categories);
        } catch (error) {
            setInternalCategories([]);
            console.error("Error fetching categories:", error);
        }
    };

    const styles = {
        backButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            color: '#000000',
            marginLeft: "-6px"
        },
    }

    return (
        <div className="w-full p-6">
            <Link to='/item'>Create Item</Link>

            <div className="mb-4 flex items-center justify-between">
                <div>
                    <div className='flex'>
                        <button style={styles.backButton} aria-label="Go back">
                            <Link to="/"><ChevronLeftIcon /></Link>
                        </button>
                        <h2 className="text-base font-bold text-gray-900">Categories</h2>
                    </div>
                    <p className="text-sm text-gray-500">
                        {"edits" === 'edit' ? 'Drag order sets display priority' : `${categories.length} categories`}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                {/* <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                    <button
                    type="button"
                    onClick={() => setMode('view')}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                        currentMode === 'view' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    >
                    <EyeIcon />
                    View
                    </button>
                    <button
                    type="button"
                    onClick={() => setMode('edit')}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                        currentMode === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    >
                    <PencilIcon />
                    Edit
                    </button>
                </div> */}

                
                    {/* <button
                    type="button"
                    // onClick={addCategory}
                    className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                    <PlusIcon />
                    Add category
                    </button> */}
{/* 'bg-white text-gray-900 shadow-sm' */}
                    <Link
                    to = "/create/category"
                    type="button"
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold transition-colors text-gray-500 hover:text-gray-700`}>
                    <PencilIcon />
                    Edit
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-2">
            {categories.map((category) => (
                <div
                key={category.id || category.priority}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                >
                <span className="w-5 shrink-0 text-center text-xs font-semibold text-gray-400">
                    {category.priority}
                </span>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 text-gray-300">
                    {category.image ? (
                    <img src={category.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                    <ImagePlaceholderIcon />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                    {category.title.ln_us || <span className="italic text-gray-400">Untitled</span>}
                    </p>
                    <p className="truncate font-mono text-xs text-gray-400">{category.id || '—'}</p>
                </div>

                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    category.show ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                >
                    {category.show ? 'Visible' : 'Hidden'}
                </span>
                </div>
            ))}

            {categories.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
                No categories yet.
                </div>
            )}
            </div>
        </div>
    )
}