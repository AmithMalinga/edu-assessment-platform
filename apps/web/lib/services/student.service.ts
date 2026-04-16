export interface Student {
    id: number;
    name: string;
    email: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    educationalLevel: string;
    role: string;
    avatar?: string;
    requiresPasswordChange?: boolean;
    subject?: string;
    studentCount?: string;
    bio?: string;
}

export interface AuthResponse {
    access_token: string;
    user: AuthUser;
}

export interface RegisterOtpResponse {
    message: string;
    expiresInSeconds: number;
}

export interface VerifyOtpResponse {
    message: string;
    emailVerificationToken: string;
}

export interface StudentProfile extends AuthUser {
    createdAt: string;
    updatedAt: string;
}

export interface StudentSubject {
    id: string;
    name: string;
    gradeId: number;
    grade?: {
        id: number;
        name: string;
    };
}

type ApiErrorShape = {
    message?: string | string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const getErrorMessage = (body: ApiErrorShape | null, fallback: string) => {
    if (!body?.message) return fallback;
    return Array.isArray(body.message) ? body.message[0] : body.message;
};

export const studentService = {
    getAllStudents: async (): Promise<Student[]> => {
        try {
            const response = await fetch(`${API_URL}/students`, {
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error(`Error fetching students: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to get students:", error);
            return [];
        }
    },

    register: async (data: { name: string; email: string; phone: string; age: number; educationalLevel: string; password: string; emailVerificationToken: string }): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Registration failed.'));
        }

        return result;
    },

    requestRegisterOtp: async (data: { email: string }): Promise<RegisterOtpResponse> => {
        const response = await fetch(`${API_URL}/auth/register/request-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to send OTP.'));
        }

        return result;
    },

    verifyRegisterOtp: async (data: { email: string; otp: string }): Promise<VerifyOtpResponse> => {
        const response = await fetch(`${API_URL}/auth/register/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Invalid OTP.'));
        }

        return result;
    },

    login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Login failed.'));
        }

        return result;
    }
    ,
    getProfile: async (token: string): Promise<StudentProfile> => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch profile.'));
        }

        return result;
    },

    getSubjectsForStudent: async (studentId: string, token?: string): Promise<StudentSubject[]> => {
        const response = await fetch(`${API_URL}/subjects/${studentId}`, {
            headers: token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : undefined,
            cache: 'no-store',
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(getErrorMessage(result, 'Failed to fetch student subjects.'));
        }

        return result;
    }
};
