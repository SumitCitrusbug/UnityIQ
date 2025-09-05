'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'

const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100, 'Location name must be less than 100 characters'),
  brandId: z.string().min(1, 'Brand is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  storeHours: z.object({
    open: z.string().min(1, 'Open time is required'),
    close: z.string().min(1, 'Close time is required'),
  }),
  approvedIPs: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']),
})

type LocationFormData = z.infer<typeof locationSchema>

interface LocationFormProps {
  location?: any
  brands: Array<{ id: string; name: string }>
  onSubmit: (location: any) => void
  onCancel: () => void
}

const timezones = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
]

export function LocationForm({ location, brands, onSubmit, onCancel }: LocationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || '',
      brandId: location?.brandId || '',
      timezone: location?.timezone || 'America/Los_Angeles',
      storeHours: {
        open: location?.storeHours?.open || '09:00',
        close: location?.storeHours?.close || '21:00',
      },
      approvedIPs: location?.approvedIPs || [],
      status: location?.status || 'active',
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'approvedIPs'
  })

  const watchedOpenTime = watch('storeHours.open')
  const watchedCloseTime = watch('storeHours.close')

  const onFormSubmit = (data: LocationFormData) => {
    const selectedBrand = brands.find(b => b.id === data.brandId)
    const locationData = {
      id: location?.id || Date.now().toString(),
      ...data,
      brand: selectedBrand?.name || '',
      staffCount: location?.staffCount || 0,
      createdAt: location?.createdAt || new Date(),
      createdBy: 'current-user'
    }

    onSubmit(locationData)
  }

  const addIPAddress = () => {
    append('')
  }

  const removeIPAddress = (index: number) => {
    remove(index)
  }

  const validateTimeRange = () => {
    if (watchedOpenTime && watchedCloseTime) {
      const openTime = new Date(`2024-01-01T${watchedOpenTime}`)
      const closeTime = new Date(`2024-01-01T${watchedCloseTime}`)
      return openTime < closeTime
    }
    return true
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Location Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Main Office"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandId">Brand *</Label>
          <select
            id="brandId"
            {...register('brandId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a brand</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="text-sm text-red-500">{errors.brandId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone *</Label>
        <select
          id="timezone"
          {...register('timezone')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {timezones.map(timezone => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
        {errors.timezone && (
          <p className="text-sm text-red-500">{errors.timezone.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="openTime">Store Open Time *</Label>
          <Input
            id="openTime"
            type="time"
            {...register('storeHours.open')}
          />
          {errors.storeHours?.open && (
            <p className="text-sm text-red-500">{errors.storeHours.open.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="closeTime">Store Close Time *</Label>
          <Input
            id="closeTime"
            type="time"
            {...register('storeHours.close')}
          />
          {errors.storeHours?.close && (
            <p className="text-sm text-red-500">{errors.storeHours.close.message}</p>
          )}
        </div>
      </div>

      {!validateTimeRange() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">
              Close time must be after open time
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Approved IP Addresses (Optional)</Label>
        <p className="text-sm text-gray-500">
          Add IP addresses that are allowed for clock-in/clock-out validation
        </p>
        
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                {...register(`approvedIPs.${index}`)}
                placeholder="e.g., 203.0.113.17"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeIPAddress(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addIPAddress}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add IP Address
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Important Notes</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Location names must be unique within each brand</li>
          <li>• Store hours are used for shift scheduling and validation</li>
          <li>• Approved IPs are used for time clock validation</li>
          <li>• You can test IP validation after saving the location</li>
          <li>• Inactive locations cannot be assigned to new shifts</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !validateTimeRange()}>
          {isSubmitting ? 'Saving...' : location ? 'Update Location' : 'Create Location'}
        </Button>
      </div>
    </form>
  )
}
