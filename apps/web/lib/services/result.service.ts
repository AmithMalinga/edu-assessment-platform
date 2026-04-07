type ApiErrorShape = {
    message?: string | string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

const getErrorMessage = (body: ApiErrorShape | null, fallback: string) => {
    if (!body?.message) return fallback
    return Array.isArray(body.message) ? body.message[0] : body.message
}

const authHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
})

export interface SubmitExamPayload {
    examId: string
    answers: Record<string, string>
    timeTaken: number
}

export interface SubmissionResultSummary {
    id: string
    examId: string
    userId: string
    score: number
    timeTaken: number
    completedAt: string
    passed: boolean
    totalMarks: number
    earnedMarks: number
    correctAnswers: number
    wrongAnswers: number
    unansweredAnswers: number
    passingScore: number
}

export interface AttemptReviewQuestion {
    questionId: string
    order: number
    marks: number
    lesson: string
    questionType: "MCQ" | "STRUCTURED" | "ESSAY"
    content: string
    choices: string[]
    selectedAnswer: string | null
    correctAnswer: string | null
    isAnswered: boolean
    isCorrect: boolean
}

export interface AttemptReview {
    attemptId: string
    examId: string
    examTitle: string
    completedAt: string
    timeTaken: number
    passed: boolean
    scoreSummary: {
        score: number
        passingScore: number
        totalMarks: number
        earnedMarks: number
        correctAnswers: number
        wrongAnswers: number
        unansweredAnswers: number
    }
    questions: AttemptReviewQuestion[]
}

export interface AttemptListItem {
    id: string
    score: number
    timeTaken: number
    completedAt: string
    examId: string
    exam: {
        id: string
        title: string
        passingScore: number
        description: string | null
    }
}

export interface StudentAnalytics {
    userId: string
    overview: {
        totalAttempts: number
        averageScore: number
        passRate: number
        bestScore: number
        latestScore: number
        totalTimeTaken: number
        averageTimeTaken: number
    }
    scoreTrend: Array<{
        attemptId: string
        examId: string
        examTitle: string
        score: number
        completedAt: string
    }>
    byExamType: Array<{
        examType: string
        attempts: number
        averageScore: number
    }>
    bySubject: Array<{
        subject: string
        attempts: number
        averageScore: number
    }>
    recentAttempts: Array<{
        attemptId: string
        examId: string
        examTitle: string
        score: number
        completedAt: string
        passed: boolean
        examType: string
        subjectName: string
    }>
}

export const resultService = {
    async submitExam(token: string, payload: SubmitExamPayload): Promise<SubmissionResultSummary> {
        const response = await fetch(`${API_URL}/submissions`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(payload),
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to submit exam."))
        }

        return result
    },

    async getMyAttempts(token: string): Promise<AttemptListItem[]> {
        const response = await fetch(`${API_URL}/submissions/me`, {
            headers: authHeaders(token),
            cache: "no-store",
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to load attempts."))
        }

        return result
    },

    async getAttemptReview(token: string, attemptId: string): Promise<AttemptReview> {
        const response = await fetch(`${API_URL}/submissions/${attemptId}/review`, {
            headers: authHeaders(token),
            cache: "no-store",
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to load result review."))
        }

        return result
    },

    async getMyAnalytics(token: string): Promise<StudentAnalytics> {
        const response = await fetch(`${API_URL}/submissions/me/analytics`, {
            headers: authHeaders(token),
            cache: "no-store",
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to load analytics."))
        }

        return result
    },
}
