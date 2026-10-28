import React, { useState } from 'react';
import { OwnerUser } from '../../types';
import { signInOwner, signUpOwner } from '../../services/restaurantService';
import { X, Lock, Mail, User, ArrowRight, UtensilsCrossed } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: OwnerUser) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      let user: OwnerUser;
      if (mode === 'signin') {
        user = await signInOwner(email);
      } else {
        user = await signUpOwner(name, email);
      }
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoName: string) => {
    setLoading(true);
    try {
      const user = await signInOwner(demoEmail);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b border-gray-200 bg-[#F5F5F5]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              mode === 'signin'
                ? 'border-[#E53935] text-[#202124] bg-white'
                : 'border-transparent text-gray-500 hover:text-[#202124]'
            }`}
          >
            Restaurant Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              mode === 'signup'
                ? 'border-[#E53935] text-[#202124] bg-white'
                : 'border-transparent text-gray-500 hover:text-[#202124]'
            }`}
          >
            Register Venue
          </button>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-[#202124] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Restaurateur / Chef Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Chef Marco Rossi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F5F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Restaurant Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="ciao@fornofuoco.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F5F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F5F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Session backed by Supabase Auth with RLS tenant safety
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In to ZESTO</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              ) : (
                <>
                  <span>Create ZESTO Account</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Demo Accounts */}
          <div className="pt-4 border-t border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono block mb-2.5">
              1-Click Demo Profiles
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('ciao@fornofuoco.com', 'Chef Marco Rossi')}
                className="w-full p-3 rounded-2xl border border-gray-200 hover:border-[#E53935] hover:bg-[#F5F5F5] text-left transition-all flex items-center justify-between text-xs cursor-pointer group bg-[#F5F5F5]/70"
              >
                <div>
                  <div className="font-editorial font-bold text-[#202124] group-hover:text-[#E53935] transition-colors">
                    Forno & Fuoco Trattoria
                  </div>
                  <div className="text-[11px] text-gray-500">Chef Marco Rossi · ciao@fornofuoco.com</div>
                </div>
                <span className="text-xs font-bold text-[#E53935]">Enter →</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('orders@cafemocha.io', 'Marie Laurent')}
                className="w-full p-3 rounded-2xl border border-gray-200 hover:border-[#202124] hover:bg-[#F5F5F5] text-left transition-all flex items-center justify-between text-xs cursor-pointer group bg-[#F5F5F5]/70"
              >
                <div>
                  <div className="font-editorial font-bold text-[#202124] group-hover:text-[#202124] transition-colors">
                    Café Mocha & Patisserie
                  </div>
                  <div className="text-[11px] text-gray-500">Marie Laurent · orders@cafemocha.io</div>
                </div>
                <span className="text-xs font-bold text-gray-600">Enter →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
