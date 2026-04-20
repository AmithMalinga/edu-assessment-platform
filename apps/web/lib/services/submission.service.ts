type ApiErrorShape = {
    message?: string | string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
}

const getErrorMessage = (body: ApiErrorShape | null, fallback: string) => {
    if (!body?.message) return fallback
    return Array.isArray(body.message) ? body.message[0] : body.message
}

const authHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
})

export interface SubmissionWithExam {
    id: string
    examId: string
    userId: string
    score: number
    timeTaken: number
    completedAt: string
    submittedAt: string
    passed: boolean
    totalMarks: number
    earnedMarks: number
    correctAnswers: number
    wrongAnswers: number
    unansweredAnswers: number
    passingScore: number
    assessment?: {
        id: string
        title: string
        description: string | null
        passingScore: number
        totalMarks: number
        type: string
        subject?: {
            id: string
            name: string
        }
    }
}

export const submissionService = {
    /**
     * Get submissions for a specific student (for tutors to view)
     */
    async getStudentSubmissions(studentId: string, token: string): Promise<SubmissionWithExam[]> {
        const response = await fetch(
            `${API_URL}/submissions/student/${studentId}`,
            {
                headers: authHeaders(token),
                cache: "no-store",
            }
        )

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to load student submissions."))
        }

        // Transform backend response to match frontend expectations
        return (result || []).map((submission: any) => ({
            ...submission,
            submittedAt: submission.completedAt, // Map completedAt to submittedAt for display
            assessment: submission.exam, // Map exam to assessment for consistency with page expectations
            timeTaken: Math.round(submission.timeTaken / 60), // Convert seconds to minutes
            passed: submission.score >= (submission.exam?.passingScore || 50),
            totalMarks: submission.exam?.totalMarks || 100,
            earnedMarks: submission.score,
            passingScore: submission.exam?.passingScore || 50,
        }))
    },

    /**
     * Get current user's submissions
     */
    async getMySubmissions(token: string): Promise<SubmissionWithExam[]> {
        const response = await fetch(
            `${API_URL}/submissions/me`,
            {
                headers: authHeaders(token),
                cache: "no-store",
            }
        )

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to load submissions."))
        }

        return result
    },

    /**
     * Get submission details by ID
     */
    async getSubmissionById(submissionId: string, token: string): Promise<SubmissionWithExam> {
        const response = await fetch(
            `${API_URL}/submissions/${submissionId}`,
            {
                headers: authHeaders(token),
                cache: "no-store",
            }
        )

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to load submission."))
        }

        return result
    },
}
