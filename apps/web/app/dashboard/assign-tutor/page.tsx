'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tutorService } from '@/lib/services/tutor.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to assign to tutor.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 lg:p-8 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-indigo-500/20 bg-slate-900/50 backdrop-blur-xl">
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
              <UserPlus className="w-6 h-6 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Add a Tutor
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter the access code provided by your tutor to connect with them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                  message.type === 'success' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <p>{message.text}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="tutorCode" className="text-slate-300">Tutor Code</Label>
                <Input
                  id="tutorCode"
                  placeholder="e.g. TU-A1B2C3"
                  value={tutorCode}
                  onChange={(e) => setTutorCode(e.target.value)}
                  className="bg-slate-950/50 border-white/10 uppercase"
                />
              </div>

              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-white/5 bg-slate-900/50 p-4">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950"
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="consent" className="text-sm font-medium text-slate-300 cursor-pointer relative z-10">
                    I agree to share my details with this tutor
                  </Label>
                  <p className="text-sm text-slate-500">
                    By checking this box, you allow the assigned tutor to see your basic information, exam results, and progress.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Assigning...
                  </span>
                ) : (
                  'Connect with Tutor'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}