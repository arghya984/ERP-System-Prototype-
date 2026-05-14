import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ArrowDown, ArrowUp, Database, PlusCircle, Trash2, Edit2, Check, X } from 'lucide-react';

const Warehouse = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('Raw Material');
  const [newItemQuantity, setNewItemQuantity] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', type: '' });

  const fetchInventory = async () => {
    const res = await axios.get('http://localhost:5000/api/inventory');
    setInventory(res.data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const initializeInventory = async () => {
    if (window.confirm('This will delete all current inventory and seed default data. Continue?')) {
      await axios.post('http://localhost:5000/api/inventory/init');
      fetchInventory();
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/inventory', {
      name: newItemName,
      type: newItemType,
      quantity: newItemQuantity
    });
    setNewItemName(''); setNewItemQuantity(0);
    fetchInventory();
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    await axios.patch(`http://localhost:5000/api/inventory/${id}`, { quantity: newQuantity });
    fetchInventory();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      fetchInventory();
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item._id);
    setEditForm({ name: item.name, type: item.type });
  };

  const handleEditSubmit = async (id: string) => {
    await axios.put(`http://localhost:5000/api/inventory/${id}`, editForm);
    setEditingId(null);
    fetchInventory();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <button onClick={initializeInventory} className="flex items-center self-start sm:self-auto text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
          <Database size={16} className="mr-2" /> Reset Inventory Data
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><PlusCircle className="mr-2" size={20} /> Create Custom Item</h3>
        <form onSubmit={handleCreateItem} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Item Name</label>
            <input type="text" required value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
            <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Raw Material">Raw Material</option>
              <option value="Finished Product">Finished Product</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Initial Quantity</label>
            <input type="number" min="0" required value={newItemQuantity} onChange={e => setNewItemQuantity(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors h-[42px]">
            Add Item
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inventory.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center relative group">
            <div className={`p-4 rounded-xl mr-6 ${item.type === 'Raw Material' || editForm.type === 'Raw Material' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <Package size={32} />
            </div>

            <div className="flex-1 pr-8">
              {editingId === item._id ? (
                <div className="space-y-2 mb-2">
                  <div className="flex items-center justify-between">
                    <select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-2/3 text-sm border p-1 rounded outline-none">
                      <option value="Raw Material">Raw Material</option>
                      <option value="Finished Product">Finished Product</option>
                    </select>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditSubmit(item._id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X size={18} /></button>
                    </div>
                  </div>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full font-bold border p-1 rounded outline-none" />
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">{item.type}</p>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-800 pr-2">{item.name}</h3>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                      <button onClick={() => startEdit(item)} className="text-slate-400 hover:text-blue-600 p-1 rounded"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-red-600 p-1 rounded"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-end">
                <span className="text-4xl font-extrabold text-slate-900 leading-none">{item.quantity}</span>
                <span className="text-slate-500 ml-2 font-medium">units</span>
              </div>

              <div className="flex mt-3 space-x-2">
                <button onClick={() => updateQuantity(item._id, item.quantity - 10)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold">-10</button>
                <button onClick={() => updateQuantity(item._id, item.quantity + 10)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold">+10</button>
                <button onClick={() => updateQuantity(item._id, item.quantity + 100)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold">+100</button>
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
