export interface Student {
    id: number;
    name: string;
    email: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

    register: async (data: { name: string; email: string; phone: string; age: number; educationalLevel: string; password: string }) => {
        try {
            console.log(data);
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            console.log("response", response);
            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: 'Registration failed.' };
        }
    },

    login: async (data: { email: string; password: string }) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: 'Login failed.' };
        }
    }
    ,
    getProfile: async (token: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return await response.json();
        } catch (error) {
            return { message: 'Failed to fetch profile.' };
        }
    }
};
