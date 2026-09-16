import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronLeftIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import SavedList from "./SavedList";

const genId = (prefix) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const emptyModifierForm = () => ({
  id: "",
  title: { en: "" },
  external_data: "",
  quantity_info: { min_selections: 0, max_selections: 1 },
  options: [],
});


export default function Items() {
    const [activeTab, setActiveTab] = useState("item");
    const [items, setItems] = useState([]);
    const [modifiers, setModifiers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuId, setMenuId] = useState("menu_001")
    // const savedItemRows = useMemo(
    //     () =>
    //     items.map((it) => ({
    //         id: it.id,
    //         label: it.title.en,
    //         meta: `£${it.price.default.toFixed(2)} · ${it.modifiers.length} modifier(s)`,
    //     })),
    //     [items]
    // );

    // const savedModifierRows = useMemo(
    //     () =>
    //     modifiers.map((m) => ({
    //         id: m.id,
    //         label: m.title.en,
    //         meta: `${m.quantity_info.min_selections}-${m.quantity_info.max_selections} selections · ${m.options.length} option(s)`,
    //     })),
    //     [modifiers]
    // );

    const styles = {
        backButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        display: 'flex',
        color: '#000000',
        marginLeft: "-10px"
        },
    }

    useEffect(()=>{
        loadCategories(),
        loadItems(),
        loadModifiers()
    }, []);

    const loadCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/menu/category/${menuId}`);
            if (response.status !== 200) {
                throw new Error(`Failed to fetch menu categories: ${response.data.message}`);
            }
            const data = await response.data.data;
            setCategories(data.categories);
        } catch (error) {
            setCategories([]);
            console.error("Error fetching categories:", error);
        }
    };

    const loadItems = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/menu/items/menu/${menuId}`);
            if (response.status !== 200) {
                throw new Error(`Failed to fetch menu items: ${response.data.message}`);
            }
            const data = await response.data.data;
            setItems(data.items);
        } catch (error) {
            setItems([]);
            console.error("Error fetching items:", error);
        }
    };

    const loadModifiers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/menu/modifier/menu/${menuId}`);
            if (response.status !== 200) {
                throw new Error(`Failed to fetch menu modifiers: ${response.data.message}`);
            }
            const data = await response.data.data;
            setModifiers(data.modifiers);
        } catch (error) {
            setModifiers([]);
            console.error("Error fetching modifiers:", error);
        }
    };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="flex">
            <button style={styles.backButton} aria-label="Go back">
                <Link to="/menu"><ChevronLeftIcon /></Link>
            </button>
            <h1 className="mb-1 mt-0.5 text-xl font-bold text-gray-900">Menu builder</h1>
        </div>
        
        <p className="mb-6 text-sm text-gray-500">
          Create menu items and modifier groups. Items can attach modifiers, and modifiers reference
          items as their options.
        </p>

        {/* <div className="mb-5 inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setActiveTab("item")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === "item" ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Menu item
          </button>
          <button
            onClick={() => setActiveTab("modifier")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === "modifier" ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Modifier
          </button>
        </div> */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
          {/* <div className="lg:col-span-2">
            {activeTab === "item" ? (
              <ItemForm
                modifiersList={modifiers}
                onSave={(item) => setItems((prev) => [...prev, item])}
              />
            ) : (
              <ModifierForm
                itemsList={items}
                onSave={(modifier) => setModifiers((prev) => [...prev, modifier])}
              />
            )}
          </div> */}

          <div className="space-y-6">
            <SavedList
              title="Saved items"
              items={items}
              onDelete={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
              renderMeta
            />
            {/* <SavedList
              title="Saved modifiers"
              items={modifiers}
              onDelete={(id) => setModifiers((prev) => prev.filter((m) => m.id !== id))}
              renderMeta
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}