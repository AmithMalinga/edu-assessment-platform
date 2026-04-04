import React from 'react';
import Layout from '../components/layout/Layout';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, BookOpen, AlertCircle, TrendingUp, ArrowUpRight, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats, loading, error } = useDashboardStats();

  const statCards = [
    { 
      label: 'Total Students', 
      value: stats.students, 
      icon: Users, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-500/10',
      trend: '+12.5%'
    },
    { 
      label: 'Grade Levels', 
      value: stats.grades, 
      icon: LayoutGrid, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      trend: 'All active'
    },
    { 
      label: 'Subjects', 
      value: stats.subjects, 
      icon: BookOpen, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10',
      trend: '4 new'
    },
    { 
      label: 'Question Bank', 
      value: stats.questions, 
      icon: AlertCircle, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10',
      trend: '+85 today'
    }
  ];

  if (error) {
    return (
      <Layout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-96 glass-card border-red-500/20">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card group cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                {loading ? (
                  <div className="h-9 w-20 bg-white/5 animate-pulse rounded-lg" />
                ) : stat.value}
              </h3>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Updated just now</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Platform Performance</h3>
            <select className="bg-slate-800 border-none rounded-lg text-xs text-slate-300 px-3 py-2 outline-none ring-1 ring-white/10">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-slate-500 italic">Analytical charts will be integrated here</p>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Student', color: 'bg-indigo-500' },
              { label: 'Create Assignment', color: 'bg-emerald-500' },
              { label: 'Review Questions', color: 'bg-amber-500' },
              { label: 'System Settings', color: 'bg-slate-700' },
            ].map((action) => (
              <button 
                key={action.label}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200 text-slate-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${action.color}`} />
                  <span className="font-medium text-sm">{action.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
