import React from 'react';
import { createRoot } from 'react-dom/client';
import {Search, Plus, Trash2, FileDown, Dumbbell, Copy, Home as HomeIcon, Library as LibraryIcon, Settings, List} from 'lucide-react';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
