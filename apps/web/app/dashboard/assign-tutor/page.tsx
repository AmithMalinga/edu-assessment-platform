'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tutorService } from '@/lib/services/tutor.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  CheckCircle2, 
  UserPlus, 
  AlertCircle, 
  Sparkles,
  Users,
  ArrowUpRight,
  Star,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export default function AssignTutor() {
  const [tutorCode, setTutorCode] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setTutorCode(codeFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!tutorCode.trim()) {
      setMessage({ text: 'Please enter a tutor code.', type: 'error' });
      return;
    }
    if (!consentGiven) {
      setMessage({ text: 'You must agree to share your details with the tutor.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await tutorService.assignStudentToTutor(token, tutorCode.trim(), consentGiven);
      setMessage({ text: response.message + ` (${response.tutorName})`, type: 'success' });
      setTimeout(() => {
        router.push('/dashboard/my-tutors');
      }, 3000);
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to assign to tutor.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header - Matches Analytics Page */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mentorship & Guidance</h1>
          <p className="text-sm text-slate-500 font-medium">Connect with certified educators to accelerate your progress.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[14px] shadow-sm border border-slate-100 dark:border-slate-800">
          <button className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs">Add New</button>
          <button 
            onClick={() => router.push('/dashboard/my-tutors')}
            className="px-4 py-1.5 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl text-xs"
          >
            My Tutors
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Section - Matches Analytics Trend Chart Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Connect with Tutor</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-relaxed">Enter your unique educator access code below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p>{message.text}</p>
              </motion.div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="tutorCode" className="text-sm font-black text-slate-800 dark:text-slate-200">Educator Access Code</Label>
                <div className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase">Input ID</div>
              </div>
              <div className="relative group">
                <Input
                  id="tutorCode"
                  placeholder="E.G. TU-X9Y8Z7"
                  value={tutorCode}
                  onChange={(e) => setTutorCode(e.target.value)}
                  className="h-16 px-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all rounded-2xl font-mono text-xl uppercase tracking-widest font-black"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-6 w-6 text-indigo-400/50 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">This code is provided by your teacher or institution.</p>
            </div>

            <div className="p-6 rounded-[24px] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-5 items-start transition-colors hover:border-indigo-200 dark:hover:border-indigo-900">
              <div className="relative flex items-center h-6">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="h-6 w-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="consent" className="text-sm font-black text-slate-900 dark:text-white cursor-pointer select-none">
                  Authorization of Data Access
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  By checking this box, you grant the assigned educator full permission to analyze your exam results, subject mastery levels, and progress trends to provide tailored academic support.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto px-10 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Establishing Link...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Verify & Connect</span>
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Highlight Card - Matches Analytics Star Card style */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[32px] shadow-2xl shadow-indigo-500/30 text-white flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Users className="h-32 w-32 fill-current" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="h-14 w-14 bg-white/20 rounded-[18px] flex items-center justify-center backdrop-blur-md border border-white/20">
              <Star className="h-7 w-7 text-white fill-current" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-[11px] font-black text-indigo-100 uppercase tracking-widest">Premium Benefit</h3>
              <p className="text-3xl font-black leading-tight tracking-tight">
                Academic<br />Power-Up
              </p>
            </div>

            <div className="space-y-5 pt-2">
              <BenefitItem text="Direct material sharing" />
              <BenefitItem text="Real-time performance reviews" />
              <BenefitItem text="Curated exam strategy" />
              <BenefitItem text="Priority trilingual support" />
            </div>
          </div>

          <div className="relative z-10 mt-10">
            <div className="flex gap-3 items-center text-xs font-bold text-indigo-100/80 mb-6 group/info cursor-help">
              <Info className="h-4 w-4" />
              <p>Your privacy is our priority. You can revoke access at any time from your settings.</p>
            </div>
            
            <button 
              onClick={() => router.push('/dashboard/my-tutors')}
              className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-black text-sm transition-all group/btn flex items-center justify-center gap-2 border border-white/10"
            >
              View Existing Connections
              <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
      </div>
      <span className="text-xs font-bold text-indigo-50/90">{text}</span>
    </div>
  );
}