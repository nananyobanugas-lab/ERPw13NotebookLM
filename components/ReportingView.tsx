import React, { useState } from 'react';
import { TrendingUp, FileText, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { generateStrategicMemo } from '../services/geminiService';
import { ProcessingStatus } from '../types';
import ReactMarkdown from 'react-markdown'; // Assuming react-markdown is allowed or we just render plain text. Actually prompt says "Generate React web app using popular libraries". I'll use a simple parser or just whitespace-pre-wrap if library not strictly available. I will stick to pre-wrap for simplicity and robustness in this format.

// Mock Data for "Scenario Planning"
const inventoryData = [
  { name: 'Jan', stock: 4000, demand: 2400 },
  { name: 'Feb', stock: 3500, demand: 2800 },
  { name: 'Mar', stock: 2000, demand: 3200 }, // Critical dip
  { name: 'Apr', stock: 1200, demand: 3800 }, // Stockout risk
  { name: 'May', stock: 500, demand: 4100 },
];

const processEfficiencyData = [
  { process: 'Admission', time: 15 },
  { process: 'Surgery Prep', time: 45 },
  { process: 'Billing Finalization', time: 120 }, // Inefficient
  { process: 'Discharge', time: 30 },
];

const ReportingView: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [memo, setMemo] = useState<string>("");

  const handleGenerateReport = async () => {
    setStatus(ProcessingStatus.PROCESSING);
    
    // Package data for AI
    const dataContext = JSON.stringify({
      inventory_forecast: inventoryData,
      process_mining_results: processEfficiencyData,
      current_OR_utilization: "85%",
      projected_OR_utilization_increase: "15%"
    });

    try {
      const result = await generateStrategicMemo(dataContext);
      if (result) {
        setMemo(result);
        setStatus(ProcessingStatus.SUCCESS);
      }
    } catch (e) {
      console.error(e);
      setStatus(ProcessingStatus.ERROR);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-teal-600" />
            Strategic Intelligence & Forecasting
          </h2>
          <p className="text-slate-500 mt-2">
            Predictive modeling and scenario planning for Hospital Executives.
          </p>
        </div>
        <button 
          onClick={handleGenerateReport}
          disabled={status === ProcessingStatus.PROCESSING}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {status === ProcessingStatus.PROCESSING ? (
            'Analyzing Data...'
          ) : (
            <>
              <Activity className="w-5 h-5" /> Generate CFO Memo
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts Section */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-4">Projected Inventory Levels (High-Cost Consumables)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="stock" stroke="#0d9488" strokeWidth={3} dot={{r: 4}} name="Current Stock" />
                  <Line type="monotone" dataKey="demand" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Projected Demand" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-700 mb-4">Process Efficiency Mining (Avg Minutes)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processEfficiencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="process" type="category" width={120} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="time" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} name="Avg Time (Mins)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Memo Section */}
        <div className="h-full">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <FileText className="w-5 h-5 text-slate-500" />
                 <span className="font-semibold text-slate-700">Executive Summary</span>
               </div>
               <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Confidential</span>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto max-h-[600px] bg-white rounded-b-xl">
              {status === ProcessingStatus.SUCCESS && memo ? (
                <div className="prose prose-slate prose-sm max-w-none">
                  <div className="whitespace-pre-wrap font-serif leading-relaxed text-slate-800">
                    {memo}
                  </div>
                </div>
              ) : status === ProcessingStatus.PROCESSING ? (
                 <div className="h-full flex flex-col items-center justify-center space-y-4">
                   <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                   <p className="text-slate-500 animate-pulse">Synthesizing strategic insights...</p>
                 </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                   <FileText className="w-16 h-16 mb-4" />
                   <p>Click "Generate CFO Memo" to analyze current data.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingView;