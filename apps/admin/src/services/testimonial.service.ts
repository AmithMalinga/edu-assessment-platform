import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: string;
}

export interface CreateTestimonialDto {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    const response = await axios.get(`${API_URL}/testimonials`);
    return response.data;
  },

  async create(data: CreateTestimonialDto): Promise<Testimonial> {
    const response = await axios.post(`${API_URL}/testimonials`, data, getAuthHeader());
    return response.data;
  },

  async update(id: string, data: Partial<CreateTestimonialDto>): Promise<Testimonial> {
    const response = await axios.put(`${API_URL}/testimonials/${id}`, data, getAuthHeader());
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/testimonials/${id}`, getAuthHeader());
  }
};
