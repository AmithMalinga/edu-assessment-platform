import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle, CheckCircle2, ClipboardList, Loader2, 
  Search, Sparkles, ChevronRight, ChevronLeft,
  Settings, BookOpen, ListChecks, Info, Clock, 
  AlertTriangle, Save, GraduationCap, Layers, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useGrades } from '../hooks/useGrades';
import { useSubjects } from '../hooks/useSubjects';
import { useExams } from '../hooks/useExams';
import type {
  ExamQuestionType,
  ExamTypeCategory,
  RelevantQuestion,
} from '../services/admin.service';
import CustomSelect from '../components/common/CustomSelect';
import CustomDateTimePicker from '../components/common/CustomDateTimePicker';

const Exams: React.FC = () => {
  const navigate = useNavigate();
  const { grades, loading: gradesLoading } = useGrades();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const {
    getRelevantQuestions,
    createExam,
  } = useExams();

  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [gradeId, setGradeId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examQuestionType, setExamQuestionType] = useState<ExamQuestionType>('MCQ');
  const [examTypeCategory, setExamTypeCategory] = useState<ExamTypeCategory>('RANDOM_NEW');
  const [lesson, setLesson] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeAllocationMinutes, setTimeAllocationMinutes] = useState(60);
  const [passingScorePercent, setPassingScorePercent] = useState(60);
  const [rulesText, setRulesText] = useState('No cheating\nNo mobile phones\nRead each question carefully');
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [allowReviewBeforeSubmit, setAllowReviewBeforeSubmit] = useState(true);
  const [negativeMarkingPerWrongAnswer, setNegativeMarkingPerWrongAnswer] = useState(0);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  const [questions, setQuestions] = useState<RelevantQuestion[]>([]);
  const [selectedMarks, setSelectedMarks] = useState<Record<string, number>>({});

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittingExam, setSubmittingExam] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const filteredSubjects = useMemo(
    () => subjects.filter((subject) => subject.gradeId === Number.parseInt(gradeId, 10)),
    [subjects, gradeId],
  );

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (formError || successMessage) {
      const timer = setTimeout(() => {
        setFormError('');
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formError, successMessage]);

  const selectedCount = Object.keys(selectedMarks).length;
  const totalMarks = Object.values(selectedMarks).reduce((sum, marks) => sum + marks, 0);

  const toggleQuestion = (questionId: string) => {
    setSelectedMarks((prev) => {
      if (prev[questionId]) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return { ...prev, [questionId]: 1 };
    });
  };

  const updateQuestionMarks = (questionId: string, marks: number) => {
    setSelectedMarks((prev) => ({ ...prev, [questionId]: Math.max(1, marks) }));
  };

  const handleFindRelevantQuestions = async () => {
    setFormError('');
    if (!gradeId || !subjectId) {
      setFormError('Please complete Step 2 before loading questions.');
      return;
    }

    try {
      setLoadingQuestions(true);
      const response = await getRelevantQuestions({
        gradeId: Number.parseInt(gradeId, 10),
        subjectId,
        examQuestionType,
        examTypeCategory,
        lesson: lesson.trim() || undefined,
      });

      setQuestions(response.questions);
      setSelectedMarks({});
      if (response.totalQuestions === 0) {
        setFormError('No questions match these filters. Try adjusting your settings.');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to load questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleCreateExam = async () => {
    setFormError('');
    setSuccessMessage('');

    try {
      setSubmittingExam(true);

      // Date Validation
      const now = new Date();
      if (startsAt && new Date(startsAt) < now) {
        setFormError('Exam start date cannot be in the past.');
        setSubmittingExam(false);
        return;
      }
      if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
        setFormError('Exam end date must be after the start date.');
        setSubmittingExam(false);
        return;
      }

      const parsedRules = rulesText.split('\n').map(r => r.trim()).filter(Boolean);

      await createExam({
        gradeId: Number.parseInt(gradeId, 10),
        subjectId,
        examQuestionType,
        examTypeCategory,
        title: title.trim(),
        description: description.trim() || undefined,
        timeAllocationMinutes,
        passingScorePercent,
        rules: parsedRules,
        selectedQuestions: Object.entries(selectedMarks).map(([questionId, marks]) => ({
          questionId,
          marks,
        })),
        totalMarks,
        lesson: lesson.trim() || undefined,
        shuffleQuestions,
        allowReviewBeforeSubmit,
        negativeMarkingPerWrongAnswer,
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
      });

      setSuccessMessage('Exam created successfully! Redirecting...');
      setTimeout(() => navigate('/exams/list'), 2000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setSubmittingExam(false);
    }
  };

  const steps = [
    { name: 'Core Details', icon: Info, color: 'text-indigo-400' },
    { name: 'Exam Settings', icon: Settings, color: 'text-amber-400' },
    { name: 'Questions', icon: ListChecks, color: 'text-emerald-400' }
  ];

  return (
    <Layout title="Exam Builder">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Action Bar */}
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-6 px-4">
            {steps.map((step, idx) => (
              <div key={step.name} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  activeStep === idx 
                    ? `bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-500/20` 
                    : activeStep > idx ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'
                }`}>
                  {activeStep > idx ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
                </div>
                <div className="hidden md:block">
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${activeStep === idx ? 'text-indigo-400' : 'text-slate-500'}`}>Step 0{idx + 1}</p>
                  <p className={`text-sm font-bold ${activeStep === idx ? 'text-white' : 'text-slate-500'}`}>{step.name}</p>
                </div>
                {idx < steps.length - 1 && <ChevronRight size={16} className="text-slate-700 ml-2" />}
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/exams/list')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all font-bold group"
          >
            <ClipboardList size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
            View Existing Exams
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {(formError || successMessage) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 font-bold ${
                    formError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}
              >
                {formError ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                {formError || successMessage}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card"
                >
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400"><Info size={24} /></div>
                    Core Exam Details
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 ml-1">Exam Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-lg font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        placeholder="e.g., Mathematics - Final Assessment 2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 ml-1">Description (Optional)</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        placeholder="Provide brief context for the students..."
                      />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 ml-1">Exam Rules & Guidelines</label>
                        <textarea
                        value={rulesText}
                        onChange={(e) => setRulesText(e.target.value)}
                        rows={4}
                        className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        placeholder="One rule per line"
                        />
                        <p className="text-[10px] text-slate-500 italic ml-2">*Each line will be treated as a separate rule.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card relative z-10 overflow-visible"
                >
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400"><Settings size={24} /></div>
                    Configuration & Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Selection */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2"><GraduationCap size={16} /> Grade Level</label>
                            <CustomSelect
                                value={gradeId}
                                onChange={(val) => { setGradeId(val); setSubjectId(''); }}
                                options={[
                                    { value: '', label: 'Select Grade' },
                                    ...grades.map(g => ({ value: g.id, label: g.name }))
                                ]}
                                icon={<GraduationCap size={18} />}
                                placeholder="Select Grade"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2"><BookOpen size={16} /> Subject</label>
                            <CustomSelect
                                value={subjectId}
                                onChange={setSubjectId}
                                options={[
                                    { value: '', label: 'Select Subject' },
                                    ...filteredSubjects.map(s => ({ value: s.id, label: s.name }))
                                ]}
                                icon={<BookOpen size={18} />}
                                disabled={!gradeId}
                                placeholder="Select Subject"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1">Question Type</label>
                                <CustomSelect
                                    value={examQuestionType}
                                    onChange={(val) => setExamQuestionType(val as any)}
                                    options={[
                                        { value: 'MCQ', label: 'MCQ' },
                                        { value: 'STRUCTURED', label: 'Structured' },
                                        { value: 'ESSAY', label: 'Essay' }
                                    ]}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1">Category</label>
                                <CustomSelect
                                    value={examTypeCategory}
                                    onChange={(val) => setExamTypeCategory(val as any)}
                                    options={[
                                        { value: 'RANDOM_NEW', label: 'Random' },
                                        { value: 'LESSON_WISE', label: 'Lesson Wise' },
                                        { value: 'PAST_PAPERS', label: 'Past Papers' },
                                        { value: 'LIVE', label: 'Live' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Numeric Options */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2"><Clock size={16} /> Duration</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={timeAllocationMinutes} 
                                        onChange={e => setTimeAllocationMinutes(Number(e.target.value))} 
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-black uppercase tracking-widest">Mins</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1">Passing %</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={passingScorePercent} 
                                        onChange={e => setPassingScorePercent(Number(e.target.value))} 
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                                    />
                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-bold uppercase">%</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2"><AlertTriangle size={16} /> Exam Dates</label>
                            <div className="grid grid-cols-2 gap-4">
                                <CustomDateTimePicker 
                                    value={startsAt} 
                                    onChange={setStartsAt} 
                                    min={new Date().toISOString().slice(0, 16)}
                                    icon={<Calendar size={18} className="text-emerald-400" />}
                                />
                                <CustomDateTimePicker 
                                    value={endsAt} 
                                    onChange={setEndsAt} 
                                    min={startsAt || new Date().toISOString().slice(0, 16)}
                                    icon={<Calendar size={18} className="text-red-400" />}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setShuffleQuestions(!shuffleQuestions)}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                                    shuffleQuestions 
                                        ? 'bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10' 
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        shuffleQuestions ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-700 text-transparent'
                                    }`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className={`text-sm font-bold transition-colors ${shuffleQuestions ? 'text-white' : 'text-slate-400'}`}>Shuffle</span>
                                </div>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${shuffleQuestions ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                                    <motion.div 
                                        animate={{ x: shuffleQuestions ? 18 : 2 }}
                                        className="absolute top-1 w-2 h-2 rounded-full bg-white shadow-sm"
                                    />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setAllowReviewBeforeSubmit(!allowReviewBeforeSubmit)}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                                    allowReviewBeforeSubmit 
                                        ? 'green-glow bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        allowReviewBeforeSubmit ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700 text-transparent'
                                    }`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className={`text-sm font-bold transition-colors ${allowReviewBeforeSubmit ? 'text-white' : 'text-slate-400'}`}>Review</span>
                                </div>
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${allowReviewBeforeSubmit ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                                    <motion.div 
                                        animate={{ x: allowReviewBeforeSubmit ? 18 : 2 }}
                                        className="absolute top-1 w-2 h-2 rounded-full bg-white shadow-sm"
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="glass-card">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400"><ListChecks size={24} /></div>
                            Select Exam Questions
                        </h2>
                        <div className="flex gap-3 w-full md:w-auto">
                            <input
                                value={lesson}
                                onChange={(e) => setLesson(e.target.value)}
                                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none"
                                placeholder="Filter by lesson..."
                            />
                            <button
                                onClick={handleFindRelevantQuestions}
                                disabled={loadingQuestions}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                            >
                                {loadingQuestions ? <Loader2 size={18} className="animate-spin" /> : <Layers size={18} />}
                                Load
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {questions.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                                <p className="text-slate-500 font-medium">No questions loaded. Adjust filters and click "Load".</p>
                            </div>
                        ) : questions.map((question, idx) => {
                            const selected = Boolean(selectedMarks[question.id]);
                            return (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => toggleQuestion(question.id)}
                                    className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${
                                        selected 
                                            ? 'border-emerald-500/50 bg-emerald-500/5' 
                                            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                            selected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700'
                                        }`}>
                                            {selected && <CheckCircle2 size={14} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">
                                                    {question.type}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/5 text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest border border-indigo-500/10">
                                                    {question.lesson || 'General'}
                                                </span>
                                            </div>
                                            <p className="text-white font-medium leading-relaxed group-hover:text-indigo-200 transition-colors">
                                                {question.content}
                                            </p>
                                        </div>
                                        {selected && (
                                            <div className="flex flex-col items-center gap-2" onClick={e => e.stopPropagation()}>
                                                <label className="text-[10px] font-bold text-slate-500">MARKS</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={selectedMarks[question.id]}
                                                    onChange={(e) => updateQuestionMarks(question.id, Number(e.target.value))}
                                                    className="w-16 px-2 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-center font-bold text-sm focus:border-emerald-500/50"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Navigation */}
            <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
                <button
                    onClick={() => setActiveStep(prev => prev - 1)}
                    disabled={activeStep === 0}
                    className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white rounded-2xl transition-all font-bold"
                >
                    <ChevronLeft size={20} />
                    Back
                </button>
                
                {activeStep < 2 ? (
                    <button
                        onClick={() => setActiveStep(prev => prev + 1)}
                        disabled={(activeStep === 0 && !title) || (activeStep === 1 && (!gradeId || !subjectId))}
                        className="flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl transition-all font-bold shadow-xl shadow-indigo-600/30"
                    >
                        Continue
                        <ChevronRight size={20} />
                    </button>
                ) : (
                    <button
                        onClick={handleCreateExam}
                        disabled={submittingExam || selectedCount === 0}
                        className="flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl transition-all font-bold shadow-xl shadow-emerald-500/30 group"
                    >
                        {submittingExam ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
                        Save Exam
                    </button>
                )}
            </div>
          </div>

          {/* Right Summary Sidebar (Sticky) */}
          <div className="space-y-5 lg:sticky lg:top-8">
            <div className="glass-card">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Exam Summary</h3>
              
              <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-xs font-bold text-slate-500 mb-1">SELECTED QUESTIONS</p>
                      <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-white">{selectedCount}</span>
                          <span className="text-slate-600 font-bold">Total Items</span>
                      </div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/10">
                      <p className="text-xs font-bold text-indigo-400/70 mb-1">TOTAL MARKS</p>
                      <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-indigo-400">{totalMarks}</span>
                          <span className="text-indigo-400/40 font-bold">Sum Score</span>
                      </div>
                  </div>

                  <div className="space-y-2 pt-4">
                      <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-white">{Math.floor((activeStep + 1) / 3 * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-indigo-600"
                            animate={{ width: `${(activeStep + 1) / 3 * 100}%` }}
                          />
                      </div>
                  </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/5 flex items-center justify-center text-indigo-400">
                          <Clock size={16} />
                      </div>
                      <div>
                          <p className="text-[10px] font-bold text-slate-600 leading-none">TIME LIMIT</p>
                          <p className="text-xs font-bold text-slate-300">{timeAllocationMinutes} Minutes</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/5 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 size={16} />
                      </div>
                      <div>
                          <p className="text-[10px] font-bold text-slate-600 leading-none">PASS THRESHOLD</p>
                          <p className="text-xs font-bold text-slate-300">{passingScorePercent}% required</p>
                      </div>
                  </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-500/80 text-[10px] leading-relaxed">
                <span className="font-black">PRO TIP:</span> Ensure you have enough questions for the selected type and grade before proceeding to the final step.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Exams;
