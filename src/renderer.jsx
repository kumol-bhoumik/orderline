/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import './index.css';

// console.log(
//   '👋 This message is being logged by "renderer.js", included via Vite',
// );

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Optional: keep or delete if you want custom global styles
import {  createBrowserRouter, RouterProvider } from 'react-router-dom';
import OrderLineDashboard from './OrderLineDashboard.jsx';
import OrderCreationScreen from './App/Container/OrderPlacing/OrderCreationScreen.jsx';
import ShopHours from './App/Container/Settings/ShopHours/ShopHours.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <OrderLineDashboard/>,
    // errorElement: <NotFound />, // Handles 404s or app crashes
  },
  {
    path: '/create',
    element: <OrderCreationScreen/>,
  },
  {
    path: "/hours",
    element: <ShopHours/>
  }
]);
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);