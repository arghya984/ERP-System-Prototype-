import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CRM from './pages/CRM';
import Sales from './pages/Sales';
import Manufacturing from './pages/Manufacturing';
import Warehouse from './pages/Warehouse';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/crm" replace />} />
          <Route path="crm" element={<CRM />} />
          <Route path="sales" element={<Sales />} />
          <Route path="manufacturing" element={<Manufacturing />} />
          <Route path="warehouse" element={<Warehouse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
