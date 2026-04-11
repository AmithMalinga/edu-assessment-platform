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

export type ExamQuestionType = "MCQ" | "STRUCTURED" | "ESSAY"
export type ExamTypeCategory = "RANDOM_NEW" | "LESSON_WISE" | "PAST_PAPERS" | "LIVE"

export interface ExamConfigMetadata {
    gradeId: number
    gradeName: string
    subjectId: string
    subjectName: string
    examQuestionType: ExamQuestionType
    examTypeCategory: ExamTypeCategory
    lesson: string | null
    totalMarks: number
    rules: string[]
    shuffleQuestions: boolean
    allowReviewBeforeSubmit: boolean
    negativeMarkingPerWrongAnswer: number
    startsAt: string | null
    endsAt: string | null
}

export interface AssessmentExamSummary {
    id: string
    title: string
    description: string | null
    duration: number
    passingScore: number
    createdAt: string
    updatedAt: string
    metadata: ExamConfigMetadata | null
    questionCount: number
}

export interface AssessmentQuestion {
    id: string
    content: string
    type: ExamQuestionType
    lesson: string
    images: string[]
    choices: string[]
    correctAnswer: string | null
}

export interface AssessmentExamDetail {
    id: string
    title: string
    description: string | null
    duration: number
    passingScore: number
    metadata: ExamConfigMetadata | null
    examQuestions: Array<{
        id: string
        order: number
        marks: number
        questionId: string
        question: AssessmentQuestion
    }>
}

const EXAM_CONFIG_PREFIX = "Exam Config: "

const parseExamConfig = (description: string | null): ExamConfigMetadata | null => {
    if (!description) return null

    const markerIndex = description.indexOf(EXAM_CONFIG_PREFIX)
    if (markerIndex === -1) return null

    const configString = description.slice(markerIndex + EXAM_CONFIG_PREFIX.length).trim()
    try {
        return JSON.parse(configString) as ExamConfigMetadata
    } catch {
        return null
    }
}

const stripExamConfigFromDescription = (description: string | null): string | null => {
    if (!description) return null

    const markerIndex = description.indexOf(EXAM_CONFIG_PREFIX)
    if (markerIndex === -1) return description.trim() || null

    const plainDescription = description.slice(0, markerIndex).trim()
    return plainDescription || null
}

export const examTypeSlugToCategory = (slug: string): ExamTypeCategory => {
    switch (slug) {
        case "lesson-wise":
            return "LESSON_WISE"
        case "past-papers":
            return "PAST_PAPERS"
        case "live":
            return "LIVE"
        default:
            return "RANDOM_NEW"
    }
}

export const examCategoryToLabel = (category: ExamTypeCategory | null | undefined): string => {
    switch (category) {
        case "LESSON_WISE":
            return "Lesson Wise"
        case "PAST_PAPERS":
            return "Past Papers"
        case "LIVE":
            return "Live"
        case "RANDOM_NEW":
            return "Random New"
        default:
            return "General"
    }
}

export const assessmentService = {
    async getAllExams(): Promise<AssessmentExamSummary[]> {
        const response = await fetch(`${API_URL}/assessments`, {
            cache: "no-store",
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to fetch exams."))
        }

        return (result as any[]).map((exam) => {
            const metadata = parseExamConfig(exam.description ?? null)
            return {
                id: exam.id,
                title: exam.title,
                description: stripExamConfigFromDescription(exam.description ?? null),
                duration: exam.duration,
                passingScore: exam.passingScore,
                createdAt: exam.createdAt,
                updatedAt: exam.updatedAt,
                metadata,
                questionCount: exam?._count?.examQuestions ?? 0,
            }
        })
    },

    async getAvailableExamsForSubject(subjectId: string, examTypeSlug: string): Promise<AssessmentExamSummary[]> {
        const exams = await this.getAllExams()
        const targetCategory = examTypeSlugToCategory(examTypeSlug)

        return exams.filter((exam) => {
            if (!exam.metadata) return false
            return exam.metadata.subjectId === subjectId && exam.metadata.examTypeCategory === targetCategory
        })
    },

    async getExamById(examId: string): Promise<AssessmentExamDetail> {
        const response = await fetch(`${API_URL}/assessments/${examId}`, {
            cache: "no-store",
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(getErrorMessage(result, "Failed to fetch exam details."))
        }

        return {
            id: result.id,
            title: result.title,
            description: stripExamConfigFromDescription(result.description ?? null),
            duration: result.duration,
            passingScore: result.passingScore,
            metadata: parseExamConfig(result.description ?? null),
            examQuestions: result.examQuestions ?? [],
        }
    },
}
