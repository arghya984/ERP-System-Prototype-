import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const Sales = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [product, setProduct] = useState('Thermal Jumbo Rolls');
  const [quantity, setQuantity] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();
  const initialLead = location.state?.lead;

  const fetchOrders = async () => {
    const res = await axios.get('http://localhost:5000/api/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialLead) return alert('Please select a lead from CRM first!');
    
    await axios.post('http://localhost:5000/api/orders', {
      leadId: initialLead._id,
      product,
      quantity
    });
    
    // Clear state after creation
    navigate('/sales', { replace: true });
    fetchOrders();
  };

  const triggerManufacturing = async (orderId: string) => {
    await axios.post('http://localhost:5000/api/manufacturing', { orderId });
    fetchOrders();
    navigate('/manufacturing');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Sales - Orders</h2>

      {initialLead && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <ShoppingCart className="mr-2" size={20}/> Create Order for {initialLead.name} ({initialLead.company})
          </h3>
          <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Product</label>
              <select value={product} onChange={e=>setProduct(e.target.value)} className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Thermal Jumbo Rolls">Thermal Jumbo Rolls</option>
                <option value="A4 Paper Reams">A4 Paper Reams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Quantity</label>
              <input type="number" min="1" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors h-[42px]">
              Confirm Order
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
                <td className="p-4">{order.product}</td>
                <td className="p-4">{order.quantity}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {order.status === 'Pending' && (
                    <button onClick={() => triggerManufacturing(order._id)} className="text-purple-600 hover:text-purple-800 font-medium flex items-center justify-end w-full">
                      Trigger Mfg <ArrowRight size={16} className="ml-1" />
                    </button>
                  )}
                </td>
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
