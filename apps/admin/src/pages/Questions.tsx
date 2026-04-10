import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useQuestions } from '../hooks/useQuestions';
import { useSubjects } from '../hooks/useSubjects';
import { useGrades } from '../hooks/useGrades';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, AlertCircle, CheckCircle2, X, 
  HelpCircle, Layers, BookOpen, Search, Filter, 
  Clock, FileText, PieChart, Info, ArrowUpRight, Database
} from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { questions, loading: questionsLoading, error: questionsError, deleteQuestion } = useQuestions();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { grades, loading: gradesLoading } = useGrades();
  const [error, setError] = useState('');
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // New Confirm Modal State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Derived Stats
  const stats = useMemo(() => {
    const qList = Array.isArray(questions) ? questions : [];
    return {
      total: qList.length,
      mcq: qList.filter(q => q?.type === 'MCQ').length,
      structured: qList.filter(q => q?.type === 'STRUCTURED').length,
      essay: qList.filter(q => q?.type === 'ESSAY').length,
    };
  }, [questions]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    const qList = Array.isArray(questions) ? questions : [];
    return qList.filter(q => {
      const content = q?.content || '';
      const lesson = q?.lesson || '';
      
      const matchesSearch = content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           lesson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade ? q?.subject?.gradeId === Number.parseInt(selectedGrade, 10) : true;
      const matchesSubject = selectedSubject ? q?.subjectId === selectedSubject : true;
      const matchesType = selectedType ? q?.type === selectedType : true;
      
      return matchesSearch && matchesGrade && matchesSubject && matchesType;
    });
  }, [questions, searchQuery, selectedGrade, selectedSubject, selectedType]);

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setError('');
    try {
      await deleteQuestion(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete question');
      setConfirmDeleteId(null);
    }
  };

  const loading = questionsLoading || subjectsLoading || gradesLoading;

  const renderQuestionsList = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="glass-card h-32 animate-pulse bg-white/5 border-white/5" />
      ));
    }

    if (questionsError) {
      return (
        <div className="glass-card border-red-500/20 p-8 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <p className="text-white font-medium">{questionsError}</p>
        </div>
      );
    }

    if (filteredQuestions.length === 0) {
      return (
        <div className="py-20 text-center glass-card border-dashed border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Search size={32} className="text-slate-600" />
          </div>
          <p className="text-white font-medium mb-1">No matches found</p>
          <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
          {(searchQuery || selectedGrade || selectedSubject || selectedType) && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('');
                setSelectedSubject('');
                setSelectedType('');
              }}
              className="mt-4 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      );
    }

    return filteredQuestions.map((q, idx) => (
      <motion.div 
        key={q.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="glass-card group hover:border-indigo-500/30 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
              q.type === 'MCQ' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' : 
              q.type === 'STRUCTURED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 
              'bg-amber-500/15 text-amber-400 border border-amber-500/20'
            }`}>
              <div className={`w-1 h-1 rounded-full ${
                q.type === 'MCQ' ? 'bg-indigo-400' : 
                q.type === 'STRUCTURED' ? 'bg-emerald-400' : 
                'bg-amber-400'
              }`} />
              {q.type}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px] font-bold tracking-wider uppercase border border-white/5">
              {q.lesson}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-white/5">
              <BookOpen size={10} className="text-indigo-400" />
              {q.subject?.name || 'No Subject'}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-white/5">
              <Layers size={10} className="text-emerald-400" />
              {q.subject?.grade?.name || 'Unknown Grade'}
            </span>
          </div>
          
          <h4 className="text-lg text-white font-semibold leading-relaxed mb-4 group-hover:text-indigo-200 transition-colors">
            {q.content}
          </h4>

          {q.type === 'MCQ' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {q.choices.map((choice: string, i: number) => (
                <div 
                  key={`question-${q.id}-choice-${i}`} 
                  className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-3 border transition-all ${
                    choice === q.correctAnswer 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-white/5 border-white/5 text-slate-400 group-hover:border-white/10'
                  }`}
                >
                  {choice === q.correctAnswer ? (
                    <CheckCircle2 size={14} className="shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className="truncate">{choice}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex md:flex-col gap-2 shrink-0 relative z-10">
          <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5 hover:border-white/20 active:scale-95">
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => setConfirmDeleteId(q.id)}
            className="p-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all border border-red-500/10 hover:border-red-500/20 active:scale-95"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </motion.div>
    ));
  };

  return (
    <Layout title="Question Bank">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Bank', value: stats.total, icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'MCQ Type', value: stats.mcq, icon: PieChart, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Structured', value: stats.structured, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Essay/Long', value: stats.essay, icon: Info, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{stat.label}</div>
              <div className="text-xl font-bold text-white">{questionsLoading ? '...' : stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div className="flex-1 w-full xl:w-auto">
          <h2 className="text-2xl font-bold text-white mb-1">Explore Questions</h2>
          <p className="text-slate-400 text-sm">Organize and manage your specialized assessment repository.</p>
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <button 
            onClick={() => navigate('/questions/add')}
            className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Add New Question</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card mb-8 !p-4 flex flex-col md:flex-row gap-4 items-center border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search questions by content or lesson..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <select 
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          >
            <option value="">All Grades</option>
            {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          >
            <option value="">All Types</option>
            <option value="MCQ">MCQ</option>
            <option value="STRUCTURED">Structured</option>
            <option value="ESSAY">Essay</option>
          </select>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedGrade('');
              setSelectedSubject('');
              setSelectedType('');
            }}
            className="flex items-center justify-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all border border-white/5"
            title="Clear Filters"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-100 text-sm flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" /> 
            {error}
          </div>
          <button onClick={() => setError('')} className="p-1 hover:bg-white/5 rounded">
            <X size={16} />
          </button>
        </motion.div>
      )}

      <div className="space-y-4">
        {renderQuestionsList()}
      </div>

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Question?"
        message="This will permanently delete the question from the bank. This action cannot be undone."
        confirmText="Delete Question"
      />
    </Layout>
  );
};

export default Questions;
