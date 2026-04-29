import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuestions } from '../../hooks/useQuestions';
import { 
  Type, Layout as LayoutIcon, HelpCircle, X, 
  Image as ImageIcon, CheckCircle, Save, Loader2 
} from 'lucide-react';
import CustomSelect from './CustomSelect';
import { adminService } from '../../services/admin.service';
import { toast } from 'react-hot-toast';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (question?: any) => void;
  defaultGradeId?: string;
  defaultSubjectId?: string;
  defaultLesson?: string;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({ 
  isOpen, onClose, onSuccess, defaultGradeId, defaultSubjectId, defaultLesson 
}) => {
  const { createQuestion } = useQuestions();

  const [imageUploading, setImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newQuestion, setNewQuestion] = useState({
    content: '',
    type: 'MCQ' as 'MCQ' | 'STRUCTURED' | 'ESSAY',
    lesson: defaultLesson || 'General',
    choices: ['', '', '', ''],
    choiceImages: ['', '', '', ''],
    correctAnswer: '',
    correctAnswerIndex: -1,
    subjectId: defaultSubjectId || '',
    gradeId: defaultGradeId || '',
    images: [] as string[]
  });

  const [choiceUploadingIdx, setChoiceUploadingIdx] = useState<number | null>(null);
  const choiceFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setNewQuestion({
        content: '',
        type: 'MCQ',
        lesson: defaultLesson || 'General',
        choices: ['', '', '', ''],
        choiceImages: ['', '', '', ''],
        correctAnswer: '',
        correctAnswerIndex: -1,
        subjectId: defaultSubjectId || '',
        gradeId: defaultGradeId || '',
        images: []
      });
    }
  }, [isOpen, defaultGradeId, defaultSubjectId, defaultLesson]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const { url } = await adminService.uploadQuestionImage(file);
      setNewQuestion(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setNewQuestion(prev => ({
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
      const newChoiceImages = [...newQuestion.choiceImages];
      newChoiceImages[index] = url;
      setNewQuestion(prev => ({
        ...prev,
        choiceImages: newChoiceImages
      }));
    } catch (err: any) {
      toast.error('Failed to upload choice image');
    } finally {
      setChoiceUploadingIdx(null);
      if (choiceFileInputRefs.current[index]) choiceFileInputRefs.current[index]!.value = '';
    }
  };

  const removeChoiceImage = (index: number) => {
    const newChoiceImages = [...newQuestion.choiceImages];
    newChoiceImages[index] = '';
    setNewQuestion(prev => ({ ...prev, choiceImages: newChoiceImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!newQuestion.content.trim() && newQuestion.images.length === 0) {
        throw new Error('Please provide either a question prompt or an image.');
      }
      if (!newQuestion.gradeId || !newQuestion.subjectId) {
        throw new Error('Grade and Subject must be specified.');
      }

      if (newQuestion.type === 'MCQ') {
        const processedChoices = newQuestion.choices.map((c, i) => {
          if (c.trim() === '' && newQuestion.choiceImages[i]) return `Option ${i + 1}`;
          return c.trim();
        });

        const validIndices = processedChoices.map((c, i) => i).filter(i => processedChoices[i] !== '' || newQuestion.choiceImages[i]);
        
        if (validIndices.length < 2) throw new Error('At least 2 choices required');
        if (newQuestion.correctAnswerIndex === -1) throw new Error('Please select a correct answer');
        
        const finalChoices = processedChoices.filter((_, i) => validIndices.includes(i));
        const finalChoiceImages = newQuestion.choiceImages.filter((_, i) => validIndices.includes(i));
        const correctChoiceText = processedChoices[newQuestion.correctAnswerIndex];

        const created = await createQuestion({
          ...newQuestion,
          gradeId: Number.parseInt(newQuestion.gradeId, 10),
          choices: finalChoices,
          choiceImages: finalChoiceImages,
          correctAnswer: correctChoiceText
        });
        
        toast.success('Question added to bank and exam!');
        onSuccess(created);
      } else {
        const created = await createQuestion({
          ...newQuestion,
          gradeId: Number.parseInt(newQuestion.gradeId, 10),
          choices: [],
          choiceImages: [],
          correctAnswer: newQuestion.correctAnswer
        });
        
        toast.success('Question added to bank and exam!');
        onSuccess(created);
      }
      
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card w-full max-w-3xl relative border border-white/10 my-auto shadow-2xl p-6"
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">Create New Question</h3>

        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Type size={14} className="text-indigo-400" /> Question Prompt
            </label>
            <textarea 
              value={newQuestion.content} 
              onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
              placeholder="What would you like to ask?" 
              required={newQuestion.images.length === 0}
              rows={3}
              className="admin-input h-auto resize-none text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Response Type</label>
              <CustomSelect
                value={newQuestion.type}
                onChange={(val) => setNewQuestion({...newQuestion, type: val as any})}
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
                <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  value={newQuestion.lesson} 
                  onChange={(e) => setNewQuestion({...newQuestion, lesson: e.target.value})}
                  className="admin-input pl-12"
                  placeholder="e.g. Current Lesson"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span className="flex items-center gap-2"><ImageIcon size={14} className="text-indigo-400" /> Reference Images</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {newQuestion.images.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={16} className="text-red-400" />
                  </button>
                </div>
              ))}
              <button 
                type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
                className="w-20 h-20 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center hover:bg-white/10"
              >
                {imageUploading ? <Loader2 size={20} className="animate-spin text-indigo-400" /> : <ImageIcon size={20} className="text-slate-500" />}
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {newQuestion.type === 'MCQ' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Configure Choices</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {newQuestion.choices.map((choice, i) => (
                    <div key={i} className="space-y-2">
                       <div className="relative group">
                          <input 
                            type="text" value={choice} 
                            onChange={(e) => {
                              const newChoices = [...newQuestion.choices];
                              newChoices[i] = e.target.value;
                              
                              const newChoiceImages = [...newQuestion.choiceImages];
                                
                              if (i === newChoices.length - 1 && e.target.value.trim() !== '') {
                                newChoices.push('');
                                newChoiceImages.push('');
                              }

                              const updates: any = { choices: newChoices, choiceImages: newChoiceImages };
                              if (newQuestion.correctAnswerIndex === i) updates.correctAnswer = e.target.value;
                              setNewQuestion({...newQuestion, ...updates});
                            }}
                            placeholder={`Choice ${i+1}`}
                            className={`admin-input pr-12 text-sm py-2 ${newQuestion.correctAnswerIndex === i ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}
                          />
                          <button 
                            type="button" onClick={() => setNewQuestion({...newQuestion, correctAnswerIndex: i, correctAnswer: choice})}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${newQuestion.correctAnswerIndex === i ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-white/5'}`}
                          >
                            <CheckCircle size={14} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 pt-6 mt-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex flex-row items-center justify-center gap-2">
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save & Add</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateQuestionModal;