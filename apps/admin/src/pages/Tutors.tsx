import { useEffect, useState } from 'react'
import { adminTutorService } from '../services/admin-tutor.service'
import { Loader2, Check, X, Eye, Mail, Phone, BookOpen, Users } from 'lucide-react'

interface TutorRegistration {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  studentCount: string
  username: string
  status: string
  createdAt: string
  rejectionReason?: string
}

interface SelectedTutor {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  studentCount: string
  username: string
  status: string
  createdAt: string
  rejectionReason?: string
}

export default function Tutors() {
  const [registrations, setRegistrations] = useState<TutorRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [selectedTutor, setSelectedTutor] = useState<SelectedTutor | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('PENDING')
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionValidationError, setRejectionValidationError] = useState<string | null>(null)

  useEffect(() => {
    loadRegistrations()
  }, [statusFilter])

  const loadRegistrations = async () => {
    setIsLoading(true)
    setError(null)
    setActionError(null)
    try {
      const token = localStorage.getItem('token')
      const data = await adminTutorService.getTutorRegistrations(statusFilter, token || undefined)
      setRegistrations(data || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveTutor = async (id: string) => {
    setIsProcessing(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const token = localStorage.getItem('token')
      await adminTutorService.approveTutorRegistration(id, token || undefined)
      setRegistrations(registrations.filter(r => r.id !== id))
      setSelectedTutor(null)
      setActionSuccess('Tutor approved successfully. Credentials were sent via email.')
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectTutor = async (id: string) => {
    if (!rejectionReason.trim()) {
      setRejectionValidationError('Please provide a rejection reason before rejecting.')
      return
    }

    setIsProcessing(true)
    setActionError(null)
    setActionSuccess(null)
    setRejectionValidationError(null)
    try {
      const token = localStorage.getItem('token')
      await adminTutorService.rejectTutorRegistration(id, rejectionReason, token || undefined)
      setRegistrations(registrations.filter(r => r.id !== id))
      setSelectedTutor(null)
      setRejectionReason('')
      setActionSuccess('Tutor registration rejected successfully.')
    } catch (err) {
      setActionError((err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStudentCountLabel = (count: string) => {
    const mapping: { [key: string]: string } = {
      ZERO_FIFTY: '0-50 students',
      FIFTY_FIVE_HUNDRED: '50-500 students',
      FIVE_HUNDRED_PLUS: '500+ students',
    }
    return mapping[count] || count
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tutor Registration Requests</h1>
        <p className="text-gray-500 mt-2">Review and manage tutor registration applications</p>
      </div>

      {actionSuccess && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Action failed</p>
          <p className="mt-1 whitespace-pre-wrap">{actionError}</p>
        </div>
      )}

      {/* Status Filter */}
      <div className="flex gap-4">
        {['PENDING', 'APPROVED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Registration List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                <p>Error: {error}</p>
                <button
                  onClick={loadRegistrations}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No {statusFilter.toLowerCase()} tutor registrations found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Applied</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(registration => (
                      <tr
                        key={registration.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedTutor(registration)}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{registration.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{registration.subject}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">@{registration.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTutor(registration)
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div>
          {selectedTutor ? (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900">Application Details</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase">Name</p>
                  <p className="text-gray-900 font-medium">{selectedTutor.name}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="text-gray-900">{selectedTutor.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone
                  </p>
                  <p className="text-gray-900">{selectedTutor.phone}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Subject
                  </p>
                  <p className="text-gray-900 font-medium text-blue-600">{selectedTutor.subject}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase flex items-center gap-1">
                    <Users className="h-3 w-3" /> Students
                  </p>
                  <p className="text-gray-900">{getStudentCountLabel(selectedTutor.studentCount)}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase">Username</p>
                  <p className="text-gray-900 font-mono">@{selectedTutor.username}</p>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-gray-500 text-xs uppercase">Applied</p>
                  <p className="text-gray-900">
                    {new Date(selectedTutor.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {selectedTutor.rejectionReason && (
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <p className="text-gray-500 text-xs uppercase">Rejection Reason</p>
                    <p className="text-red-700 text-sm">{selectedTutor.rejectionReason}</p>
                  </div>
                )}
              </div>

              {selectedTutor.status === 'PENDING' && (
                <div className="space-y-3 pt-4 border-t">
                  <button
                    onClick={() => handleApproveTutor(selectedTutor.id)}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Approve
                  </button>

                  <div>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => {
                        setRejectionReason(e.target.value)
                        if (rejectionValidationError && e.target.value.trim()) {
                          setRejectionValidationError(null)
                        }
                      }}
                      placeholder="Rejection reason (required)"
                      className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                        rejectionValidationError ? 'border-red-400 focus:ring-red-300' : 'focus:ring-blue-500'
                      }`}
                      rows={3}
                    />
                    {rejectionValidationError && (
                      <p className="mt-1 text-xs text-red-600">{rejectionValidationError}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRejectTutor(selectedTutor.id)}
                    disabled={isProcessing || !rejectionReason.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Reject
                  </button>
                </div>
              )}

              {selectedTutor.status !== 'PENDING' && (
                <div className={`p-3 rounded-lg text-sm text-center ${
                  selectedTutor.status === 'APPROVED'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  Already {selectedTutor.status.toLowerCase()}
                </div>
              )}

              <button
                onClick={() => setSelectedTutor(null)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              <p>Select a registration to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
