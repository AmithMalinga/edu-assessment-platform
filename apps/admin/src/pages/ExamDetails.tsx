import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, Clock, CheckCircle2, 
    BookOpen, ClipboardList, Calendar,
    AlertCircle, FileText, ListChecks
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { adminService } from '../services/admin.service';
import { parseExamConfig } from '../utils/exam';

const ExamDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [exam, setExam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExamDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await adminService.findOne(id);
                setExam(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load exam details');
            } finally {
                setLoading(false);
            }
        };

        fetchExamDetails();
    }, [id]);

    if (loading) {
        return (
            <Layout title="Exam Details">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Skeleton Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-6 w-32 bg-white/5 rounded-lg animate-pulse" />
                        <div className="flex gap-3">
                            <div className="h-8 w-24 bg-white/5 rounded-xl animate-pulse" />
                            <div className="h-8 w-24 bg-white/5 rounded-xl animate-pulse" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Skeleton Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-64 glass-card animate-pulse" />
                            <div className="h-48 glass-card animate-pulse" />
                            <div className="h-96 glass-card animate-pulse" />
                        </div>
                        {/* Skeleton Right Column */}
                        <div className="space-y-6">
                            <div className="h-72 glass-card animate-pulse" />
                            <div className="h-32 glass-card animate-pulse" />
                            <div className="h-16 glass-card animate-pulse" />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !exam) {
        return (
            <Layout title="Error">
                <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{error || 'Exam not found'}</h2>
                    <button 
                        onClick={() => navigate('/exams/list')}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all"
                    >
                        Back to Exams
                    </button>
                </div>
            </Layout>
        );
    }

    const config = parseExamConfig(exam.description);
    const formattedDescription = exam.description.split('\n\n')[0];

    return (
        <Layout title={exam.title}>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                    <button 
                        onClick={() => navigate('/exams/list')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to List
                    </button>
                    <div className="flex gap-3">
                        {config?.examQuestionType && (
                            <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
                                {config.examQuestionType}
                            </span>
                        )}
                        {config?.examTypeCategory && (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                                {config.examTypeCategory.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details & Rules */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                        >
                            <h2 className="text-3xl font-black text-white mb-4">{exam.title}</h2>
                            <p className="text-slate-400 leading-relaxed mb-8">
                                {formattedDescription || 'No additional description provided for this examination.'}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Duration</p>
                                    <p className="text-white font-bold">{exam.duration} Mins</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Passing Score</p>
                                    <p className="text-emerald-400 font-bold">{exam.passingScore}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Questions</p>
                                    <p className="text-indigo-400 font-bold">{exam.examQuestions?.length || 0}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Created On</p>
                                    <p className="text-amber-400 font-bold">{new Date(exam.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </motion.div>

                        {config?.rules && config.rules.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-card"
                            >
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><FileText size={18} /></div>
                                    Exam Rules & Guidelines
                                </h3>
                                <div className="space-y-4">
                                    {config.rules.map((rule: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                {idx + 1}
                                            </div>
                                            <p className="text-slate-300 text-sm">{rule}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card"
                        >
                            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><ListChecks size={18} /></div>
                                Questions Checklist
                            </h3>
                            <div className="space-y-4">
                                {exam.examQuestions?.map((eq: any, idx: number) => (
                                    <div key={eq.id} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-6 hover:bg-white/[0.04] transition-colors">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {idx + 1}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-white text-sm leading-relaxed">{eq.question.content}</p>
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-0.5 rounded-lg bg-indigo-500/5 text-[9px] font-bold text-indigo-400/80 uppercase tracking-widest border border-indigo-500/10">
                                                        {eq.question.lesson || 'General'}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-lg bg-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-white/5">
                                                        {eq.question.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Marks</p>
                                            <p className="text-xl font-black text-indigo-400">{eq.marks}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Key Stats & Quick Info */}
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card"
                        >
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Quick Stats</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time Limit</p>
                                        <h4 className="text-lg font-bold text-white">{exam.duration} Minutes</h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pass Score</p>
                                        <h4 className="text-lg font-bold text-white">{exam.passingScore}% Correct</h4>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Marks</p>
                                        <h4 className="text-lg font-bold text-white">
                                            {exam.examQuestions?.reduce((acc: number, q: any) => acc + q.marks, 0) || 0} Points
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card bg-indigo-600/5 border-indigo-500/20"
                        >
                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Exam Summary</h3>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-3xl font-black text-white">{exam._count?.attempts || 0}</span>
                                <span className="text-slate-500 text-xs font-bold">Students Attempted</span>
                            </div>
                            <div className="text-[10px] text-slate-400 leading-relaxed italic">
                                *This counts all students who have started or completed this specific assessment.
                            </div>
                        </motion.div>

                        <div className="p-2">
                            <button 
                                onClick={() => navigate('/exams/list')}
                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={18} />
                                Return to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ExamDetails;
