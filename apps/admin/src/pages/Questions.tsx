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
  Clock, FileText, PieChart, Info, ArrowUpRight, Database,
  ChevronLeft, ChevronRight, CheckSquare, Square, List, Grid,
  ArrowUpDown, MoreVertical
} from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';
import CustomSelect from '../components/common/CustomSelect';

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { questions, loading: questionsLoading, error: questionsError, deleteQuestion } = useQuestions();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { grades, loading: gradesLoading } = useGrades();
  
  // UI States
  const [error, setError] = useState('');
  const [isCompactView, setIsCompactView] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'content'>('newest');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Modals
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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

  // Derived filtered & sorted questions
  const processedQuestions = useMemo(() => {
    const qList = [...(Array.isArray(questions) ? questions : [])];
    
    // Filtering
    let results = qList.filter(q => {
      const content = q?.content || '';
      const lesson = q?.lesson || '';
      
      const matchesSearch = content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           lesson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade ? q?.subject?.gradeId === Number.parseInt(selectedGrade, 10) : true;
      const matchesSubject = selectedSubject ? q?.subjectId === selectedSubject : true;
      const matchesType = selectedType ? q?.type === selectedType : true;
      
      return matchesSearch && matchesGrade && matchesSubject && matchesType;
    });

    // Sorting
    results.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'content') return a.content.localeCompare(b.content);
      return 0;
    });

    return results;
  }, [questions, searchQuery, selectedGrade, selectedSubject, selectedType, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(processedQuestions.length / itemsPerPage);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedQuestions.slice(start, start + itemsPerPage);
  }, [processedQuestions, currentPage, itemsPerPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedQuestions.map(q => q.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

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

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    setError('');
    try {
      // Deleting in parallel
      await Promise.all(selectedIds.map(id => deleteQuestion(id)));
      setSelectedIds([]);
      setIsBulkDeleting(false);
    } catch (err: any) {
      setError('Bulk delete partially failed. Some questions may remain.');
      setIsBulkDeleting(false);
    }
  };

  const loading = questionsLoading || subjectsLoading || gradesLoading;

  const renderQuestionsList = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="glass-card h-24 animate-pulse bg-white/5 border-white/5" />
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

    if (processedQuestions.length === 0) {
      return (
        <div className="py-20 text-center glass-card border-dashed border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Search size={32} className="text-slate-600" />
          </div>
          <p className="text-white font-medium mb-1">No matches found</p>
          <p className="text-slate-500 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      );
    }

    return (
      <div className={isCompactView ? "space-y-2" : "space-y-4"}>
        {paginatedQuestions.map((q, idx) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`glass-card group hover:border-indigo-500/30 transition-all flex items-center gap-4 relative overflow-hidden ${isCompactView ? "py-3 px-4" : "p-6"}`}
          >
            <button 
              onClick={() => toggleSelect(q.id)}
              className={`p-1 rounded-md transition-all ${selectedIds.includes(q.id) ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-600 hover:text-slate-400'}`}
            >
              <CheckSquare size={16} />
            </button>

            <div className="flex-1 min-w-0">
               {!isCompactView && (
                 <div className="flex flex-wrap items-center gap-2 mb-3">
                   <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                     q.type === 'MCQ' ? 'bg-indigo-500/15 text-indigo-400' : 
                     q.type === 'STRUCTURED' ? 'bg-emerald-500/15 text-emerald-400' : 
                     'bg-amber-500/15 text-amber-400'
                   }`}>
                     {q.type}
                   </span>
                   <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-bold uppercase">
                     {q.lesson}
                   </span>
                 </div>
               )}
               
               <div className="flex items-center gap-2">
                 {isCompactView && (
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      q.type === 'MCQ' ? 'bg-indigo-400' : 
                      q.type === 'STRUCTURED' ? 'bg-emerald-400' : 
                      'bg-amber-400'
                    }`} />
                 )}
                 <h4 className={`text-white font-medium truncate group-hover:text-indigo-200 transition-all ${isCompactView ? "text-sm" : "text-lg leading-relaxed"}`}>
                   {q.content}
                 </h4>
               </div>

               {!isCompactView && q.type === 'MCQ' && (
                  <div className="flex gap-4 mt-3 overflow-x-auto pb-1 no-scrollbar">
                      {q.choices.map((choice: string, i: number) => (
                          <div key={i} className={`shrink-0 px-3 py-1 rounded-lg text-[10px] border ${choice === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                              {choice}
                          </div>
                      ))}
                  </div>
               )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
               {!isCompactView && (
                 <div className="text-right hidden sm:block mr-2 border-r border-white/5 pr-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{q.subject?.grade?.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-[80px]">{q.subject?.name}</p>
                 </div>
               )}
               <button 
                 onClick={() => navigate(`/questions/edit/${q.id}`)}
                 className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all active:scale-95"
                 title="Edit Question"
               >
                 <Edit2 size={16} />
               </button>
               <button 
                 onClick={() => setConfirmDeleteId(q.id)}
                 className="p-2.5 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all active:scale-95"
                 title="Delete Question"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
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
            className="glass-card p-4 flex items-center gap-4 border border-white/5"
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
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">Repository Management</h2>
          <p className="text-slate-500 text-sm">Advanced tools for assessment content oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCompactView(!isCompactView)}
            className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/5"
            title={isCompactView ? "Grid View" : "List View"}
          >
            {isCompactView ? <Grid size={20} /> : <List size={20} />}
          </button>
          <button 
            onClick={() => navigate('/questions/add')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Filter & Action Tool Bar */}
      <div className="glass-card mb-6 !p-4 border border-white/5 relative z-50 overflow-visible">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="text"
              placeholder="Filter by question content or module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CustomSelect
              value={selectedGrade}
              onChange={setSelectedGrade}
              options={[
                { value: '', label: 'All Grades' },
                ...grades.map(g => ({ value: g.id, label: g.name }))
              ]}
              className="w-40"
            />
            <CustomSelect
              value={selectedType}
              onChange={setSelectedType}
              options={[
                { value: '', label: 'All Types' },
                { value: 'MCQ', label: 'MCQ' },
                { value: 'STRUCTURED', label: 'Structured' },
                { value: 'ESSAY', label: 'Essay' }
              ]}
              className="w-40"
            />
            <div className="h-8 w-[1px] bg-white/5 mx-1 hidden sm:block" />
            <CustomSelect
              value={sortBy}
              onChange={(val) => setSortBy(val as any)}
              options={[
                { value: 'newest', label: 'Latest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'content', label: 'Alpha A-Z' }
              ]}
              className="w-40"
            />
          </div>
        </div>

        {/* Bulk Selection Action Bar */}
        <AnimatePresence>
            {(selectedIds.length > 0 || paginatedQuestions.length > 0) && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-all"
                        >
                            {selectedIds.length === paginatedQuestions.length ? <CheckSquare className="text-indigo-400" size={16} /> : <Square size={16} />}
                            <span>Select Page ({paginatedQuestions.length})</span>
                        </button>
                        {selectedIds.length > 0 && (
                            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                {selectedIds.length} Selected
                            </span>
                        )}
                    </div>
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={() => setIsBulkDeleting(true)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                            <Trash2 size={14} />
                            <span>Bulk Delete</span>
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="space-y-4 min-h-[400px]">
        {renderQuestionsList()}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between glass-card !p-4 border border-white/5">
            <p className="text-xs text-slate-500 font-bold">
                Showing {Math.min(processedQuestions.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(processedQuestions.length, currentPage * itemsPerPage)} of {processedQuestions.length}
            </p>
            <div className="flex items-center gap-2">
                <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-500'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Question?"
        message="This will permanently delete the question from the bank. This action cannot be undone."
        confirmText="Delete Question"
      />

      <ConfirmModal
        isOpen={isBulkDeleting}
        onClose={() => setIsBulkDeleting(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.length} Questions?`}
        message="Are you sure you want to delete all selected questions? This action is permanent."
        confirmText="Bulk Delete"
      />
    </Layout>
  );
};

export default Questions;
