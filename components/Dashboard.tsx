import React from 'react';
import { Users, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ElementType; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend} vs last month
      </p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Hospital Command Center</h2>
        <p className="text-slate-500 mt-1">Real-time financial and clinical operational metrics.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue (YTD)" 
          value="$12.4M" 
          trend="+8.2%" 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Pending Claims" 
          value="142" 
          trend="-2.4%" 
          icon={FileTextIcon} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Bed Occupancy" 
          value="87%" 
          trend="+12%" 
          icon={Users} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Critical Alerts" 
          value="3" 
          trend="+1" 
          icon={AlertCircle} 
          color="bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700">Revenue Trend (Daily)</h3>
            <select className="text-sm border-slate-300 rounded-md text-slate-600 bg-slate-50 px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#0d9488" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Feed */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" /> AI Insights
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-teal-500">
              <p className="text-xs text-slate-400 mb-1">10 mins ago • Inventory Bot</p>
              <p className="text-sm">Detected potential shortage in <strong>IV Catheters</strong> based on admission surge in ER.</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-yellow-500">
              <p className="text-xs text-slate-400 mb-1">1 hr ago • Compliance Bot</p>
              <p className="text-sm">Invoice #9921 marked for review: Vendor Tax ID mismatch.</p>
            </div>
             <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-blue-500">
              <p className="text-xs text-slate-400 mb-1">2 hrs ago • Claims Bot</p>
              <p className="text-sm">Batch #2024-A processed. 98% auto-approval rate achieved.</p>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-teal-600 hover:bg-teal-700 rounded text-sm font-medium transition-colors">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const FileTextIcon: React.FC<any> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

export default Dashboard;