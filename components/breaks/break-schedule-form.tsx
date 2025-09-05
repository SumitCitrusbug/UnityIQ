'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Break } from '@/lib/types'

const breakScheduleSchema = z.object({
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  type: z.enum(['lunch', 'break']),
})

type BreakScheduleFormData = z.infer<typeof breakScheduleSchema>

interface BreakScheduleFormProps {
  onSubmit: (breakItem: Break) => void
  onCancel: () => void
}

export function BreakScheduleForm({ onSubmit, onCancel }: BreakScheduleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BreakScheduleFormData>({
    resolver: zodResolver(breakScheduleSchema),
    defaultValues: {
      type: 'break',
    }
  })

  const onFormSubmit = (data: BreakScheduleFormData) => {
    const breakItem: Break = {
      id: Date.now().toString(),
      startTime: new Date(`2024-01-25T${data.startTime}`),
      endTime: new Date(`2024-01-25T${data.endTime}`),
      type: data.type,
      status: 'scheduled',
    }

    onSubmit(breakItem)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="type">Break Type *</Label>
        <select
          id="type"
          {...register('type')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="break">Short Break (15 min)</option>
          <option value="lunch">Lunch Break (30-60 min)</option>
        </select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime')}
          />
          {errors.startTime && (
            <p className="text-sm text-red-500">{errors.startTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            {...register('endTime')}
          />
          {errors.endTime && (
            <p className="text-sm text-red-500">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Break Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Short breaks: 10-15 minutes recommended</li>
          <li>• Lunch breaks: 30-60 minutes recommended</li>
          <li>• Schedule breaks to avoid peak work hours</li>
          <li>• Ensure adequate coverage during break times</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Scheduling...' : 'Schedule Break'}
        </Button>
      </div>
    </form>
  )
}
