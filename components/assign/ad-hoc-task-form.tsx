'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Task, TaskAssignee, RequiredInput, TaskTag } from '@/lib/types'
import { Camera, FileText } from 'lucide-react'

const adHocTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  assigneeType: z.enum(['individual', 'team', 'role']),
  assigneeId: z.string().min(1, 'Please select an assignee'),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().min(1, 'Due time is required'),
  windowStart: z.string().optional(),
  windowEnd: z.string().optional(),
  description: z.string().optional(),
  requiredInputs: z.array(z.enum(['photo', 'note'])).optional(),
  tags: z.array(z.enum(['team', 'individual', 'recurring'])).min(1, 'At least one tag is required'),
})

type AdHocTaskFormData = z.infer<typeof adHocTaskSchema>

interface AdHocTaskFormProps {
  onSubmit: (task: Task) => void
  onCancel: () => void
}

// Mock data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'staff', department: 'Operations' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'staff', department: 'Operations' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'staff', department: 'Maintenance' },
]

const mockTeams = [
  { id: '1', name: 'Kitchen Staff', members: ['1', '2'] },
  { id: '2', name: 'Maintenance Team', members: ['3'] },
]

const mockRoles = [
  { id: '1', name: 'All Staff', description: 'All staff members' },
  { id: '2', name: 'Operations Team', description: 'Operations department staff' },
]

export function AdHocTaskForm({ onSubmit, onCancel }: AdHocTaskFormProps) {
  const [selectedAssignee, setSelectedAssignee] = useState<any>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AdHocTaskFormData>({
    resolver: zodResolver(adHocTaskSchema),
    defaultValues: {
      tags: [],
      requiredInputs: [],
    }
  })

  const assigneeType = watch('assigneeType')
  const watchedInputs = watch('requiredInputs') || []
  const watchedTags = watch('tags') || []

  const handleAssigneeTypeChange = (type: 'individual' | 'team' | 'role') => {
    setValue('assigneeType', type)
    setValue('assigneeId', '')
    setSelectedAssignee(null)
  }

  const handleAssigneeSelect = (assignee: any) => {
    setSelectedAssignee(assignee)
    setValue('assigneeId', assignee.id)
  }

  const handleInputToggle = (input: RequiredInput) => {
    const currentInputs = watchedInputs
    if (currentInputs.includes(input)) {
      setValue('requiredInputs', currentInputs.filter(i => i !== input))
    } else {
      setValue('requiredInputs', [...currentInputs, input])
    }
  }

  const handleTagToggle = (tag: TaskTag) => {
    const currentTags = watchedTags
    if (currentTags.includes(tag)) {
      setValue('tags', currentTags.filter(t => t !== tag))
    } else {
      setValue('tags', [...currentTags, tag])
    }
  }

  const onFormSubmit = (data: AdHocTaskFormData) => {
    const dueDateTime = new Date(`${data.dueDate}T${data.dueTime}`)
    const windowStart = data.windowStart ? new Date(`${data.dueDate}T${data.windowStart}`) : undefined
    const windowEnd = data.windowEnd ? new Date(`${data.dueDate}T${data.windowEnd}`) : undefined

    const task: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      location: data.location,
      assignee: {
        type: data.assigneeType,
        id: data.assigneeId,
        name: selectedAssignee.name,
      },
      dueDate: dueDateTime,
      windowStart,
      windowEnd,
      requiredInputs: data.requiredInputs || [],
      status: 'assigned',
      isAdHoc: true,
      createdAt: new Date(),
      createdBy: 'current-user',
    }

    onSubmit(task)
  }

  const getAssigneeOptions = () => {
    switch (assigneeType) {
      case 'individual':
        return mockUsers
      case 'team':
        return mockTeams
      case 'role':
        return mockRoles
      default:
        return []
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Task Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Enter task description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>

      {/* Assignee Selection */}
      <div className="space-y-4">
        <div>
          <Label>Assign To *</Label>
          <div className="flex space-x-2 mt-2">
            <Button
              type="button"
              variant={assigneeType === 'individual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAssigneeTypeChange('individual')}
            >
              Individual
            </Button>
            <Button
              type="button"
              variant={assigneeType === 'team' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAssigneeTypeChange('team')}
            >
              Team
            </Button>
            <Button
              type="button"
              variant={assigneeType === 'role' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAssigneeTypeChange('role')}
            >
              Role
            </Button>
          </div>
        </div>

        {assigneeType && (
          <div>
            <Label>Select {assigneeType === 'individual' ? 'Person' : assigneeType === 'team' ? 'Team' : 'Role'}</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md">
              {getAssigneeOptions().map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleAssigneeSelect(option)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0 ${
                    selectedAssignee?.id === option.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="font-medium">{option.name}</div>
                  {option.email && <div className="text-sm text-gray-500">{option.email}</div>}
                  {option.description && <div className="text-sm text-gray-500">{option.description}</div>}
                  {option.members && <div className="text-sm text-gray-500">{option.members.length} members</div>}
                </button>
              ))}
            </div>
            {errors.assigneeId && (
              <p className="text-sm text-red-500 mt-1">{errors.assigneeId.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Due Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...register('dueDate')}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueTime">Due Time *</Label>
          <Input
            id="dueTime"
            type="time"
            {...register('dueTime')}
          />
          {errors.dueTime && (
            <p className="text-sm text-red-500">{errors.dueTime.message}</p>
          )}
        </div>
      </div>

      {/* Completion Window */}
      <div className="space-y-4">
        <div>
          <Label>Completion Window (Optional)</Label>
          <p className="text-sm text-gray-500">Define when the task can be completed</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="windowStart">Window Start</Label>
            <Input
              id="windowStart"
              type="time"
              {...register('windowStart')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="windowEnd">Window End</Label>
            <Input
              id="windowEnd"
              type="time"
              {...register('windowEnd')}
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <Label>Tags *</Label>
        <div className="flex flex-wrap gap-2">
          {(['team', 'individual', 'recurring'] as TaskTag[]).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                watchedTags.includes(tag)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
        {errors.tags && (
          <p className="text-sm text-red-500">{errors.tags.message}</p>
        )}
      </div>

      {/* Required Inputs */}
      <div className="space-y-3">
        <Label>Required Inputs</Label>
        <div className="flex space-x-4">
          {(['photo', 'note'] as RequiredInput[]).map((input) => (
            <label key={input} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={watchedInputs.includes(input)}
                onChange={() => handleInputToggle(input)}
                className="rounded border-gray-300"
              />
              <div className="flex items-center space-x-1">
                {input === 'photo' ? (
                  <Camera className="h-4 w-4 text-gray-500" />
                ) : (
                  <FileText className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm capitalize">{input}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
