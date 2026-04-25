import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useQuestions } from '../hooks/useQuestions';
import { useSubjects } from '../hooks/useSubjects';
import { useGrades } from '../hooks/useGrades';
import { adminService } from '../services/admin.service';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Layers, BookOpen, CheckCircle2, AlertCircle, 
  ArrowLeft, Save, Eye, Layout as LayoutIcon, Type,
  Sparkles, CheckCircle, Info, Clock, FileText, ImageIcon, X, Loader2
} from 'lucide-react';
import CustomSelect from '../components/common/CustomSelect';

const EditQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateQuestion } = useQuestions();
  const { subjects } = useSubjects();
  const { grades } = useGrades();

  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionData, setQuestionData] = useState({
    content: '',
    type: 'MCQ' as 'MCQ' | 'STRUCTURED' | 'ESSAY',
    lesson: 'General',
    choices: ['', '', '', ''],
    choiceImages: ['', '', '', ''],
    correctAnswer: '',
    correctAnswerIndex: -1,
    subjectId: '',
    gradeId: '',
    images: [] as string[]
  });
  
  const [choiceUploadingIdx, setChoiceUploadingIdx] = useState<number | null>(null);
  const choiceFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      try {
        setIsLoadingQuestion(true);
        const data = await adminService.getQuestion(id);
        const choices = data.choices?.length > 0 ? [...data.choices] : ['', '', '', ''];
        const choiceImages = data.choiceImages?.length > 0 ? [...data.choiceImages] : [];
        
        // Pad choiceImages to match choices length
        while (choiceImages.length < choices.length) {
          choiceImages.push('');
        }

        setQuestionData({
          content: data.content,
          type: data.type,
          lesson: data.lesson,
          choices: choices,
          choiceImages: choiceImages,
          correctAnswer: data.correctAnswer || '',
          correctAnswerIndex: data.choices?.indexOf(data.correctAnswer) ?? -1,
          subjectId: data.subjectId,
          gradeId: data.subject?.gradeId?.toString() || '',
          images: data.images || []
        });
      } catch (err: any) {
        setError('Failed to load question data');
      } finally {
        setIsLoadingQuestion(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const selectedGradeName = useMemo(() => {
    const gList = Array.isArray(grades) ? grades : [];
    return gList.find(g => g.id === Number.parseInt(questionData.gradeId, 10))?.name || '...';
  }, [grades, questionData.gradeId]);

  const selectedSubjectName = useMemo(() => {
    const sList = Array.isArray(subjects) ? subjects : [];
    return sList.find(s => s.id === questionData.subjectId)?.name || '...';
  }, [subjects, questionData.subjectId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setImageError('');
    try {
      const { url } = await adminService.uploadQuestionImage(file);
      setQuestionData(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
    } catch (err: any) {
      setImageError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setQuestionData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleChoiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setChoiceUploadingIdx(index);
    try {
      const { url } = await adminService.uploadQuestionImage(file);
      const newChoiceImages = [...questionData.choiceImages];
      newChoiceImages[index] = url;
      setQuestionData(prev => ({
        ...prev,
        choiceImages: newChoiceImages
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload choice image');
    } finally {
      setChoiceUploadingIdx(null);
      if (choiceFileInputRefs.current[index]) {
        choiceFileInputRefs.current[index]!.value = '';
      }
    }
  };

  const removeChoiceImage = (index: number) => {
    const newChoiceImages = [...questionData.choiceImages];
    newChoiceImages[index] = '';
    setQuestionData(prev => ({
      ...prev,
      choiceImages: newChoiceImages
    }));
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setIsSubmitting(true);
    
    try {
      if (!questionData.content.trim() && questionData.images.length === 0) {
        throw new Error('Please provide either a question prompt or an image.');
      }

      if (questionData.type === 'MCQ') {
        const processedChoices = questionData.choices.map((c, i) => {
          if (c.trim() === '' && questionData.choiceImages[i]) {
            return `Option ${i + 1}`;
          }
          return c.trim();
        });

        const validIndices = processedChoices.map((c, i) => i).filter(i => processedChoices[i] !== '' || questionData.choiceImages[i]);
        
        if (validIndices.length < 2) throw new Error('At least 2 choices (text or image) required');
        if (questionData.correctAnswerIndex === -1) throw new Error('Please select a correct answer');
        
        const finalChoices = processedChoices.filter((_, i) => validIndices.includes(i));
        const finalChoiceImages = questionData.choiceImages.filter((_, i) => validIndices.includes(i));
        
        // Map the correct answer index to the new filtered array's text
        const correctChoiceOriginalIndex = questionData.correctAnswerIndex;
        const correctChoiceText = processedChoices[correctChoiceOriginalIndex];

        await updateQuestion(id, {
          ...questionData,
          gradeId: Number.parseInt(questionData.gradeId, 10),
          choices: finalChoices,
          choiceImages: finalChoiceImages,
          correctAnswer: correctChoiceText
        });
      } else {
        await updateQuestion(id, {
          ...questionData,
          gradeId: Number.parseInt(questionData.gradeId, 10),
          choices: [],
          choiceImages: [],
          correctAnswer: questionData.correctAnswer
        });
      }
      
      navigate('/questions');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update question');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingQuestion) {
    return (
      <Layout title="Edit Question">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Modify Question Content">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left: Form Column */}
        <div className="flex-1 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate('/questions')}
              className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all"
            >
              <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 group-hover:scale-110 transition-all border border-white/5">
                <ArrowLeft size={18} />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 group-hover:text-indigo-400 transition-colors leading-none mb-1">Back to Bank</span>
                <span className="block font-bold text-sm">Question Repository</span>
              </div>
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border-white/10 p-8 shadow-2xl relative z-10"
          >
            <div className="absolute top-0 left-0 w-1 h-32 bg-indigo-500/50" />
            
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Edit Question</h3>
                    <p className="text-slate-500 text-xs">Update your assessment content in the repository.</p>
                </div>
            </div>

            <form onSubmit={handleUpdateQuestion} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Type size={14} className="text-indigo-400" /> Question Prompt
                </label>
                <textarea 
                  value={questionData.content} 
                  onChange={(e) => setQuestionData({...questionData, content: e.target.value})}
                  placeholder="What would you like to ask?" 
                  required={questionData.images.length === 0}
                  rows={4}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-lg leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Response Type</label>
                  <CustomSelect
                    value={questionData.type}
                    onChange={(val) => setQuestionData({...questionData, type: val as any})}
                    options={[
                      { value: 'MCQ', label: 'Multiple Choice (MCQ)' },
                      { value: 'STRUCTURED', label: 'Structured Question' },
                      { value: 'ESSAY', label: 'Essay / Long Answer' }
                    ]}
                    icon={<LayoutIcon size={18} />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category / Topic</label>
                  <div className="relative">
                    <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={questionData.lesson} 
                      onChange={(e) => setQuestionData({...questionData, lesson: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      placeholder="e.g. Ancient Civilizations"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Grade</label>
                  <CustomSelect
                    value={questionData.gradeId}
                    onChange={(val) => setQuestionData({...questionData, gradeId: val, subjectId: ''})}
                    options={[
                      { value: '', label: 'Select Grade' },
                      ...(Array.isArray(grades) ? grades : []).map(g => ({ value: g.id, label: g.name }))
                    ]}
                    icon={<Layers size={18} />}
                    placeholder="Select Grade"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Associated Subject</label>
                  <CustomSelect
                    value={questionData.subjectId}
                    onChange={(val) => setQuestionData({...questionData, subjectId: val})}
                    options={[
                      { value: '', label: 'Select Subject' },
                      ...(Array.isArray(subjects) ? subjects : [])
                        .filter(s => s.gradeId === Number.parseInt(questionData.gradeId, 10))
                        .map(s => ({ value: s.id, label: s.name }))
                    ]}
                    icon={<BookOpen size={18} />}
                    disabled={!questionData.gradeId}
                    placeholder="Select Subject"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {questionData.type === 'MCQ' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-8 border-t border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Configure Choices</label>
                        <span className="text-[10px] text-slate-600 italic">Select one correct answer</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {questionData.choices.map((choice, i) => (
                        <div key={`mcq-choice-input-${i}`} className="space-y-3">
                          <div className="relative group">
                            <input 
                              type="text" 
                              value={choice} 
                              onChange={(e) => {
                                const newChoices = [...questionData.choices];
                                newChoices[i] = e.target.value;
                                
                                const newChoiceImages = [...questionData.choiceImages];
                                
                                // Automatically add a new empty choice if the last one was typed into
                                if (i === newChoices.length - 1 && e.target.value.trim() !== '') {
                                  newChoices.push('');
                                  newChoiceImages.push('');
                                }
                                
                                // If this is the current correct answer, update the string value as well
                                const updates: any = { choices: newChoices, choiceImages: newChoiceImages };
                                if (questionData.correctAnswerIndex === i) {
                                  updates.correctAnswer = e.target.value;
                                }
                                
                                setQuestionData({...questionData, ...updates});
                              }}
                              placeholder={questionData.choiceImages[i] ? `Label for Image (Optional)` : `Choice ${i+1} Text`}
                              className={`w-full pl-5 pr-12 py-4 bg-white/5 border rounded-2xl text-white placeholder:text-slate-600 focus:outline-none transition-all ${
                                  questionData.correctAnswerIndex === i 
                                  ? 'border-emerald-500/50 ring-1 ring-emerald-500/30 bg-emerald-500/5' 
                                  : 'border-white/10 focus:border-indigo-500/50'
                              }`}
                            />
                            <button 
                              type="button"
                              onClick={() => setQuestionData({...questionData, correctAnswerIndex: i, correctAnswer: choice})}
                              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all shadow-lg ${
                                  questionData.correctAnswerIndex === i 
                                  ? 'bg-emerald-500 text-white scale-110' 
                                  : 'text-slate-700 hover:text-slate-500 hover:bg-white/5'
                              }`}
                            >
                              <CheckCircle size={18} />
                            </button>
                          </div>

                          {/* Choice Image Upload */}
                          <div className="flex items-center gap-4">
                            {questionData.choiceImages[i] ? (
                              <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                <img src={questionData.choiceImages[i]} alt={`Choice ${i + 1}`} className="w-full h-full object-cover" />
                                <button 
                                  type="button" 
                                  onClick={() => removeChoiceImage(i)}
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={16} className="text-red-400" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                type="button"
                                onClick={() => choiceFileInputRefs.current[i]?.click()}
                                disabled={choiceUploadingIdx !== null}
                                className="w-20 h-20 rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-all hover:border-indigo-500/50 group shrink-0"
                              >
                                {choiceUploadingIdx === i ? (
                                  <Loader2 size={18} className="text-indigo-400 animate-spin" />
                                ) : (
                                  <>
                                    <ImageIcon size={18} className="text-slate-500 group-hover:text-indigo-400 transition-colors mb-1" />
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Image</span>
                                  </>
                                )}
                              </button>
                            )}
                            <div className="flex-1">
                               <p className="text-[10px] text-slate-500 font-medium">
                                 {questionData.choiceImages[i] ? 'Image uploaded for this choice' : 'Optional: Add an image for this answer option'}
                               </p>
                            </div>
                            <input 
                              type="file" 
                              ref={el => choiceFileInputRefs.current[i] = el} 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleChoiceImageUpload(e, i)} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Upload Section */}
              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <ImageIcon size={14} className="text-indigo-400" /> Reference Images
                    </label>
                    <span className="text-[10px] text-slate-600 italic">Optional</span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  {questionData.images.map((img, idx) => (
                    <div key={idx} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={20} className="text-red-400 hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className="w-24 h-24 rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-all hover:border-indigo-500/50 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {imageUploading ? (
                      <Loader2 size={24} className="text-indigo-400 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon size={24} className="text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Add</span>
                      </>
                    )}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                
                {imageError && (
                  <p className="text-red-400 text-xs font-medium flex items-center gap-1 mt-2">
                    <AlertCircle size={14} /> {imageError}
                  </p>
                )}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3"
                >
                  <AlertCircle size={20} className="text-red-500 shrink-0" /> 
                  <span className="font-medium">{error}</span>
                </motion.div>
              )}
              
              <div className="flex gap-4 pt-8">
                <button 
                  type="button" 
                  onClick={() => navigate('/questions')} 
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Update Question</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right: Real-time Preview */}
        <div className="xl:w-[400px] shrink-0">
            <div className="sticky top-8">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <Eye size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Student Preview</span>
                </div>
                
                <div className="glass-card border-white/10 overflow-hidden min-h-[500px] flex flex-col p-0 bg-slate-950/40">
                    {/* Preview Header */}
                    <div className="p-6 border-b border-white/5 bg-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-widest uppercase">
                                Grade {selectedGradeName}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                                <Clock size={12} />
                                1:00 min
                            </div>
                        </div>
                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-tight">{selectedSubjectName} Assessment</h4>
                    </div>

                    {/* Preview Content */}
                    <div className="p-8 flex-1">
                        <div className="mb-8">
                            <span className="text-indigo-400 font-bold text-sm block mb-2">Question 1</span>
                            {questionData.content ? (
                                <div className="text-white text-lg font-medium leading-relaxed">
                                    {questionData.content}
                                </div>
                            ) : questionData.images.length === 0 ? (
                                <div className="text-slate-500 text-lg font-medium leading-relaxed italic">
                                    Start typing your question prompt or upload an image to see the preview...
                                </div>
                            ) : null}
                            
                            {questionData.images.length > 0 && (
                                <div className="mt-4 flex flex-col gap-4">
                                    {questionData.images.map((img, i) => (
                                        <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                                            <img src={img} alt="Question reference preview" className="w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {questionData.type === 'MCQ' ? (
                            <div className="space-y-3">
                                {questionData.choices.map((choice, idx) => (
                                    <div 
                                        key={`preview-choice-${idx}`}
                                        className={`p-4 rounded-xl border text-sm flex flex-col gap-3 transition-all ${
                                            choice && choice === questionData.correctAnswer && choice.trim() !== ''
                                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                            : choice || questionData.choiceImages[idx] ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-transparent border-dashed border-white/5 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                                choice && choice === questionData.correctAnswer && choice.trim() !== ''
                                                ? 'border-emerald-500 bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                                : 'border-slate-700'
                                            }`}>
                                                {choice && choice === questionData.correctAnswer && choice.trim() !== '' ? <CheckCircle size={14} /> : String.fromCharCode(65 + idx)}
                                            </div>
                                            <span>{choice || (questionData.choiceImages[idx] ? 'Selected Image' : `Choice ${idx + 1}...`)}</span>
                                        </div>
                                        {questionData.choiceImages[idx] && (
                                            <img 
                                                src={questionData.choiceImages[idx]} 
                                                alt={`Choice ${idx + 1}`} 
                                                className="w-full max-h-40 object-contain rounded-lg border border-white/5 bg-black/20"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                <FileText size={40} className="text-slate-700 mb-4" />
                                <p className="text-slate-500 text-sm font-medium italic">
                                    Students will provide a {questionData.type === 'ESSAY' ? 'long-form essay' : 'structured'} response.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Preview Footer */}
                    <div className="p-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Info size={14} className="text-slate-600" />
                            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Editing Mode</span>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                            Preview Only
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditQuestion;
