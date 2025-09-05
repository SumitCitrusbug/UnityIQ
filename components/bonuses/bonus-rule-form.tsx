'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const bonusRuleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['attendance', 'performance', 'teamwork', 'safety']),
  target: z.number().min(0, 'Target must be positive'),
  bonus: z.number().min(0, 'Bonus must be positive'),
})

type BonusRuleFormData = z.infer<typeof bonusRuleSchema>

interface BonusRuleFormProps {
  onSubmit: (rule: any) => void
  onCancel: () => void
}

export function BonusRuleForm({ onSubmit, onCancel }: BonusRuleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BonusRuleFormData>({
    resolver: zodResolver(bonusRuleSchema),
    defaultValues: {
      type: 'performance',
    }
  })

  const onFormSubmit = (data: BonusRuleFormData) => {
    const rule = {
      id: Date.now().toString(),
      ...data,
      status: 'active',
      createdAt: new Date(),
      createdBy: 'current-user'
    }

    onSubmit(rule)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Rule Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Perfect Attendance Bonus"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Describe what this bonus rewards..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Bonus Type *</Label>
        <select
          id="type"
          {...register('type')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="attendance">Attendance</option>
          <option value="performance">Performance</option>
          <option value="teamwork">Teamwork</option>
          <option value="safety">Safety</option>
        </select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target (%) *</Label>
          <Input
            id="target"
            type="number"
            min="0"
            max="100"
            {...register('target', { valueAsNumber: true })}
            placeholder="e.g., 95"
          />
          {errors.target && (
            <p className="text-sm text-red-500">{errors.target.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bonus">Bonus Amount ($) *</Label>
          <Input
            id="bonus"
            type="number"
            min="0"
            {...register('bonus', { valueAsNumber: true })}
            placeholder="e.g., 100"
          />
          {errors.bonus && (
            <p className="text-sm text-red-500">{errors.bonus.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Bonus Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Attendance bonuses: Reward consistent attendance (95-100%)</li>
          <li>• Performance bonuses: Reward high task completion rates</li>
          <li>• Teamwork bonuses: Reward helping colleagues and collaboration</li>
          <li>• Safety bonuses: Reward following safety protocols</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Rule'}
        </Button>
      </div>
    </form>
  )
}
