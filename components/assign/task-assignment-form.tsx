'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TaskTemplate, Task, TaskAssignee, RequiredInput } from '@/lib/types'
import { Calendar, Clock, Users, User, Building, FileText, Camera } from 'lucide-react'

const assignmentSchema = z.object({
  assigneeType: z.enum(['individual', 'team', 'role']),
  assigneeId: z.string().min(1, 'Please select an assignee'),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().min(1, 'Due time is required'),
  windowStart: z.string().optional(),
  windowEnd: z.string().optional(),
  notes: z.string().optional(),
  requiredInputs: z.array(z.enum(['photo', 'note'])).optional(),
})

type AssignmentFormData = z.infer<typeof assignmentSchema>

interface TaskAssignmentFormProps {
  template: TaskTemplate
  users: Array<{ id: string; name: string; email: string; role: string; department: string }>
  teams: Array<{ id: string; name: string; members: string[] }>
  roles: Array<{ id: string; name: string; description: string }>
  onSubmit: (task: Task) => void
  onCancel: () => void
}

export function TaskAssignmentForm({ 
  template, 
  users, 
  teams, 
  roles, 
  onSubmit, 
  onCancel 
}: TaskAssignmentFormProps) {
  const [selectedAssignee, setSelectedAssignee] = useState<any>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      requiredInputs: template.requiredInputs,
    }
  })

  const assigneeType = watch('assigneeType')
  const watchedInputs = watch('requiredInputs') || []

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

  const onFormSubmit = (data: AssignmentFormData) => {
    const dueDateTime = new Date(`${data.dueDate}T${data.dueTime}`)
    const windowStart = data.windowStart ? new Date(`${data.dueDate}T${data.windowStart}`) : undefined
    const windowEnd = data.windowEnd ? new Date(`${data.dueDate}T${data.windowEnd}`) : undefined

    const task: Task = {
      id: Date.now().toString(),
      templateId: template.id,
      title: template.title,
      description: template.description,
      location: template.location,
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
      isAdHoc: false,
      createdAt: new Date(),
      createdBy: 'current-user',
    }

    onSubmit(task)
  }

  const getAssigneeOptions = () => {
    switch (assigneeType) {
      case 'individual':
        return users
      case 'team':
        return teams
      case 'role':
        return roles
      default:
        return []
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Template Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Template: {template.name}</h3>
        <p className="text-sm text-gray-600">{template.title}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Building className="h-3 w-3" />
            <span>{template.department}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{template.location}</span>
          </div>
        </div>
      </div>

      {/* Assignee Selection */}
      <div className="space-y-4">
        <div>
          <Label>Assign To</Label>
          <div className="flex space-x-2 mt-2">
            <Button
              type="button"
              variant={assigneeType === 'individual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAssigneeTypeChange('individual')}
            >
              <User className="mr-1 h-3 w-3" />
              Individual
            </Button>
            <Button
              type="button"
              variant={assigneeType === 'team' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAssigneeTypeChange('team')}
            >
              <Users className="mr-1 h-3 w-3" />
              Team
            </Button>
            <Button
              type="button"
              variant={assigneeType === 'role' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAssigneeTypeChange('role')}
            >
              <Building className="mr-1 h-3 w-3" />
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

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <textarea
          id="notes"
          {...register('notes')}
          placeholder="Any additional instructions or notes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Assigning...' : 'Assign Task'}
        </Button>
      </div>
    </form>
  )
}
