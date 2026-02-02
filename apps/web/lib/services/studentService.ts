const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getAllStudents = async () => {
    try {
        const response = await fetch(`${API_URL}/students`);
        if (!response.ok) {
            throw new Error(`Error fetching students: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get students:", error);
        throw error;
    }
};
