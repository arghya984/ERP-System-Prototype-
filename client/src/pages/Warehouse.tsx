import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ArrowDown, ArrowUp, Database } from 'lucide-react';

const Warehouse = () => {
  const [inventory, setInventory] = useState<any[]>([]);

  const fetchInventory = async () => {
    const res = await axios.get('http://localhost:5000/api/inventory');
    setInventory(res.data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const initializeInventory = async () => {
    await axios.post('http://localhost:5000/api/inventory/init');
    fetchInventory();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Warehouse Inventory</h2>
        <button onClick={initializeInventory} className="flex items-center text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
          <Database size={16} className="mr-2" /> Reset Inventory Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inventory.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
            <div className={`p-4 rounded-xl mr-6 ${item.type === 'Raw Material' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <Package size={32} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">{item.type}</p>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
              <div className="flex items-end">
                <span className="text-4xl font-extrabold text-slate-900 leading-none">{item.quantity}</span>
                <span className="text-slate-500 ml-2 font-medium">units</span>
              </div>
            </div>
            
            <div className="h-full flex flex-col justify-between pl-6 border-l border-slate-100">
               {item.type === 'Raw Material' ? (
                 <div className="text-orange-500 flex flex-col items-center">
                   <ArrowDown size={24} />
                   <span className="text-xs font-bold mt-1">DRAINS</span>
                 </div>
               ) : (
                 <div className="text-emerald-500 flex flex-col items-center">
                   <ArrowUp size={24} />
                   <span className="text-xs font-bold mt-1">FILLS</span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
      
      {inventory.length === 0 && (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200 mt-6 shadow-sm">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg mb-4">No inventory data available.</p>
          <button onClick={initializeInventory} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Initialize Demo Data
          </button>
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-2">How it works:</h4>
        <p className="text-blue-800 text-sm leading-relaxed">
          The Warehouse acts as the final ledger in the Golden Path. When a <strong>Manufacturing Task</strong> is marked as 'Completed', the system automatically deducts from the <strong>Raw Material</strong> inventory and increments the <strong>Finished Product</strong> inventory.
        </p>
      </div>
    </div>
  );
};

export default Warehouse;
