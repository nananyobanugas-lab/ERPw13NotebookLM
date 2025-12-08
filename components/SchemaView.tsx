import React, { useState } from 'react';
import { Database, ArrowRight, Code, Server, ShieldAlert } from 'lucide-react';
import { generateSchemaDesign } from '../services/geminiService';
import { ProcessingStatus } from '../types';

const SchemaView: React.FC = () => {
  const [context, setContext] = useState("Standard procedure costs for Cardiology Department with complex insurance co-pay rules.");
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setStatus(ProcessingStatus.PROCESSING);
    try {
      const jsonStr = await generateSchemaDesign(context);
      if (jsonStr) {
        setResult(JSON.parse(jsonStr));
        setStatus(ProcessingStatus.SUCCESS);
      }
    } catch (e) {
      console.error(e);
      setStatus(ProcessingStatus.ERROR);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Database className="w-8 h-8 text-teal-600" />
          Microservice Architect
        </h2>
        <p className="text-slate-500 mt-2">
          Design robust data schemas and API definitions for hospital services using Generative AI.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Business Context & Requirements
            </label>
            <textarea
              className="w-full h-48 p-4 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the module requirements..."
            />
            <button
              onClick={handleGenerate}
              disabled={status === ProcessingStatus.PROCESSING}
              className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {status === ProcessingStatus.PROCESSING ? (
                <span>Generating Schema...</span>
              ) : (
                <>
                  Generate Specs <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-sm text-blue-800">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Server className="w-4 h-4" /> Best Practices
            </h4>
            <ul className="space-y-2 list-disc list-inside opacity-90">
              <li>Include ICD-10/CPT code mappings.</li>
              <li>Specify GL posting triggers.</li>
              <li>Define audit trail requirements.</li>
            </ul>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          {status === ProcessingStatus.SUCCESS && result ? (
            <>
              {/* ERD / Relationships */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <Code className="w-4 h-4 text-teal-600" /> Generated Data Structure
                  </h3>
                  <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">JSON</span>
                </div>
                <div className="p-6 bg-slate-900 overflow-x-auto">
                  <pre className="text-xs font-mono text-green-400 leading-relaxed">
                    {JSON.stringify(result.erd_structure, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Endpoints */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-500" /> Proposed API Endpoints
                  </h4>
                  <ul className="space-y-3">
                    {result.api_endpoints?.map((ep: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="font-mono text-xs font-bold text-indigo-600">POST</span>
                        {ep}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fraud Detection */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" /> Fraud Risk Factors
                  </h4>
                  <p className="text-sm text-slate-500 mb-3">
                    The AI suggests monitoring these fields for anomalies:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.fraud_detection_fields?.map((field: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl min-h-[400px]">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p>Enter context and generate architecture specs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemaView;