import React, { useState } from 'react';
import { getStoredSupabaseConfig, saveStoredSupabaseConfig, SUPABASE_SQL_SCHEMA } from '../../lib/supabase';
import { X, Database, CheckCircle2, Copy, Check, Server, Shield, RefreshCw } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig(url, anonKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onConfigSaved();
      onClose();
    }, 1000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetLocal = () => {
    if (confirm('Reset local database back to default seed restaurants and menus?')) {
      localStorage.removeItem('zesto_db_restaurants');
      localStorage.removeItem('zesto_db_categories');
      localStorage.removeItem('zesto_db_menu_items');
      localStorage.removeItem('zesto_db_orders');
      localStorage.removeItem('tavola_db_restaurants');
      localStorage.removeItem('tavola_db_categories');
      localStorage.removeItem('tavola_db_menu_items');
      localStorage.removeItem('tavola_db_orders');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#202124] text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-bold text-[#202124]">ZESTO Database & Backend Setup</h2>
              <p className="text-xs text-gray-500">Connect your Supabase PostgreSQL or run in turnkey local reactive mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-[#202124] rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto bg-white">
          {/* Active Mode Banner */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900">
                {currentConfig.isConfigured ? 'Connected to Supabase Project' : 'Turnkey Active Mode (Local Reactive Store)'}
              </span>
              <p className="text-emerald-800 mt-0.5 leading-relaxed">
                {currentConfig.isConfigured
                  ? 'Queries, real-time broadcasts, and auth flow directly through your configured Supabase database.'
                  : 'ZESTO is currently operating with high-fidelity local state persistence and simulated real-time order synchronization. You can test orders, menu updates, and kitchen status transitions instantly.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Supabase Project Credentials</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Project URL (<code className="text-[#E53935]">VITE_SUPABASE_URL</code>)
              </label>
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#F5F5F5] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Anon Public API Key (<code className="text-[#E53935]">VITE_SUPABASE_ANON_KEY</code>)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#F5F5F5] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetLocal}
                className="text-xs text-gray-500 hover:text-[#202124] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Seed Data</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                {savedSuccess ? 'Config Saved!' : 'Save & Connect'}
              </button>
            </div>
          </form>

          {/* SQL Schema Copy Section */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-700" />
                <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
                  PostgreSQL Tables & Row Level Security (RLS)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#202124] bg-[#F5F5F5] border border-gray-300 hover:bg-gray-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied SQL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                    <span>Copy Schema</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Run this script directly in the Supabase SQL Editor. It creates isolated multi-tenant tables for restaurants, categories, menu items, orders, and real-time event triggers with RLS security policies.
            </p>

            <div className="relative rounded-2xl bg-[#202124] text-gray-300 p-4 max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed select-all border border-gray-700">
              <pre>{SUPABASE_SQL_SCHEMA}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
