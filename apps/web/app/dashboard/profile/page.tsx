"use client"
import { useEffect, useState } from "react"
import { studentService } from "@/lib/services/student.service"
import { useRouter } from "next/navigation"

export default function StudentProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            setError("")
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Not authenticated.")
                    setLoading(false)
                    router.push("/login")
                    return
                }
                const res = await studentService.getProfile(token)
                if (res && res.id) {
                    setProfile(res)
                } else {
                    setError(res.message || "Failed to load profile.")
                }
            } catch (err: any) {
                setError(err.message || "Failed to load profile.")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [router])

    return (
        <main>
            <h2>Student Profile</h2>
            {loading ? <p>Loading...</p> : null}
            {error ? <p>{error}</p> : null}
            {!loading && !error && profile ? (
                <section>
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <p>Phone: {profile.phone}</p>
                    <p>Age: {profile.age}</p>
                    <p>Educational Level: {profile.educationalLevel}</p>
                    <p>Role: {profile.role}</p>
                    <p>Joined: {profile.createdAt && new Date(profile.createdAt).toLocaleDateString()}</p>
                </section>
            ) : null}
        </main>
    )
}
