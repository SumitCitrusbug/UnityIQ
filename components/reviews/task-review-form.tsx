'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Task, TaskGrade } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, XCircle, Camera, FileText, AlertTriangle } from 'lucide-react'

const reviewSchema = z.object({
  result: z.enum(['pass', 'fail']),
  reason: z.string().optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface TaskReviewFormProps {
  task: Task
  onSubmit: (grade: TaskGrade) => void
  onCancel: () => void
}

export function TaskReviewForm({ task, onSubmit, onCancel }: TaskReviewFormProps) {
  const [selectedResult, setSelectedResult] = useState<'pass' | 'fail' | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  })

  const onFormSubmit = (data: ReviewFormData) => {
    const grade: TaskGrade = {
      result: data.result,
      reason: data.reason,
      gradedAt: new Date(),
      gradedBy: 'current-user',
    }

    onSubmit(grade)
  }

  return (
    <div className="space-y-6">
      {/* Task Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Location:</span> {task.location}
          </div>
          <div>
            <span className="font-medium">Completed by:</span> {task.completedBy}
          </div>
          <div>
            <span className="font-medium">Completed at:</span> {formatDateTime(task.completedAt!)}
          </div>
          <div>
            <span className="font-medium">Due date:</span> {formatDateTime(task.dueDate)}
          </div>
        </div>
      </div>

      {/* Proof of Completion */}
      {task.proof && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Proof of Completion</h4>
          
          {task.proof.notes && (
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-sm">Notes</span>
              </div>
              <p className="text-sm text-gray-600">{task.proof.notes}</p>
            </div>
          )}

          {task.proof.photos && task.proof.photos.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Camera className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-sm">Photos ({task.proof.photos.length})</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {task.proof.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Label>Grade</Label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setSelectedResult('pass')}
              className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
                selectedResult === 'pass'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Pass</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedResult('fail')}
              className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
                selectedResult === 'fail'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Fail</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason (Optional)</Label>
          <textarea
            id="reason"
            {...register('reason')}
            placeholder="Provide feedback or reason for the grade..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          {errors.reason && (
            <p className="text-sm text-red-500">{errors.reason.message}</p>
          )}
        </div>

        {/* Warning for failed tasks */}
        {selectedResult === 'fail' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Failed Task</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              This task will be marked as failed and may impact the employee's score. 
              Consider providing detailed feedback for improvement.
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !selectedResult}
            variant={selectedResult === 'fail' ? 'destructive' : 'default'}
          >
            {isSubmitting ? 'Submitting...' : `Grade as ${selectedResult?.toUpperCase()}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
