import React from 'react';
import { RefreshCw, Clock, Calendar, LayoutDashboard } from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

interface HeaderProps {
  lastUpdated: Date;
  onRefresh: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated, onRefresh, loading }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b-4 border-blue-600 px-8 py-6 shadow-xl w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-3xl shadow-lg shadow-blue-200 text-white transform hover:rotate-6 transition-transform">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
              AmoCRM <span className="text-red-600">Таҳлилий</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-sm font-bold text-blue-700">
                <Calendar size={16} />
                <span>{format(new Date(), 'd MMMM yyyy', { locale: uz })}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">
              <Clock size={14} />
              <span>Янгиланиш вақти</span>
            </div>
            <span className="text-2xl font-black text-blue-600">{format(lastUpdated, 'HH:mm:ss')}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="group relative flex items-center gap-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white px-10 py-5 rounded-[2rem] transition-all font-black shadow-2xl shadow-red-200 active:scale-95 overflow-hidden"
          >
            <div className={`transition-transform duration-700 ${loading ? "animate-spin" : "group-hover:rotate-180"}`}>
              <RefreshCw size={24} />
            </div>
            <span className="text-lg uppercase tracking-wider">Янгилаш</span>
            {loading && (
              <div className="absolute inset-0 bg-red-600/50 flex items-center justify-center">
                <RefreshCw size={24} className="animate-spin" />
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
