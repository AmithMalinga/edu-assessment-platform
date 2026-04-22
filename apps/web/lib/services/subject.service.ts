
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export interface Grade {
    id: number;
    name: string;
}

export interface Subject {
    id: string;
    name: string;
    gradeId: number;
}

export const subjectService = {
    getGrades: async (): Promise<Grade[]> => {
        try {
            const response = await fetch(`${API_URL}/subjects/grades`, {
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error(`Error fetching grades: ${response.statusText}`);
            }
            const data: Grade[] = await response.json();
            // natural sort by name, but keep 'A/L' at the end
            return data.sort((a, b) => {
                if (a.name === 'A/L') return 1;
                if (b.name === 'A/L') return -1;
                return a.name.localeCompare(b.name, undefined, { numeric: true });
            });
        } catch (error) {
            console.error("Failed to get grades:", error);
            return [];
        }
    },

    getSubjectsByGrade: async (gradeId: number): Promise<Subject[]> => {
        try {
            const response = await fetch(`${API_URL}/subjects/grade/${gradeId}`, {
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error(`Error fetching subjects: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to get subjects:", error);
            return [];
        }
    }
};
