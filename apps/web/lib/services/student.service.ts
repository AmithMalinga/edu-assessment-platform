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
}

export interface AuthResponse {
    access_token: string;
    user: AuthUser;
}

type ApiErrorShape = {
    message?: string | string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

    register: async (data: { name: string; email: string; phone: string; age: number; educationalLevel: string; password: string }): Promise<AuthResponse> => {
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
    getProfile: async (token: string) => {
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
    }
};
