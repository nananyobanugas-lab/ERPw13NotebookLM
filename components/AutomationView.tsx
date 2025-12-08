import React, { useState, useRef } from 'react';
import { FileText, Upload, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { extractInvoiceData } from '../services/geminiService';
import { ProcessingStatus, ExtractedInvoice } from '../types';

const AutomationView: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [data, setData] = useState<ExtractedInvoice | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setStatus(ProcessingStatus.IDLE);
        setData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!imagePreview) return;
    setStatus(ProcessingStatus.PROCESSING);
    
    // Strip base64 prefix for API
    const base64Data = imagePreview.split(',')[1];
    
    try {
      const jsonStr = await extractInvoiceData(base64Data, mimeType);
      if (jsonStr) {
        // Handle potential markdown code block wrapping
        const cleanedStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
        setData(JSON.parse(cleanedStr));
        setStatus(ProcessingStatus.SUCCESS);
      }
    } catch (e) {
      console.error(e);
      setStatus(ProcessingStatus.ERROR);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
       <header>
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <FileText className="w-8 h-8 text-teal-600" />
          Intelligent Process Automation (RPA)
        </h2>
        <p className="text-slate-500 mt-2">
          Upload unstructured invoices (PDF/Image) to auto-post to General Ledger.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload & Preview */}
        <div className="space-y-6">
          <div 
            className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer min-h-[300px]"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Invoice" className="max-h-[400px] object-contain shadow-lg rounded" />
            ) : (
              <>
                <div className="bg-teal-50 p-4 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-700">Upload High-Cost Pharmaceutical Invoice</h3>
                <p className="text-sm text-slate-400 mt-1">Supports PNG, JPEG, WEBP</p>
                <button className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                  Select File
                </button>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          {imagePreview && status !== ProcessingStatus.PROCESSING && status !== ProcessingStatus.SUCCESS && (
            <button 
              onClick={handleProcess}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              Analyze with Gemini Vision <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {status === ProcessingStatus.PROCESSING && (
            <div className="w-full bg-slate-100 text-slate-500 font-medium py-3 rounded-lg flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Extracting GL Data...
            </div>
          )}
        </div>

        {/* Results Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h3 className="font-bold text-lg text-slate-800 mb-6 border-b pb-2">Proposed GL Entry</h3>
            
            {data ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                   <div className="text-sm text-slate-500">Confidence Score</div>
                   <div className={`text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 ${data.confidenceScore > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {data.confidenceScore > 90 ? <CheckCircle className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3"/>}
                      {data.confidenceScore}%
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Vendor</label>
                    <div className="text-slate-900 font-medium">{data.vendorName}</div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Invoice ID</label>
                    <div className="text-slate-900 font-medium">{data.invoiceId}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Total Amount</span>
                    <span className="font-bold text-slate-900">{data.currency} {data.totalAmount.toLocaleString()}</span>
                  </div>
                   <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Tax</span>
                    <span className="text-sm text-slate-900">{data.currency} {data.taxAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">DR</div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">Debit Account</div>
                      <div className="text-indigo-700 font-mono text-sm">{data.glDebitAccount}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">CR</div>
                    <div className="flex-1">
                      <div className="text-xs text-slate-500">Credit Account</div>
                      <div className="text-slate-700 font-mono text-sm">{data.glCreditAccount}</div>
                    </div>
                  </div>
                </div>

                {data.requiresReview && (
                   <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700 flex items-start gap-2">
                     <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                     <span>Low confidence detected. Manual approval required by Senior Accountant before posting.</span>
                   </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700">
                    Post to GL
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                <p className="text-sm">No data extracted yet.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AutomationView;