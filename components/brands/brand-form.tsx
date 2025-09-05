'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(100, 'Brand name must be less than 100 characters'),
  status: z.enum(['active', 'archived']),
})

type BrandFormData = z.infer<typeof brandSchema>

interface BrandFormProps {
  brand?: any
  onSubmit: (brand: any) => void
  onCancel: () => void
}

export function BrandForm({ brand, onSubmit, onCancel }: BrandFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || '',
      status: brand?.status || 'active',
    }
  })

  const onFormSubmit = (data: BrandFormData) => {
    const brandData = {
      id: brand?.id || Date.now().toString(),
      ...data,
      createdAt: brand?.createdAt || new Date(),
      createdBy: 'current-user',
      locationCount: brand?.locationCount || 0,
      staffCount: brand?.staffCount || 0
    }

    onSubmit(brandData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Brand Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Craft Therapy Network"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Important Notes</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Brand names must be unique across the system</li>
          <li>• Archived brands cannot be assigned to new locations or staff</li>
          <li>• You cannot delete brands that have active locations</li>
          <li>• All changes are audit logged for compliance</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : brand ? 'Update Brand' : 'Create Brand'}
        </Button>
      </div>
    </form>
  )
}
