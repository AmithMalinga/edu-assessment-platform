import { useState, useEffect, useCallback } from 'react';
import { testimonialService, Testimonial } from '../services/testimonial.service';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAll();
      setTestimonials(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const deleteTestimonial = async (id: string) => {
    try {
      await testimonialService.delete(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete testimonial');
      return false;
    }
  };

  return { 
    testimonials, 
    loading, 
    error, 
    refresh: fetchTestimonials,
    deleteTestimonial
  };
};
