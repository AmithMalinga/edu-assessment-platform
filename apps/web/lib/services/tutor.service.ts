import { StudentProfile } from './student.service';

export interface TutorProfile extends StudentProfile {
  subject: string;
  studentCount: string;
  bio?: string;
  username: string;
}

export const tutorService = {
  /**
   * Register as a tutor
   */
  async registerTutor(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    studentCount: string;
    username: string;
    agreedToTerms: boolean;
  }) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  /**
   * Check if username is available
   */
  async checkUsername(username: string): Promise<{ available: boolean }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tutors/check-username`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        // If 409 or other error, username is taken
        return { available: false };
      }

      return response.json();
    } catch {
      return { available: false };
    }
  },

  /**
   * Get tutor profile
   */
  async getProfile(token: string): Promise<TutorProfile> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch profile.');
    }

    return result;
  },

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password change failed');
    }

    return response.json();
  },

  /**
   * Get or generate tutor code
   */
  async getTutorCode(token: string): Promise<{ tutorCode: string }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors/code`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tutor code');
    }

    return response.json();
  },

  /**
   * Assign a student to a tutor by code
   */
  async assignStudentToTutor(
    token: string,
    tutorCode: string,
    consentGiven: boolean
  ): Promise<{ message: string; tutorName: string }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors/assign`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tutorCode, consentGiven }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to assign to tutor');
    }

    return response.json();
  },

  /**
   * Get students belonging to a tutor
   */
  async getTutorStudents(token: string): Promise<any[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors/students`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch students');
    }

    return response.json();
  },

  /**
   * Get tutors belonging to a student
   */
  async getStudentTutors(token: string): Promise<any[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors/my-tutors`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tutors');
    }

    return response.json();
  },

  /**
   * Remove a tutor assignment
   */
  async removeTutor(tutorId: string, token: string): Promise<{ message: string }> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutors/${tutorId}/remove`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove tutor');
    }

    return response.json();
  }
};

