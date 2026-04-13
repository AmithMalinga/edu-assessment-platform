"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Phone, BookOpen, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TutorProfile {
  id: string
  name: string
  email: string
  phone: string
  username: string
  subject: string
  studentCount: string
  bio?: string
  role: string
  createdAt: string
}

export default function TutorDashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<TutorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const currentUser = localStorage.getItem("currentUser")

        if (!token || !currentUser) {
          router.push("/auth/tutor-login")
          return
        }

        const user = JSON.parse(currentUser)

        if (user.role !== "TUTOR") {
          router.push("/login")
          return
        }

        // Fetch full profile from API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile({
          ...data,
          username: data.username || user.email,
        })
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const getStudentCountLabel = (count: string) => {
    const mapping: { [key: string]: string } = {
      ZERO_FIFTY: "0-50 students",
      FIFTY_FIVE_HUNDRED: "50-500 students",
      FIVE_HUNDRED_PLUS: "500+ students",
    }
    return mapping[count] || count
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error || "Failed to load profile"}</p>
            <Button className="w-full" onClick={() => router.push("/auth/tutor-login")}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tutor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {profile.name}!</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                Profile Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{profile.username}</p>
              </div>
              <div className="flex gap-2 items-center pt-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{profile.email}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm">{profile.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutoring Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Tutoring Information
              </CardTitle>
              <CardDescription>Your teaching details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium text-lg text-primary">{profile.subject}</p>
              </div>
              <div className="flex gap-2 items-center pt-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Student Count</p>
                  <p className="text-sm font-medium">
                    {getStudentCountLabel(profile.studentCount)}
                  </p>
                </div>
              </div>
              {profile.bio && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="text-sm">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="text-lg font-semibold capitalize">{profile.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-lg font-semibold">
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/auth/change-password")}
          >
            Change Password
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
