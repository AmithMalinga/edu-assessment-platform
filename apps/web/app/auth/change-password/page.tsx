"use client"

import { motion } from "framer-motion"
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle, Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { tutorService } from "@/lib/services/tutor.service"
import { AuthSplitLayout } from "@/components/auth/auth-split-layout"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  const getPostChangeDestination = () => {
    try {
      const currentUserRaw = localStorage.getItem("currentUser")
      if (!currentUserRaw) return "/dashboard"

      const currentUser = JSON.parse(currentUserRaw)
      if (currentUser?.role === "TUTOR") return "/tutor-dashboard"

      return "/dashboard"
    } catch {
      return "/dashboard"
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword || formData.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = "New password must be different from current password"
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const errors = validateForm()
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsLoading(true)
    try {
      await tutorService.changePassword(formData.currentPassword, formData.newPassword)
      setSuccess(true)
      
      // Redirect to role-specific dashboard after 2 seconds
      setTimeout(() => {
        router.push(getPostChangeDestination())
      }, 2000)
    } catch (err) {
      setError((err as Error).message || "Password change failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      imageSrc="/password_change_hero.png"
      imageAlt="Secure password change"
      headline={<>Secure <span className="italic text-indigo-300 font-light">your account</span> with a new password</>}
      description="Please set a strong password to protect your professional dashboard and student data."
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
              Security Update
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent pb-1">
            Change Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {success 
              ? "Your security credentials have been updated." 
              : "This is a required security step for your first login."}
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/50"
          >
            <div className="flex justify-center">
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-indigo-500 relative z-10" />
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Updated!</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 px-4">
                Your password has been changed successfully. Redirecting you to your dashboard...
              </p>
            </div>
            <div className="pt-4 flex flex-col items-center">
              <Loader2 className="h-5 w-5 text-indigo-500 animate-spin mb-2" />
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl p-3.5 text-xs font-semibold text-red-600 dark:text-red-400 shadow-sm shadow-red-500/5"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Current Password */}
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  placeholder="Enter temporary password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className={`pl-10 pr-10 h-11 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all duration-200 rounded-xl font-medium ${validationErrors.currentPassword ? "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:ring-offset-0"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.currentPassword && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{validationErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                New Password
              </Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className={`pl-10 pr-10 h-11 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all duration-200 rounded-xl font-medium ${validationErrors.newPassword ? "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:ring-offset-0"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.newPassword && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{validationErrors.newPassword}</p>
              )}
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 ml-1 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-indigo-500" /> Minimum 8 characters required
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
                Confirm New Password
              </Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  placeholder="Re-enter for confirmation"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`pl-10 pr-10 h-11 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all duration-200 rounded-xl font-medium ${validationErrors.confirmPassword ? "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500" : "focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/5 focus-visible:ring-offset-0"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating Security...
                  </>
                ) : (
                  <>
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
        
        {!success && (
          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Protecting your account with end-to-end encryption.
            </p>
          </div>
        )}
      </div>
    </AuthSplitLayout>
  )
}
