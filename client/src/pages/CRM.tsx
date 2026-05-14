import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowRight } from 'lucide-react';

const CRM = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const fetchLeads = async () => {
    const res = await axios.get('http://localhost:5000/api/leads');
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/leads', { name, company, email });
    setName(''); setCompany(''); setEmail('');
    fetchLeads();
  };

  const pushToSales = (lead: any) => {
    navigate('/sales', { state: { lead } });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">CRM - Leads</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><PlusCircle className="mr-2" size={20}/> Create New Lead</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
            <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Company</label>
            <input type="text" required value={company} onChange={e=>setCompany(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 transition-colors h-[42px]">
            Add Lead
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Name</th>
              <th className="p-4 font-semibold text-slate-600">Company</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.company}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Converted' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {lead.status !== 'Converted' && (
                    <button onClick={() => pushToSales(lead)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end w-full">
                      Push to Sales <ArrowRight size={16} className="ml-1" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No leads found. Create one above!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRM;
