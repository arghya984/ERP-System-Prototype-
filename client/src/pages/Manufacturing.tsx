import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle } from 'lucide-react';

const Manufacturing = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/manufacturing');
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const markComplete = async (id: string) => {
    await axios.patch(`http://localhost:5000/api/manufacturing/${id}`, { status: 'Completed' });
    fetchTasks();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Manufacturing Floor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                <Wrench size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>
            
            <h3 className="font-bold text-lg mb-1">Convert Jumbo Rolls to POS</h3>
            <p className="text-slate-500 text-sm mb-4">Order Ref: {task.orderId?._id.substring(task.orderId._id.length - 6)}</p>
            
            <div className="bg-slate-50 p-3 rounded-lg mb-6 border border-slate-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Product:</span>
                <span className="font-medium">{task.orderId?.product}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Target Qty:</span>
                <span className="font-medium">{task.orderId?.quantity}</span>
              </div>
            </div>

            <div className="mt-auto">
              {task.status !== 'Completed' ? (
                <button 
                  onClick={() => markComplete(task._id)} 
                  className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle size={18} className="mr-2" /> Mark as Completed
                </button>
              ) : (
                <div className="w-full bg-slate-100 text-slate-500 p-3 rounded-lg font-medium flex items-center justify-center text-sm border border-slate-200">
                  Production Finished
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
          <Wrench size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No active manufacturing tasks. Trigger one from Sales!</p>
        </div>
      )}
    </div>
  );
};

export default Manufacturing;
