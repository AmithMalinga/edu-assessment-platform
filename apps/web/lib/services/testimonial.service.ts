const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

export interface CreateTestimonialDto {
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
}

export const testimonialService = {
    async submit(data: CreateTestimonialDto, token: string) {
        const response = await fetch(`${API_URL}/testimonials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit testimonial');
        }

        return response.json();
    },

    async getMyTestimonials(token: string) {
        // Assuming there might be an endpoint to see own testimonials
        // If not, we can just use the public one and filter, but usually better to have specific one
        const response = await fetch(`${API_URL}/testimonials/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) return [];
        return response.json();
    }
};
