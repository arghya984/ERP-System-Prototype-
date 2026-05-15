import { useState, useEffect, Fragment } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowRight, Trash2, Edit2, Check, X, Search, ChevronDown, ChevronUp, History } from 'lucide-react';

const CRM = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', company: '', email: '' });

  const navigate = useNavigate();

  const fetchData = async () => {
    const [leadsRes, ordersRes] = await Promise.all([
      api.get('/api/leads'),
      api.get('/api/orders')
    ]);
    setLeads(leadsRes.data);
    setAllOrders(ordersRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/api/leads', { name, company, email });
    setName(''); setCompany(''); setEmail('');
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await api.delete(`/api/leads/${id}`);
      fetchData();
    }
  };

  const startEdit = (lead: any) => {
    setEditingId(lead._id);
    setEditForm({ name: lead.name, company: lead.company, email: lead.email });
  };

  const handleEditSubmit = async (id: string) => {
    await api.put(`/api/leads/${id}`, editForm);
    setEditingId(null);
    fetchData();
  };

  const pushToSales = (lead: any) => {
    navigate('/sales', { state: { lead } });
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, company or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><PlusCircle className="mr-2" size={20} /> Create New Lead</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Company</label>
            <input type="text" required value={company} onChange={e => setCompany(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors h-[42px]">
            Add Lead
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600 w-1/4">Name</th>
              <th className="p-4 font-semibold text-slate-600 w-1/4">Company</th>
              <th className="p-4 font-semibold text-slate-600 w-1/6">Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <Fragment key={lead._id}>
                <tr className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${expandedRow === lead._id ? 'bg-slate-50' : ''}`}>
                  {editingId === lead._id ? (
                    <>
                      <td className="p-4"><input className="w-full border p-1 rounded" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                      <td className="p-4"><input className="w-full border p-1 rounded" value={editForm.company} onChange={e => setEditForm({ ...editForm, company: e.target.value })} /></td>
                      <td className="p-4 text-sm text-slate-500">Editing...</td>
                      <td className="p-4 text-right flex justify-end space-x-2">
                        <button onClick={() => handleEditSubmit(lead._id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                        <button onClick={() => setEditingId(null)} className="text-red-600 hover:bg-red-50 p-1 rounded"><X size={18} /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">{lead.name}</td>
                      <td className="p-4">{lead.company}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'Converted' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => startEdit(lead)} className="text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(lead._id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>

                          <button onClick={() => pushToSales(lead)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center border-l border-slate-200 pl-2 ml-1">
                            {lead.status === 'Converted' ? 'New Order' : 'Push'} <ArrowRight size={16} className="ml-1" />
                          </button>

                          <button
                            onClick={() => setExpandedRow(expandedRow === lead._id ? null : lead._id)}
                            className={`p-1 rounded-full ml-2 transition-colors ${expandedRow === lead._id ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                            title="View Order History"
                          >
                            {expandedRow === lead._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
                {expandedRow === lead._id && (
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <td colSpan={4} className="p-4">
                      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm ml-8 relative before:absolute before:left-[-16px] before:top-[-16px] before:bottom-6 before:w-4 before:border-l-2 before:border-b-2 before:border-slate-300 before:rounded-bl-lg">
                        <h4 className="font-semibold text-slate-700 mb-3 flex items-center"><History size={16} className="mr-2 text-blue-500" /> Order History</h4>
                        {allOrders.filter(o => o.leadId?._id === lead._id || o.leadId === lead._id).length > 0 ? (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-slate-500 border-b border-slate-100">
                                <th className="pb-2 font-medium">Order ID</th>
                                <th className="pb-2 font-medium">Product</th>
                                <th className="pb-2 font-medium">Qty</th>
                                <th className="pb-2 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allOrders.filter(o => o.leadId?._id === lead._id || o.leadId === lead._id).map(order => (
                                <tr key={order._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                  <td className="py-2 text-slate-400 font-mono text-xs">{order._id.substring(order._id.length - 6)}</td>
                                  <td className="py-2 font-medium text-slate-700">{order.product}</td>
                                  <td className="py-2">{order.quantity}</td>
                                  <td className="py-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                      }`}>
                                      {order.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded text-center">No previous orders found for this customer.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filteredLeads.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">
                {searchQuery ? 'No leads match your search.' : 'No leads found. Create one above!'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRM;
