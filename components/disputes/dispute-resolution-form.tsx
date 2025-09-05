'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { TaskDispute } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const resolutionSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  resolution: z.string().min(1, 'Resolution is required'),
})

type ResolutionFormData = z.infer<typeof resolutionSchema>

interface DisputeResolutionFormProps {
  dispute: TaskDispute
  onSubmit: (resolution: any) => void
  onCancel: () => void
}

export function DisputeResolutionForm({ dispute, onSubmit, onCancel }: DisputeResolutionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ResolutionFormData>({
    resolver: zodResolver(resolutionSchema),
  })

  const decision = watch('decision')

  const onFormSubmit = (data: ResolutionFormData) => {
    const resolution = {
      decision: data.decision,
      resolution: data.resolution,
      resolvedAt: new Date(),
      resolvedBy: 'current-user',
    }

    onSubmit(resolution)
  }

  return (
    <div className="space-y-6">
      {/* Dispute Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Dispute Details</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Submitted by:</span> {dispute.submittedBy}
          </div>
          <div>
            <span className="font-medium">Submitted at:</span> {formatDateTime(dispute.submittedAt)}
          </div>
          <div>
            <span className="font-medium">Reason:</span> {dispute.reason}
          </div>
          {dispute.proof && (
            <div>
              <span className="font-medium">Evidence:</span> {dispute.proof}
            </div>
          )}
        </div>
      </div>

      {/* Resolution Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Label>Decision</Label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="approve"
                {...register('decision')}
                className="text-green-600"
              />
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Approve Dispute</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="reject"
                {...register('decision')}
                className="text-red-600"
              />
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Reject Dispute</span>
            </label>
          </div>
          {errors.decision && (
            <p className="text-sm text-red-500">{errors.decision.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="resolution">Resolution Details *</Label>
          <textarea
            id="resolution"
            {...register('resolution')}
            placeholder="Provide detailed explanation of your decision..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          {errors.resolution && (
            <p className="text-sm text-red-500">{errors.resolution.message}</p>
          )}
        </div>

        {/* Decision Impact */}
        {decision && (
          <div className={`p-4 rounded-lg border ${
            decision === 'approve' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {decision === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${
                decision === 'approve' ? 'text-green-800' : 'text-red-800'
              }`}>
                {decision === 'approve' ? 'Approving' : 'Rejecting'} Dispute
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              decision === 'approve' ? 'text-green-700' : 'text-red-700'
            }`}>
              {decision === 'approve' 
                ? 'The original task grade will be changed to "Pass" and the employee\'s score will be updated accordingly.'
                : 'The original task grade will remain as "Fail" and the employee\'s score will not be affected.'
              }
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            variant={decision === 'reject' ? 'destructive' : 'default'}
          >
            {isSubmitting ? 'Resolving...' : `Resolve as ${decision?.toUpperCase()}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
