'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, User } from 'lucide-react'

const shiftSwapSchema = z.object({
  originalShiftId: z.string().min(1, 'Please select your shift'),
  requestedShiftId: z.string().min(1, 'Please select the shift to swap with'),
  reason: z.string().min(1, 'Reason is required'),
})

type ShiftSwapFormData = z.infer<typeof shiftSwapSchema>

interface ShiftSwapFormProps {
  onSubmit: (swap: any) => void
  onCancel: () => void
}

// Mock data for available shifts
const mockAvailableShifts = [
  {
    id: '1',
    title: 'Morning Shift',
    date: new Date('2024-01-26T09:00:00'),
    assignedTo: 'John Doe',
    location: 'Main Office'
  },
  {
    id: '2',
    title: 'Evening Shift',
    date: new Date('2024-01-27T17:00:00'),
    assignedTo: 'Jane Smith',
    location: 'Main Office'
  },
  {
    id: '3',
    title: 'Weekend Shift',
    date: new Date('2024-01-28T10:00:00'),
    assignedTo: 'Mike Johnson',
    location: 'Branch Office'
  }
]

export function ShiftSwapForm({ onSubmit, onCancel }: ShiftSwapFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ShiftSwapFormData>({
    resolver: zodResolver(shiftSwapSchema),
  })

  const originalShiftId = watch('originalShiftId')
  const requestedShiftId = watch('requestedShiftId')

  const onFormSubmit = (data: ShiftSwapFormData) => {
    const originalShift = mockAvailableShifts.find(s => s.id === data.originalShiftId)
    const requestedShift = mockAvailableShifts.find(s => s.id === data.requestedShiftId)

    const swap = {
      id: Date.now().toString(),
      originalShift,
      requestedSwap: requestedShift,
      status: 'pending',
      submittedAt: new Date(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      reason: data.reason
    }

    onSubmit(swap)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="originalShiftId">Your Shift *</Label>
        <select
          id="originalShiftId"
          {...register('originalShiftId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select your shift</option>
          {mockAvailableShifts.map((shift) => (
            <option key={shift.id} value={shift.id}>
              {shift.title} - {shift.date.toLocaleDateString()} at {shift.date.toLocaleTimeString()}
            </option>
          ))}
        </select>
        {errors.originalShiftId && (
          <p className="text-sm text-red-500">{errors.originalShiftId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="requestedShiftId">Shift to Swap With *</Label>
        <select
          id="requestedShiftId"
          {...register('requestedShiftId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select shift to swap with</option>
          {mockAvailableShifts
            .filter(shift => shift.id !== originalShiftId)
            .map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.title} - {shift.date.toLocaleDateString()} at {shift.date.toLocaleTimeString()}
              </option>
            ))}
        </select>
        {errors.requestedShiftId && (
          <p className="text-sm text-red-500">{errors.requestedShiftId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Swap *</Label>
        <textarea
          id="reason"
          {...register('reason')}
          placeholder="Please explain why you need to swap shifts..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        {errors.reason && (
          <p className="text-sm text-red-500">{errors.reason.message}</p>
        )}
      </div>

      {/* Selected Shifts Preview */}
      {originalShiftId && requestedShiftId && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Swap Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border">
              <h5 className="font-medium text-gray-700 mb-2">Your Current Shift</h5>
              {(() => {
                const shift = mockAvailableShifts.find(s => s.id === originalShiftId)
                return shift ? (
                  <div className="space-y-1 text-sm">
                    <p><strong>{shift.title}</strong></p>
                    <p className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{shift.date.toLocaleDateString()}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{shift.assignedTo}</span>
                    </p>
                  </div>
                ) : null
              })()}
            </div>
            <div className="bg-blue-50 p-3 rounded border">
              <h5 className="font-medium text-gray-700 mb-2">Requested Shift</h5>
              {(() => {
                const shift = mockAvailableShifts.find(s => s.id === requestedShiftId)
                return shift ? (
                  <div className="space-y-1 text-sm">
                    <p><strong>{shift.title}</strong></p>
                    <p className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{shift.date.toLocaleDateString()}</span>
                    </p>
                    <p className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{shift.assignedTo}</span>
                    </p>
                  </div>
                ) : null
              })()}
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Swap requests expire after 8 hours</li>
          <li>• Both employees must agree to the swap</li>
          <li>• Manager approval may be required</li>
          <li>• Swaps cannot be made less than 24 hours before shift start</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Request Swap'}
        </Button>
      </div>
    </form>
  )
}
