import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronLeftIcon
} from "lucide-react";
import {Link} from "react-router-dom";

export default function ItemLayout({children}){
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
                {
                    children
                }
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