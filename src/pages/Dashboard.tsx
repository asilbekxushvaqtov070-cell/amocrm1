import React from 'react';
import { motion } from 'motion/react';
import { useDashboardData } from '../hooks/useDashboardData';
import Header from '../components/Header';
import DonutChart from '../components/DonutChart';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { data, loading, error, lastUpdated, refetch } = useDashboardData();

  if (loading && !data) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <Loader2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg font-bold text-slate-600 animate-pulse uppercase tracking-wider">Юкланмоқда...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border-2 border-red-100 p-10 max-w-xl w-full text-center space-y-6 rounded-[2.5rem] shadow-xl">
          <AlertCircle size={60} className="text-red-500 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 uppercase">Хатолик юз berdi</h2>
          <p className="text-sm font-bold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">{error}</p>
          <button onClick={refetch} className="w-full py-4 bg-blue-600 text-white rounded-2xl text-lg font-black uppercase hover:bg-blue-700 transition-all shadow-lg">Қайта уриниш</button>
        </div>
      </div>
    );
  }

  const opNames = data?.operators?.map(o => o.name) || [];
  const opTotalAssigned = data?.operators?.map(o => o.totalAssignedCount) || [];
  const opTalked = data?.operators?.map(o => o.talkedCount) || [];
  const opTasks = data?.operators?.map(o => o.tasksCount) || [];
  const opSent = data?.operators?.map(o => o.sentToDealerCount) || [];

  const dealerNames = data?.cumulativeDealers?.map(d => d.name) || [];
  const dealerCounts = data?.cumulativeDealers?.map(d => d.count) || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 w-full overflow-x-hidden">
      <Header lastUpdated={lastUpdated} onRefresh={refetch} loading={loading} />

      <main className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-16">

        {/* OPERATORLAR SECTION */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Операторлар <span className="text-red-600">Фаоллиги</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <DonutChart title="Жами тушган лидлар" labels={opNames} series={opTotalAssigned} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <DonutChart title="Боғланилган лидлар" labels={opNames} series={opTalked} isRed />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <DonutChart title="Қўйилган вазифалар" labels={opNames} series={opTasks} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <DonutChart title="Диллерга юборилган" labels={opNames} series={opSent} isRed />
            </motion.div>
          </div>
        </div>

        {/* DILLERLAR SECTION */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-10 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)]"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Диллерлар <span className="text-blue-600">Статистикаси</span></h2>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <DonutChart title="Шу пайтгача юборилган жами лидлар" labels={dealerNames} series={dealerCounts} height={550} />
          </motion.div>
        </div>

      </main>

      <footer className="py-12 text-center border-t border-slate-200">
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">AmoCRM Intelligence • Professional Edition</p>
      </footer>
    </div>
  );
}
