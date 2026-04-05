import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useQuestions } from '../hooks/useQuestions';
import { useSubjects } from '../hooks/useSubjects';
import { useGrades } from '../hooks/useGrades';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle2, X, HelpCircle, Layers, BookOpen } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';

const Questions: React.FC = () => {
  const { questions, loading: questionsLoading, error: questionsError, createQuestion, deleteQuestion } = useQuestions();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { grades, loading: gradesLoading } = useGrades();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Confirm Modal State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    content: '',
    type: 'MCQ',
    lesson: 'General',
    choices: ['', '', '', ''],
    correctAnswer: '',
    subjectId: '',
    gradeId: ''
  });

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (newQuestion.type === 'MCQ') {
        const validChoices = newQuestion.choices.filter(c => c.trim() !== '');
        if (validChoices.length < 2) throw new Error('At least 2 choices required');
        if (!newQuestion.correctAnswer) throw new Error('Please select a correct answer');
      }

      await createQuestion({
        ...newQuestion,
        gradeId: Number.parseInt(newQuestion.gradeId, 10),
        choices: newQuestion.type === 'MCQ' ? newQuestion.choices.filter(c => c.trim() !== '') : []
      });
      
      setIsModalOpen(false);
      setNewQuestion({
        content: '',
        type: 'MCQ',
        lesson: 'General',
        choices: ['', '', '', ''],
        correctAnswer: '',
        subjectId: '',
        gradeId: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteQuestion(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err) {
      alert('Failed to delete question');
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

    if (questions.length === 0) {
      return (
        <div className="py-20 text-center glass-card border-dashed border-white/10">
          <HelpCircle size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 font-medium italic">No questions found in the bank. Start building your repository.</p>
        </div>
      );
    }

    return questions.map((q) => (
      <motion.div 
        key={q.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card group hover:border-white/20 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
              q.type === 'MCQ' ? 'bg-indigo-500/20 text-indigo-400' : 
              q.type === 'STRUCTURED' ? 'bg-emerald-500/20 text-emerald-400' : 
              'bg-amber-500/20 text-amber-400'
            }`}>
              {q.type}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold tracking-wider uppercase">
              {q.lesson}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-white/5">
              <BookOpen size={10} />
              {q.subject?.name || 'No Subject'}
            </span>
          </div>
          <p className="text-lg text-white font-medium leading-relaxed mb-4">{q.content}</p>
          {q.type === 'MCQ' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {q.choices.map((choice: string, i: number) => (
                <div 
                  key={`question-${q.id}-choice-${i}`} 
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 border ${
                    choice === q.correctAnswer 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-white/5 border-white/5 text-slate-400'
                  }`}
                >
                  {choice === q.correctAnswer ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />}
                  {choice}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex md:flex-col gap-2 shrink-0">
          <button className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition-colors border border-white/5">
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => setConfirmDeleteId(q.id)}
            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-colors border border-red-500/10"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </motion.div>
    ));
  };

  return (
    <Layout title="Questions Bank">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-400 text-sm">Create and organize your repository of assessment questions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Question</span>
        </button>
      </div>

      <div className="space-y-4">
        {renderQuestionsList()}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Question?"
        message="This will permanently delete the question from the bank. This action cannot be undone."
        confirmText="Delete Question"
      />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl glass-card border-white/10 relative z-10 my-auto"
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <HelpCircle size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Add New Question</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="question-content" className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <HelpCircle size={14} /> Question Content
                  </label>
                  <textarea 
                    id="question-content"
                    value={newQuestion.content} 
                    onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                    placeholder="Enter the question here..." 
                    required
                    rows={4}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="question-type" className="text-sm font-medium text-slate-400">Question Type</label>
                    <select 
                      id="question-type"
                      value={newQuestion.type} 
                      onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="MCQ">Multiple Choice (MCQ)</option>
                      <option value="STRUCTURED">Structured Question</option>
                      <option value="ESSAY">Essay / Long Answer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="question-lesson" className="text-sm font-medium text-slate-400">Lesson / Category</label>
                    <input 
                      id="question-lesson"
                      type="text" 
                      value={newQuestion.lesson} 
                      onChange={(e) => setNewQuestion({...newQuestion, lesson: e.target.value})}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="e.g. Algebra I"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="question-grade" className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Layers size={14} /> Grade Level
                    </label>
                    <select 
                      id="question-grade"
                      value={newQuestion.gradeId} 
                      onChange={(e) => setNewQuestion({...newQuestion, gradeId: e.target.value, subjectId: ''})}
                      required
                      className="w-full px-4 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="">Select Grade</option>
                      {grades.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="question-subject" className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <BookOpen size={14} /> Subject
                    </label>
                    <select 
                      id="question-subject"
                      value={newQuestion.subjectId} 
                      onChange={(e) => setNewQuestion({...newQuestion, subjectId: e.target.value})}
                      required
                      disabled={!newQuestion.gradeId}
                      className="w-full px-4 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="">Select Subject</option>
                      {subjects.filter(s => s.gradeId === Number.parseInt(newQuestion.gradeId, 10)).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {newQuestion.type === 'MCQ' && (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-sm font-medium text-slate-400">Choices & Correct Answer</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {newQuestion.choices.map((choice, i) => (
                        <div key={`mcq-choice-input-${i}`} className="relative group">
                          <input 
                            type="text" 
                            value={choice} 
                            onChange={(e) => {
                              const newChoices = [...newQuestion.choices];
                              newChoices[i] = e.target.value;
                              setNewQuestion({...newQuestion, choices: newChoices});
                            }}
                            placeholder={`Option ${i+1}`}
                            className={`w-full pl-4 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                                newQuestion.correctAnswer === choice && choice !== '' 
                                ? 'border-emerald-500/50 ring-1 ring-emerald-500/30' 
                                : 'border-white/10 focus:ring-2 focus:ring-indigo-500/50'
                            }`}
                          />
                          <button 
                            type="button"
                            onClick={() => setNewQuestion({...newQuestion, correctAnswer: choice})}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                                newQuestion.correctAnswer === choice && choice !== '' 
                                ? 'bg-emerald-500 text-white' 
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 italic flex items-center gap-1">
                        <CheckCircle2 size={10} /> 
                        Click the checkmark icon to select the correct answer.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-100 text-sm flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0" /> 
                    {error}
                  </div>
                )}
                
                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : 'Save Question to Bank'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Questions;
