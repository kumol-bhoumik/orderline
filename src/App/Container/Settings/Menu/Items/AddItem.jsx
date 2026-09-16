import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import ItemLayout from "./Layout/ItemLayout";
import ItemForm from "./ItemForm";
export default function AddItem(){
    const [categories, setCategories] = useState([]);
    const [menuId, setMenuId] = useState("menu_001");
    const [modifiers, setModifiers] = useState([]);
    useEffect(()=>{
        loadCategories()
        // loadItems()
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

    // const loadItems = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/v1/menu/items/menu/${menuId}`);
    //         if (response.status !== 200) {
    //             throw new Error(`Failed to fetch menu items: ${response.data.message}`);
    //         }
    //         const data = await response.data.data;
    //         setItems(data.items);
    //     } catch (error) {
    //         setItems([]);
    //         console.error("Error fetching items:", error);
    //     }
    // };

    const saveItem = async()=>{
        console.log("item saved")
    }
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
    return (<ItemLayout>
        <ItemForm modifiersList={modifiers} categories={categories} onSave={()=>saveItem()}/>
    </ItemLayout>)
}