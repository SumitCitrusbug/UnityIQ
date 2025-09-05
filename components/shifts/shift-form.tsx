'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shift, Break, RecurrencePattern } from '@/lib/types'
import { Plus, Trash2, Clock, Repeat, Calendar } from 'lucide-react'

const shiftSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  brandId: z.string().min(1, 'Brand is required'),
  locationId: z.string().min(1, 'Location is required'),
  assignedTo: z.string().min(1, 'Please select an employee'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  shiftType: z.enum(['full', 'split']),
  breaks: z.array(z.object({
    type: z.enum(['lunch', 'break']),
    startTime: z.string(),
    endTime: z.string(),
  })).optional(),
  isRecurring: z.boolean().optional(),
  recurrenceType: z.enum(['daily', 'weekly', 'monthly']).optional(),
  recurrenceInterval: z.number().min(1).optional(),
  recurrenceDays: z.array(z.number()).optional(),
  recurrenceEndDate: z.string().optional(),
  recurrenceOccurrences: z.number().min(1).optional(),
})

type ShiftFormData = z.infer<typeof shiftSchema>

interface ShiftFormProps {
  shift?: Shift
  users: Array<{ id: string; name: string; email: string; role: string }>
  onSubmit: (shift: Omit<Shift, 'id' | 'createdAt' | 'createdBy'>) => void
  onCancel: () => void
}

// Mock data for brands and locations
const mockBrands = [
  { id: '1', name: 'Craft Therapy Network' },
  { id: '2', name: 'Shroom Groove' }
]

const mockLocations = [
  { id: '1', name: 'Main Office', brandId: '1' },
  { id: '2', name: 'Branch Office', brandId: '1' },
  { id: '3', name: 'Downtown Store', brandId: '2' }
]

const mockRoles = ['Staff', 'Manager', 'Supervisor', 'Cashier', 'Maintenance']

export function ShiftForm({ shift, users, onSubmit, onCancel }: ShiftFormProps) {
  const [breaks, setBreaks] = useState<Array<{ type: 'lunch' | 'break'; startTime: string; endTime: string }>>(
    shift?.breaks?.map(b => ({
      type: b.type,
      startTime: b.startTime.toTimeString().slice(0, 5),
      endTime: (b.endTime || b.startTime).toTimeString().slice(0, 5),
    })) || []
  )
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [availableStaff, setAvailableStaff] = useState(users)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: shift ? {
      title: shift.title,
      brandId: shift.brandId || '',
      locationId: shift.locationId || '',
      assignedTo: shift.assignedTo,
      role: shift.role || '',
      startDate: shift.startTime.toISOString().split('T')[0],
      startTime: shift.startTime.toTimeString().slice(0, 5),
      endDate: shift.endTime.toISOString().split('T')[0],
      endTime: shift.endTime.toTimeString().slice(0, 5),
      shiftType: shift.shiftType || 'full',
      isRecurring: shift.isRecurring || false,
      recurrenceType: shift.recurrencePattern?.type || 'weekly',
      recurrenceInterval: shift.recurrencePattern?.interval || 1,
      recurrenceDays: shift.recurrencePattern?.daysOfWeek || [],
      recurrenceEndDate: shift.recurrencePattern?.endDate?.toISOString().split('T')[0] || '',
      recurrenceOccurrences: shift.recurrencePattern?.occurrences || undefined,
    } : {
      breaks: [],
      shiftType: 'full',
      isRecurring: false,
      recurrenceType: 'weekly',
      recurrenceInterval: 1,
      recurrenceDays: [],
    }
  })

  const addBreak = () => {
    setBreaks([...breaks, { type: 'break', startTime: '12:00', endTime: '13:00' }])
  }

  const removeBreak = (index: number) => {
    setBreaks(breaks.filter((_, i) => i !== index))
  }

  const updateBreak = (index: number, field: string, value: string) => {
    const updatedBreaks = breaks.map((breakItem, i) => 
      i === index ? { ...breakItem, [field]: value } : breakItem
    )
    setBreaks(updatedBreaks)
  }

  const onFormSubmit = (data: ShiftFormData) => {
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`)
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`)

    const shiftBreaks: Break[] = breaks.map((breakItem, index) => ({
      id: `break-${index}`,
      startTime: new Date(`${data.startDate}T${breakItem.startTime}`),
      endTime: new Date(`${data.startDate}T${breakItem.endTime}`),
      type: breakItem.type,
      status: 'scheduled' as const,
    }))

    const selectedLocationData = mockLocations.find(l => l.id === data.locationId)
    const selectedBrandData = mockBrands.find(b => b.id === data.brandId)
    const selectedStaff = users.find(u => u.id === data.assignedTo)

    // Create recurrence pattern if recurring
    let recurrencePattern: RecurrencePattern | undefined
    if (data.isRecurring && data.recurrenceType) {
      recurrencePattern = {
        type: data.recurrenceType,
        interval: data.recurrenceInterval || 1,
        daysOfWeek: data.recurrenceDays,
        endDate: data.recurrenceEndDate ? new Date(data.recurrenceEndDate) : undefined,
        occurrences: data.recurrenceOccurrences
      }
    }

    const baseShift = {
      title: data.title,
      location: selectedLocationData?.name || '',
      startTime: startDateTime,
      endTime: endDateTime,
      assignedTo: selectedStaff?.name || '',
      status: shift?.status || 'scheduled',
      breaks: shiftBreaks,
      clockIn: shift?.clockIn,
      clockOut: shift?.clockOut,
      // Add new fields for proper scoping
      brand: selectedBrandData?.name || '',
      brandId: data.brandId,
      locationId: data.locationId,
      role: data.role,
      shiftType: data.shiftType,
      isRecurring: data.isRecurring || false,
      recurrencePattern
    }

    // If it's a recurring shift, generate multiple shifts
    if (data.isRecurring && recurrencePattern) {
      const generatedShifts = generateRecurringShifts(baseShift, recurrencePattern)
      // For now, just submit the first shift - in a real app, you'd submit all generated shifts
      onSubmit(generatedShifts[0])
    } else {
      onSubmit(baseShift)
    }
  }

  // Helper function to generate recurring shifts
  const generateRecurringShifts = (baseShift: any, pattern: RecurrencePattern) => {
    const shifts = []
    const startDate = new Date(baseShift.startTime)
    const endDate = new Date(baseShift.endTime)
    
    let currentDate = new Date(startDate)
    let occurrenceCount = 0
    const maxOccurrences = pattern.occurrences || 100 // Default to 100 if no limit
    
    while (occurrenceCount < maxOccurrences) {
      // Check if we've reached the end date
      if (pattern.endDate && currentDate > pattern.endDate) {
        break
      }
      
      // For weekly recurrence, check if current day is in selected days
      if (pattern.type === 'weekly' && pattern.daysOfWeek) {
        const dayOfWeek = currentDate.getDay()
        if (pattern.daysOfWeek.includes(dayOfWeek)) {
          const shiftStart = new Date(currentDate)
          shiftStart.setHours(startDate.getHours(), startDate.getMinutes())
          
          const shiftEnd = new Date(currentDate)
          shiftEnd.setHours(endDate.getHours(), endDate.getMinutes())
          
          shifts.push({
            ...baseShift,
            startTime: shiftStart,
            endTime: shiftEnd,
            parentShiftId: baseShift.id || 'parent'
          })
          occurrenceCount++
        }
      } else {
        // For daily or monthly recurrence
        const shiftStart = new Date(currentDate)
        shiftStart.setHours(startDate.getHours(), startDate.getMinutes())
        
        const shiftEnd = new Date(currentDate)
        shiftEnd.setHours(endDate.getHours(), endDate.getMinutes())
        
        shifts.push({
          ...baseShift,
          startTime: shiftStart,
          endTime: shiftEnd,
          parentShiftId: baseShift.id || 'parent'
        })
        occurrenceCount++
      }
      
      // Move to next occurrence
      if (pattern.type === 'daily') {
        currentDate.setDate(currentDate.getDate() + pattern.interval)
      } else if (pattern.type === 'weekly') {
        currentDate.setDate(currentDate.getDate() + (7 * pattern.interval))
      } else if (pattern.type === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + pattern.interval)
      }
    }
    
    return shifts
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Shift Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="e.g., Morning Shift"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brandId">Brand *</Label>
            <select
              id="brandId"
              {...register('brandId')}
              onChange={(e) => {
                setSelectedBrand(e.target.value)
                setValue('locationId', '') // Reset location when brand changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a brand</option>
              {mockBrands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brandId && (
              <p className="text-sm text-red-500">{errors.brandId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">Location *</Label>
            <select
              id="locationId"
              {...register('locationId')}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedBrand}
            >
              <option value="">Select a location</option>
              {mockLocations
                .filter(loc => loc.brandId === selectedBrand)
                .map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
            </select>
            {errors.locationId && (
              <p className="text-sm text-red-500">{errors.locationId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <select
              id="role"
              {...register('role')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role</option>
              {mockRoles.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shiftType">Shift Type *</Label>
            <select
              id="shiftType"
              {...register('shiftType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full">Full Shift</option>
              <option value="split">Split Shift</option>
            </select>
            {errors.shiftType && (
              <p className="text-sm text-red-500">{errors.shiftType.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assign To *</Label>
          <select
            id="assignedTo"
            {...register('assignedTo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedLocation}
          >
            <option value="">Select an employee</option>
            {availableStaff.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.assignedTo && (
            <p className="text-sm text-red-500">{errors.assignedTo.message}</p>
          )}
          {selectedLocation && availableStaff.length === 0 && (
            <p className="text-sm text-yellow-600">
              No staff members assigned to this location. You can still assign them, but they'll need to be added to the location first.
            </p>
          )}
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime')}
          />
          {errors.startTime && (
            <p className="text-sm text-red-500">{errors.startTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            {...register('endTime')}
          />
          {errors.endTime && (
            <p className="text-sm text-red-500">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Breaks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Scheduled Breaks</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBreak}
          >
            <Plus className="mr-1 h-3 w-3" />
            Add Break
          </Button>
        </div>

        {breaks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm">No breaks scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {breaks.map((breakItem, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <select
                    value={breakItem.type}
                    onChange={(e) => updateBreak(index, 'type', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="break">Break</option>
                    <option value="lunch">Lunch</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Input
                    type="time"
                    value={breakItem.startTime}
                    onChange={(e) => updateBreak(index, 'startTime', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="time"
                    value={breakItem.endTime}
                    onChange={(e) => updateBreak(index, 'endTime', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBreak(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recurring Shift Options */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center space-x-2">
          <Repeat className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Recurring Shift</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRecurring"
            checked={watch('isRecurring') || false}
            onCheckedChange={(checked) => setValue('isRecurring', checked as boolean)}
          />
          <Label htmlFor="isRecurring" className="text-sm font-normal">
            Create recurring shifts
          </Label>
        </div>

        {watch('isRecurring') && (
          <div className="space-y-4 pl-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrenceType">Repeat</Label>
                <Select 
                  value={watch('recurrenceType') || 'weekly'} 
                  onValueChange={(value) => setValue('recurrenceType', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrenceInterval">Every</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="recurrenceInterval"
                    type="number"
                    min="1"
                    value={watch('recurrenceInterval') || 1}
                    onChange={(e) => setValue('recurrenceInterval', parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">
                    {watch('recurrenceType') === 'daily' ? 'day(s)' :
                     watch('recurrenceType') === 'weekly' ? 'week(s)' : 'month(s)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Days of Week Selection for Weekly */}
            {watch('recurrenceType') === 'weekly' && (
              <div className="space-y-2">
                <Label>Days of the week</Label>
                <div className="grid grid-cols-7 gap-2">
                  {[
                    { value: 0, label: 'Sun' },
                    { value: 1, label: 'Mon' },
                    { value: 2, label: 'Tue' },
                    { value: 3, label: 'Wed' },
                    { value: 4, label: 'Thu' },
                    { value: 5, label: 'Fri' },
                    { value: 6, label: 'Sat' }
                  ].map(day => (
                    <div key={day.value} className="flex flex-col items-center space-y-1">
                      <Checkbox
                        id={`day-${day.value}`}
                        checked={(watch('recurrenceDays') || []).includes(day.value)}
                        onCheckedChange={(checked) => {
                          const currentDays = watch('recurrenceDays') || []
                          if (checked) {
                            setValue('recurrenceDays', [...currentDays, day.value])
                          } else {
                            setValue('recurrenceDays', currentDays.filter(d => d !== day.value))
                          }
                        }}
                      />
                      <Label htmlFor={`day-${day.value}`} className="text-xs">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* End Date or Occurrences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recurrenceEndDate">End Date</Label>
                <Input
                  id="recurrenceEndDate"
                  type="date"
                  value={watch('recurrenceEndDate') || ''}
                  onChange={(e) => setValue('recurrenceEndDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrenceOccurrences">Or Number of Occurrences</Label>
                <Input
                  id="recurrenceOccurrences"
                  type="number"
                  min="1"
                  value={watch('recurrenceOccurrences') || ''}
                  onChange={(e) => setValue('recurrenceOccurrences', parseInt(e.target.value) || undefined)}
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            {/* Preview */}
            {watch('recurrenceType') && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Recurrence Preview</span>
                </div>
                <p className="text-sm text-blue-700">
                  {watch('recurrenceType') === 'daily' && `Every ${watch('recurrenceInterval') || 1} day(s)`}
                  {watch('recurrenceType') === 'weekly' && `Every ${watch('recurrenceInterval') || 1} week(s) on ${(watch('recurrenceDays') || []).map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'selected days'}`}
                  {watch('recurrenceType') === 'monthly' && `Every ${watch('recurrenceInterval') || 1} month(s)`}
                  {watch('recurrenceEndDate') && ` until ${watch('recurrenceEndDate')}`}
                  {watch('recurrenceOccurrences') && ` for ${watch('recurrenceOccurrences')} occurrence(s)`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : shift ? 'Update Shift' : 'Create Shift'}
        </Button>
      </div>
    </form>
  )
}
