'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Task, TaskProof, RequiredInput } from '@/lib/types'
import { Camera, FileText, Upload, X } from 'lucide-react'

const completionSchema = z.object({
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
})

type CompletionFormData = z.infer<typeof completionSchema>

interface TaskCompletionFormProps {
  task: Task
  onSubmit: (proof: TaskProof) => void
  onCancel: () => void
}

export function TaskCompletionForm({ task, onSubmit, onCancel }: TaskCompletionFormProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CompletionFormData>({
    resolver: zodResolver(completionSchema),
  })

  const notes = watch('notes')

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    
    // Simulate photo upload
    setTimeout(() => {
      const newPhotos = Array.from(files).map((file, index) => 
        `photo_${Date.now()}_${index}.jpg`
      )
      setPhotos(prev => [...prev, ...newPhotos])
      setIsUploading(false)
    }, 1000)
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const onFormSubmit = (data: CompletionFormData) => {
    const proof: TaskProof = {
      photos: photos.length > 0 ? photos : undefined,
      notes: data.notes || undefined,
      submittedAt: new Date(),
      submittedBy: 'current-user',
    }

    onSubmit(proof)
  }

  const isRequiredInputMissing = () => {
    const requiredPhoto = task.requiredInputs.includes('photo')
    const requiredNote = task.requiredInputs.includes('note')
    
    const hasPhoto = photos.length > 0
    const hasNote = notes && notes.trim().length > 0
    
    return (requiredPhoto && !hasPhoto) || (requiredNote && !hasNote)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Task Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <span>Location: {task.location}</span>
          <span>Due: {task.dueDate.toLocaleString()}</span>
        </div>
      </div>

      {/* Required Inputs */}
      {task.requiredInputs.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Required Inputs</h4>
          
          {task.requiredInputs.includes('photo') && (
            <div className="space-y-3">
              <Label>Photos *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploading ? 'Uploading...' : 'Upload Photos'}
                    </label>
                    <p className="text-xs text-gray-500">
                      Upload photos as proof of completion
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {task.requiredInputs.includes('note') && (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes *</Label>
              <textarea
                id="notes"
                {...register('notes')}
                placeholder="Describe what was completed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Optional Additional Notes */}
      {!task.requiredInputs.includes('note') && (
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <textarea
            id="notes"
            {...register('notes')}
            placeholder="Any additional information about the completion..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )}

      {/* Validation Message */}
      {isRequiredInputMissing() && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">
            Please provide all required inputs before submitting.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || isRequiredInputMissing() || isUploading}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Completion'}
        </Button>
      </div>
    </form>
  )
}
