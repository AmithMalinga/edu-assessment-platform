export interface Testimonial {
    id: string
    name: string
    role: string
    avatar: string | null
    rating: number
    content: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const landingService = {
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
