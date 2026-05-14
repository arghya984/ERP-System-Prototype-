import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, ShoppingCart, Wrench, Package } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'CRM (Leads)', path: '/crm', icon: Users },
    { name: 'Sales (Orders)', path: '/sales', icon: ShoppingCart },
    { name: 'Manufacturing', path: '/manufacturing', icon: Wrench },
    { name: 'Warehouse', path: '/warehouse', icon: Package },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-blue-400">Meetel ERP</h1>
        <p className="text-xs text-slate-400 mt-1">Coated Paper Co.</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
