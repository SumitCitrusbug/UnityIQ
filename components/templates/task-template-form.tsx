'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TaskTemplate, TaskTag, RequiredInput } from '@/lib/types'

const taskTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  expectedOutcome: z.string().optional(),
  tags: z.array(z.enum(['team', 'individual', 'recurring'])).min(1, 'At least one tag is required'),
  requiredInputs: z.array(z.enum(['photo', 'note'])).optional(),
})

type TaskTemplateFormData = z.infer<typeof taskTemplateSchema>

interface TaskTemplateFormProps {
  template?: TaskTemplate
  onSubmit: (data: Omit<TaskTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void
  onCancel: () => void
}

export function TaskTemplateForm({ template, onSubmit, onCancel }: TaskTemplateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<TaskTemplateFormData>({
    resolver: zodResolver(taskTemplateSchema),
    defaultValues: template ? {
      name: template.name,
      department: template.department,
      location: template.location,
      title: template.title,
      description: template.description || '',
      expectedOutcome: template.expectedOutcome || '',
      tags: template.tags,
      requiredInputs: template.requiredInputs,
    } : {
      tags: [],
      requiredInputs: [],
    }
  })

  const watchedTags = watch('tags') || []
  const watchedInputs = watch('requiredInputs') || []

  const handleTagToggle = (tag: TaskTag) => {
    const currentTags = watchedTags
    if (currentTags.includes(tag)) {
      setValue('tags', currentTags.filter(t => t !== tag))
    } else {
      setValue('tags', [...currentTags, tag])
    }
  }

  const handleInputToggle = (input: RequiredInput) => {
    const currentInputs = watchedInputs
    if (currentInputs.includes(input)) {
      setValue('requiredInputs', currentInputs.filter(i => i !== input))
    } else {
      setValue('requiredInputs', [...currentInputs, input])
    }
  }

  const onFormSubmit = (data: TaskTemplateFormData) => {
    onSubmit({
      ...data,
      status: template?.status || 'draft',
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Kitchen Cleanup"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            {...register('department')}
            placeholder="e.g., Operations"
          />
          {errors.department && (
            <p className="text-sm text-red-500">{errors.department.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="e.g., Main Kitchen"
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Daily Kitchen Cleanup"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Detailed task description..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedOutcome">Expected Outcome</Label>
        <textarea
          id="expectedOutcome"
          {...register('expectedOutcome')}
          placeholder="What should be achieved by completing this task?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

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

      <div className="space-y-3">
        <Label>Required Inputs</Label>
        <div className="flex flex-wrap gap-2">
          {(['photo', 'note'] as RequiredInput[]).map((input) => (
            <button
              key={input}
              type="button"
              onClick={() => handleInputToggle(input)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                watchedInputs.includes(input)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {input.charAt(0).toUpperCase() + input.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  )
}
