import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useGrades } from '../hooks/useGrades';
import { useSubjects } from '../hooks/useSubjects';
import { useExams } from '../hooks/useExams';
import type {
  ExamQuestionType,
  ExamTypeCategory,
  RelevantQuestion,
} from '../services/admin.service';

const Exams: React.FC = () => {
  const { grades, loading: gradesLoading } = useGrades();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const {
    exams,
    loading: examsLoading,
    error: examsError,
    getRelevantQuestions,
    createExam,
  } = useExams();

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
    setSuccessMessage('');

    if (!gradeId || !subjectId) {
      setFormError('Please choose both grade and subject before loading questions.');
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
        setFormError('No questions match your current filters. Adjust lesson/type and try again.');
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setFormError(message || 'Failed to load relevant questions');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleCreateExam = async () => {
    setFormError('');
    setSuccessMessage('');

    if (!gradeId || !subjectId) {
      setFormError('Grade and subject are required.');
      return;
    }

    if (!title.trim()) {
      setFormError('Exam title is required.');
      return;
    }

    if (selectedCount === 0) {
      setFormError('Select at least one question before creating an exam.');
      return;
    }

    const parsedRules = rulesText
      .split('\n')
      .map((rule) => rule.trim())
      .filter(Boolean);

    if (parsedRules.length === 0) {
      setFormError('Please add at least one exam rule.');
      return;
    }

    try {
      setSubmittingExam(true);

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

      setSuccessMessage('Exam created successfully.');
      setTitle('');
      setDescription('');
      setSelectedMarks({});
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setFormError(message || 'Failed to create exam');
    } finally {
      setSubmittingExam(false);
    }
  };

  return (
    <Layout title="Exam Builder">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-card border-white/10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" />
              Exam Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                placeholder="Exam title"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                placeholder="Description (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={gradeId}
                onChange={(e) => {
                  setGradeId(e.target.value);
                  setSubjectId('');
                }}
                className="px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white"
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>

              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white"
                disabled={!gradeId}
              >
                <option value="">Select Subject</option>
                {filteredSubjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>

              <select
                value={examQuestionType}
                onChange={(e) => setExamQuestionType(e.target.value as ExamQuestionType)}
                className="px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white"
              >
                <option value="MCQ">MCQ</option>
                <option value="STRUCTURED">Structured</option>
                <option value="ESSAY">Essay</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select
                value={examTypeCategory}
                onChange={(e) => setExamTypeCategory(e.target.value as ExamTypeCategory)}
                className="px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white"
              >
                <option value="RANDOM_NEW">Random New</option>
                <option value="LESSON_WISE">Lesson Wise</option>
                <option value="PAST_PAPERS">Past Papers</option>
                <option value="LIVE">Live</option>
              </select>

              <div className="md:col-span-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="number"
                min={1}
                value={timeAllocationMinutes}
                onChange={(e) => setTimeAllocationMinutes(Math.max(1, Number.parseInt(e.target.value || '1', 10)))}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                placeholder="Duration (minutes)"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={passingScorePercent}
                onChange={(e) => setPassingScorePercent(Math.max(0, Math.min(100, Number.parseInt(e.target.value || '0', 10))))}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                placeholder="Passing score %"
              />
              <input
                type="number"
                min={0}
                step={0.25}
                value={negativeMarkingPerWrongAnswer}
                onChange={(e) => setNegativeMarkingPerWrongAnswer(Math.max(0, Number.parseFloat(e.target.value || '0')))}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                placeholder="Negative marking"
              />
              <div className="flex items-center gap-4 text-sm text-slate-300 px-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                  />
                  Shuffle
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowReviewBeforeSubmit}
                    onChange={(e) => setAllowReviewBeforeSubmit(e.target.checked)}
                  />
                  Allow Review
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              />
            </div>

            <textarea
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
              placeholder="One rule per line"
            />
          </div>

          <div className="glass-card border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Relevant Questions</h3>
              <div className="text-sm text-slate-400">
                Selected {selectedCount} / {questions.length} | Total Marks {totalMarks}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                value={lesson}
                onChange={(e) => setLesson(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
                placeholder="Lesson filter (optional)"
              />

              <button
                type="button"
                onClick={handleFindRelevantQuestions}
                disabled={loadingQuestions || gradesLoading || subjectsLoading}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {loadingQuestions ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Find Relevant Questions
              </button>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {questions.length === 0 && (
                <div className="text-slate-500 text-sm py-8 text-center border border-dashed border-white/10 rounded-xl">
                  No questions loaded yet.
                </div>
              )}

              {questions.map((question) => {
                const selected = Boolean(selectedMarks[question.id]);
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      selected ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleQuestion(question.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <span className="px-2 py-1 rounded bg-white/10 text-slate-300">{question.type}</span>
                          <span className="px-2 py-1 rounded bg-white/10 text-slate-400">{question.lesson || 'General'}</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">{question.content}</p>
                      </div>
                      {selected && (
                        <input
                          type="number"
                          min={1}
                          value={selectedMarks[question.id]}
                          onChange={(e) =>
                            updateQuestionMarks(question.id, Number.parseInt(e.target.value || '1', 10))
                          }
                          className="w-20 px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-white text-sm"
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleCreateExam}
              disabled={submittingExam || selectedCount === 0}
              className="w-full mt-5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700/40 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {submittingExam ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Create Exam
            </button>

            {formError && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {formError}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                <CheckCircle2 size={16} />
                {successMessage}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ClipboardList size={18} className="text-amber-400" />
              Existing Exams
            </h3>

            {examsError && <p className="text-red-400 text-sm">{examsError}</p>}

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {examsLoading && (
                <div className="text-slate-500 text-sm py-8 text-center">Loading exams...</div>
              )}

              {!examsLoading && exams.length === 0 && (
                <div className="text-slate-500 text-sm py-8 text-center border border-dashed border-white/10 rounded-xl">
                  No exams created yet.
                </div>
              )}

              {exams.map((exam) => (
                <div key={exam.id} className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h4 className="text-white font-semibold mb-1">{exam.title}</h4>
                  <p className="text-xs text-slate-400 mb-2">Duration: {exam.duration} mins</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Questions: {exam._count.examQuestions}</span>
                    <span>Attempts: {exam._count.attempts}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Exams;
