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
    }
};
