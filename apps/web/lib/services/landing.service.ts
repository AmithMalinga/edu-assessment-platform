export interface Testimonial {
    id: string
    name: string
    role: string
    avatar: string | null
    rating: number
    content: string
}

export interface LandingStatsResponse {
    activeStudents: number
    totalQuestions: number
    totalExams: number
    passRate: number
}

type ApiUser = {
    id: string
    role?: string
}

type ApiAttempt = {
    userId?: string
    score?: number
    exam?: {
        passingScore?: number
    }
}

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_URL = RAW_API_URL?.replace(/^['\"]|['\"]$/g, '').replace(/\/$/, '');

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const ZERO_STATS: LandingStatsResponse = {
    activeStudents: 0,
    totalQuestions: 0,
    totalExams: 0,
    passRate: 0,
};

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`Request failed for ${url} with status ${res.status}`);
    }
    return res.json() as Promise<T>;
}

async function getStatsFromLandingEndpoint(baseUrl: string): Promise<LandingStatsResponse | null> {
    const candidates = [`${baseUrl}/landing/stats`, `${baseUrl}/api/landing/stats`];

    for (const endpoint of candidates) {
        try {
            return await fetchJson<LandingStatsResponse>(endpoint);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const notFound = message.includes('status 404');
            if (!notFound) {
                console.warn(`Landing stats endpoint failed (${endpoint}):`, error);
            }
        }
    }

    return null;
}

async function getStatsFromFallbackEndpoints(baseUrl: string): Promise<LandingStatsResponse> {
    const [users, questions, assessments, results] = await Promise.all([
        fetchJson<ApiUser[]>(`${baseUrl}/users`).catch(() => []),
        fetchJson<unknown[]>(`${baseUrl}/questions`).catch(() => []),
        fetchJson<unknown[]>(`${baseUrl}/assessments`).catch(() => []),
        fetchJson<ApiAttempt[]>(`${baseUrl}/results`).catch(() => []),
    ]);

    const studentUsers = users.filter((user) => !user.role || user.role === 'STUDENT');
    const activeStudents = studentUsers.length > 0
        ? studentUsers.length
        : new Set(results.map((attempt) => attempt.userId).filter(Boolean)).size;

    const validResults = results.filter(
        (attempt) =>
            typeof attempt.score === 'number' &&
            typeof attempt.exam?.passingScore === 'number',
    );

    const passedCount = validResults.filter(
        (attempt) => (attempt.score ?? 0) >= (attempt.exam?.passingScore ?? 0),
    ).length;

    const passRate = validResults.length > 0
        ? Math.round((passedCount / validResults.length) * 100)
        : 0;

    return {
        activeStudents,
        totalQuestions: questions.length,
        totalExams: assessments.length,
        passRate,
    };
}

export const landingService = {
    getStats: async (): Promise<LandingStatsResponse> => {
        try {
            const landingStats = await getStatsFromLandingEndpoint(API_URL);
            if (landingStats) {
                return landingStats;
            }

            return await getStatsFromFallbackEndpoints(API_URL);
        } catch (err) {
            console.error('Error fetching landing stats:', err);
            return ZERO_STATS;
        }
    },

    getTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const res = await fetch(`${API_URL}/testimonials`, {
                cache: 'no-store' // Ensure fresh data
            });
            if (!res.ok) throw new Error('Failed to fetch testimonials');
            return await res.json();
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            return [];
        }
    }
}
