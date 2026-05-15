import { useState, useEffect } from 'react';
import api from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2, Edit2, Check, X } from 'lucide-react';

const Sales = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [product, setProduct] = useState('GSM 55 Thermal Paper (POS Rolls)');
  const [quantity, setQuantity] = useState(10);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ product: '', quantity: 1 });

  const location = useLocation();
  const navigate = useNavigate();
  const initialLead = location.state?.lead;

  const fetchOrders = async () => {
    const res = await api.get('/api/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialLead) return alert('Please select a lead from CRM first!');

    await api.post('/api/orders', {
      leadId: initialLead._id,
      product,
      quantity
    });

    navigate('/sales', { replace: true });
    fetchOrders();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await api.delete(`/api/orders/${id}`);
      fetchOrders();
    }
  };

  const startEdit = (order: any) => {
    setEditingId(order._id);
    setEditForm({ product: order.product, quantity: order.quantity });
  };

  const handleEditSubmit = async (id: string) => {
    await api.put(`/api/orders/${id}`, editForm);
    setEditingId(null);
    fetchOrders();
  };

  const triggerManufacturing = async (orderId: string) => {
    await api.post('/api/manufacturing', { orderId });
    fetchOrders();
    navigate('/manufacturing');
  };

  return (
    <div>

      {initialLead && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <ShoppingCart className="mr-2" size={20} /> Create Order for {initialLead.name} ({initialLead.company})
          </h3>
          <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Product</label>
              <select value={product} onChange={e => setProduct(e.target.value)} className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="GSM 55 Thermal Paper (POS Rolls)">GSM 55 Thermal Paper (POS Rolls)</option>
                <option value="A4 Paper Reams">A4 Paper Reams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Quantity</label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors h-[42px]">
              Confirm Order
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Order ID</th>
              <th className="p-4 font-semibold text-slate-600">Client</th>
              <th className="p-4 font-semibold text-slate-600">Product</th>
              <th className="p-4 font-semibold text-slate-600">Qty</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-500">{order._id.substring(order._id.length - 6)}</td>
                <td className="p-4">{order.leadId?.company || 'Unknown'}</td>

                {editingId === order._id ? (
                  <>
                    <td className="p-4">
                      <select value={editForm.product} onChange={e => setEditForm({ ...editForm, product: e.target.value })} className="w-full border p-1 rounded">
                        <option value="GSM 55 Thermal Paper (POS Rolls)">GSM 55 Thermal Paper (POS Rolls)</option>
                        <option value="A4 Paper Reams">A4 Paper Reams</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <input type="number" min="1" className="w-20 border p-1 rounded" value={editForm.quantity} onChange={e => setEditForm({ ...editForm, quantity: Number(e.target.value) })} />
                    </td>
                    <td className="p-4 text-sm text-slate-500">Editing...</td>
                    <td className="p-4 text-right flex justify-end space-x-2">
                      <button onClick={() => handleEditSubmit(order._id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X size={18} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">{order.product}</td>
                    <td className="p-4">{order.quantity}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        {order.status === 'Pending' && (
                          <>
                            <button onClick={() => startEdit(order)} className="text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(order._id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                            <button onClick={() => triggerManufacturing(order._id)} className="text-purple-600 hover:text-purple-800 font-medium flex items-center ml-2 border-l border-slate-200 pl-3">
                              Trigger Mfg <ArrowRight size={16} className="ml-1" />
                            </button>
                          </>
                        )}
                        {order.status !== 'Pending' && (
                          <button onClick={() => handleDelete(order._id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No orders found. Push a lead from CRM to create one!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
