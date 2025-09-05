'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Clock, 
  Calendar, 
  Target, 
  Award, 
  Briefcase, 
  FileText,
  Upload,
  AlertTriangle
} from 'lucide-react'

const disputeSchema = z.object({
  type: z.enum(['time_clock', 'attendance', 'grove_score', 'bonus', 'task', 'other']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  relatedRecordId: z.string().optional(),
  relatedRecordType: z.string().optional(),
})

type DisputeFormData = z.infer<typeof disputeSchema>

interface DisputeFormProps {
  onSubmit: (dispute: Omit<DisputeFormData, 'id' | 'submittedAt' | 'status'>) => void
  onCancel: () => void
}

const disputeTypes = [
  {
    value: 'time_clock',
    label: 'Time Clock Issue',
    icon: <Clock className="h-4 w-4" />,
    description: 'Problems with clock in/out times, missing punches, or time tracking errors'
  },
  {
    value: 'attendance',
    label: 'Attendance Issue',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Disputes about attendance records, absences, or tardiness'
  },
  {
    value: 'grove_score',
    label: 'Grove Score Issue',
    icon: <Target className="h-4 w-4" />,
    description: 'Disputes about performance scores, task completion ratings, or evaluations'
  },
  {
    value: 'bonus',
    label: 'Bonus Issue',
    icon: <Award className="h-4 w-4" />,
    description: 'Disputes about bonus calculations, missing bonuses, or incentive payments'
  },
  {
    value: 'task',
    label: 'Task Issue',
    icon: <Briefcase className="h-4 w-4" />,
    description: 'Disputes about task assignments, completion status, or task-related problems'
  },
  {
    value: 'other',
    label: 'Other Issue',
    icon: <FileText className="h-4 w-4" />,
    description: 'Any other workplace dispute or issue not covered above'
  }
]

const priorityLevels = [
  { value: 'low', label: 'Low', description: 'Minor issue, can be addressed in normal timeframe' },
  { value: 'medium', label: 'Medium', description: 'Standard issue requiring attention' },
  { value: 'high', label: 'High', description: 'Important issue requiring prompt attention' },
  { value: 'urgent', label: 'Urgent', description: 'Critical issue requiring immediate attention' }
]

export function DisputeForm({ onSubmit, onCancel }: DisputeFormProps) {
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedPriority, setSelectedPriority] = useState<string>('medium')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DisputeFormData>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      priority: 'medium'
    }
  })

  const onFormSubmit = (data: DisputeFormData) => {
    onSubmit(data)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const selectedTypeInfo = disputeTypes.find(t => t.value === selectedType)
  const selectedPriorityInfo = priorityLevels.find(p => p.value === selectedPriority)

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Dispute Type Selection */}
        <div className="space-y-2">
          <Label>Dispute Type *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {disputeTypes.map(type => (
              <div
                key={type.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedType === type.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedType(type.value)
                  setValue('type', type.value as any)
                }}
              >
                <div className="flex items-center space-x-2">
                  {type.icon}
                  <span className="font-medium">{type.label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </div>
            ))}
          </div>
          {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Brief description of the dispute"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Provide detailed information about the dispute, including dates, times, and any relevant context..."
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Priority Selection */}
        <div className="space-y-2">
          <Label>Priority Level *</Label>
          <Select value={selectedPriority} onValueChange={(value) => {
            setSelectedPriority(value)
            setValue('priority', value as any)
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityLevels.map(priority => (
                <SelectItem key={priority.value} value={priority.value}>
                  <div>
                    <div className="font-medium">{priority.label}</div>
                    <div className="text-sm text-gray-600">{priority.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPriorityInfo && (
            <p className="text-sm text-gray-600">{selectedPriorityInfo.description}</p>
          )}
        </div>

        {/* Related Record (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="relatedRecordId">Related Record ID (Optional)</Label>
          <Input
            id="relatedRecordId"
            {...register('relatedRecordId')}
            placeholder="e.g., clock-123, task-456, bonus-789"
          />
          <p className="text-sm text-gray-600">
            If this dispute is related to a specific record (time clock entry, task, etc.), enter its ID here
          </p>
        </div>

        {/* Evidence Upload */}
        <div className="space-y-2">
          <Label>Evidence (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload supporting documents or screenshots</p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Choose Files
            </Button>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploaded Files:</p>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {selectedType && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dispute Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{selectedTypeInfo?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-medium">{selectedPriorityInfo?.label}</span>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Evidence:</span>
                    <span className="font-medium">{uploadedFiles.length} file(s)</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Submit Dispute
          </Button>
        </div>
      </form>
    </div>
  )
}
