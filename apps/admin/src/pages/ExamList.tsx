import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, Search, Plus, 
  Clock, Users, BookOpen, ChevronRight,
  Filter, Trash2, Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useExams } from '../hooks/useExams';
import { ExamSummary } from '../services/admin.service';

const ExamList: React.FC = () => {
  const { exams, loading } = useExams();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredExams = exams.filter((exam: ExamSummary) => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Exams', value: exams.length, icon: ClipboardList, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Total Questions', value: exams.reduce((acc: number, e: ExamSummary) => acc + e._count.examQuestions, 0), icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Combined Attempts', value: exams.reduce((acc: number, e: ExamSummary) => acc + e._count.attempts, 0), icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <Layout title="Exam Management">
      <div className="space-y-8">
        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{loading ? '...' : stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-2xl hover:bg-white/10 transition-all font-semibold">
              <Filter size={18} />
              Filter
            </button>
            <button 
              onClick={() => navigate('/exams')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-all font-bold shadow-lg shadow-indigo-600/20"
            >
              <Plus size={20} />
              Create New
            </button>
          </div>
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 glass-card animate-pulse" />
              ))
            ) : filteredExams.length > 0 ? (
              filteredExams.map((exam: ExamSummary) => (
                <motion.div
                  key={exam.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card group hover:border-indigo-500/50 transition-all duration-300 cursor-default"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <ClipboardList size={20} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {exam.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock size={14} className="text-slate-500" />
                      <span>{exam.duration} Minutes Duration</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <BookOpen size={14} className="text-slate-500" />
                      <span>{exam._count.examQuestions} Questions Total</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Users size={14} className="text-slate-500" />
                      <span>{exam._count.attempts} Total Attempts</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                      Created {new Date(exam.createdAt).toLocaleDateString()}
                    </div>
                    <button className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                      View Details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList size={32} className="text-slate-600" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">No exams found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  {searchQuery ? `We couldn't find any exams matching "${searchQuery}"` : "You haven't created any exams yet. Get started by building your first one!"}
                </p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-bold"
                  >
                    Clear Search Query
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default ExamList;
