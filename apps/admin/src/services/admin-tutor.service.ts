import api from '../api/client'

type ApiErrorBody = {
  message?: string | string[]
  details?: string[]
  conflicts?: string[]
}

const extractErrorMessage = (error: unknown, fallback: string) => {
  const maybeError = error as {
    response?: {
      data?: ApiErrorBody
      status?: number
    }
    message?: string
  }

  const body = maybeError.response?.data
  const messages: string[] = []

  if (Array.isArray(body?.message)) {
    messages.push(...body.message)
  } else if (typeof body?.message === 'string') {
    messages.push(body.message)
  }

  if (Array.isArray(body?.details) && body.details.length > 0) {
    messages.push(...body.details)
  }

  if (Array.isArray(body?.conflicts) && body.conflicts.length > 0) {
    messages.push(`Conflicting fields: ${body.conflicts.join(', ')}`)
  }

  if (messages.length > 0) {
    return messages.join(' ')
  }

  return maybeError.message || fallback
}

export const adminTutorService = {
  /**
   * Get all tutor registrations with optional status filter
   */
  async getTutorRegistrations(status?: string, token?: string) {
    try {
      const response = await api.get('/tutors/registrations', {
        params: status ? { status } : undefined,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Failed to fetch tutor registrations.'))
    }
  },

  /**
   * Get single tutor registration
   */
  async getTutorRegistration(id: string, token?: string) {
    try {
      const response = await api.get(`/tutors/registrations/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Failed to fetch tutor registration.'))
    }
  },

  /**
   * Approve tutor registration
   */
  async approveTutorRegistration(id: string, token?: string) {
    try {
      const response = await api.patch(
        `/tutors/registrations/${id}/approve`,
        undefined,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      )
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Failed to approve tutor registration.'))
    }
  },

  /**
   * Reject tutor registration
   */
  async rejectTutorRegistration(id: string, rejectionReason?: string, token?: string) {
    try {
      const response = await api.patch(
        `/tutors/registrations/${id}/reject`,
        { rejectionReason },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      )
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Failed to reject tutor registration.'))
    }
  },
}
