'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Plane,
  Heart,
  Zap,
  MessageSquare
} from 'lucide-react'

const ptoRequestSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  type: z.enum(['full', 'partial']),
  reason: z.enum(['travel', 'leisure', 'sick', 'emergency', 'other']),
  notes: z.string().optional(),
  partialStartTime: z.string().optional(),
  partialEndTime: z.string().optional(),
  hoursRequested: z.number().optional(),
  useEarnedPTO: z.boolean().optional(),
})

type PTORequestFormData = z.infer<typeof ptoRequestSchema>

interface PTORequestFormProps {
  onSubmit: (request: any) => void
  onCancel: () => void
  userBalance: number
  userRole: string
}

export function PTORequestForm({ onSubmit, onCancel, userBalance, userRole }: PTORequestFormProps) {
  const [selectedType, setSelectedType] = useState<'full' | 'partial'>('full')
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [deadlineInfo, setDeadlineInfo] = useState<{
    isDeadlinePassed: boolean
    deadlineDate: Date
    nextMonth: string
  }>({
    isDeadlinePassed: false,
    deadlineDate: new Date(),
    nextMonth: ''
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<PTORequestFormData>({
    resolver: zodResolver(ptoRequestSchema),
    defaultValues: {
      type: 'full',
      reason: 'leisure',
    }
  })

  const watchedStartDate = watch('startDate')
  const watchedEndDate = watch('endDate')
  const watchedType = watch('type')

  // Check PTO deadline (15th of current month for next month)
  useEffect(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const deadlineDate = new Date(currentYear, currentMonth, 15)
    const nextMonth = new Date(currentYear, currentMonth + 1, 1)
    
    const isDeadlinePassed = now > deadlineDate
    const nextMonthName = nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    setDeadlineInfo({
      isDeadlinePassed,
      deadlineDate,
      nextMonth: nextMonthName
    })
  }, [])

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'travel':
        return <Plane className="h-5 w-5" />
      case 'leisure':
        return <Heart className="h-5 w-5" />
      case 'sick':
        return <Zap className="h-5 w-5" />
      case 'emergency':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'travel':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'leisure':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'sick':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateDaysRequested = () => {
    if (!watchedStartDate || !watchedEndDate) return 0
    
    const start = new Date(watchedStartDate)
    const end = new Date(watchedEndDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    
    return diffDays
  }

  const calculateHoursRequested = () => {
    if (selectedType !== 'partial' || !watchedStartDate || !watchedEndDate) return 0
    
    const days = calculateDaysRequested()
    return days * 8 // Assuming 8 hours per day
  }

  const isRequestValid = () => {
    if (!watchedStartDate || !watchedEndDate) return false
    
    const startDate = new Date(watchedStartDate)
    const endDate = new Date(watchedEndDate)
    const now = new Date()
    
    // Check if dates are in the future
    if (startDate <= now) return false
    
    // Check if end date is after start date
    if (endDate < startDate) return false
    
    // Check if request is for next month (after 15th deadline)
    const requestMonth = startDate.getMonth()
    const currentMonth = now.getMonth()
    const nextMonth = (currentMonth + 1) % 12
    
    if (requestMonth !== nextMonth) return false
    
    // Check if user has enough balance
    const daysRequested = calculateDaysRequested()
    if (daysRequested > userBalance) return false
    
    return true
  }

  const onFormSubmit = (data: PTORequestFormData) => {
    const requestData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      hoursRequested: selectedType === 'partial' ? calculateHoursRequested() : undefined,
      partialStartTime: selectedType === 'partial' ? new Date(`2024-01-01T${data.partialStartTime}`) : undefined,
      partialEndTime: selectedType === 'partial' ? new Date(`2024-01-01T${data.partialEndTime}`) : undefined,
      submittedAt: new Date(),
      status: 'pending',
      staffName: 'Current User', // This would come from auth context
      staffId: 'current-user-id'
    }

    onSubmit(requestData)
  }

  const reasonOptions = [
    { value: 'travel', label: 'Travel', icon: <Plane className="h-4 w-4" /> },
    { value: 'leisure', label: 'Leisure', icon: <Heart className="h-4 w-4" /> },
    { value: 'sick', label: 'Sick Leave', icon: <Zap className="h-4 w-4" /> },
    { value: 'emergency', label: 'Emergency', icon: <AlertTriangle className="h-4 w-4" /> },
    { value: 'other', label: 'Other', icon: <MessageSquare className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* PTO Balance and Deadline Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>PTO Request Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Available Balance</div>
              <div className="text-2xl font-bold text-blue-800">{userBalance} days</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Request Deadline</div>
              <div className="text-lg font-bold text-green-800">
                {deadlineInfo.deadlineDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs text-green-600">
                For {deadlineInfo.nextMonth}
              </div>
            </div>
          </div>
          
          {deadlineInfo.isDeadlinePassed && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800">Deadline Passed</div>
                  <div className="text-sm text-red-600">
                    The deadline for requesting PTO for {deadlineInfo.nextMonth} has passed. 
                    You can only request PTO for future months.
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate')}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
              min={watchedStartDate || new Date().toISOString().split('T')[0]}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Request Type */}
        <div className="space-y-2">
          <Label>Request Type *</Label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedType === 'full' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedType('full')
                setValue('type', 'full')
              }}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <div>
                  <div className="font-medium">Full Day(s)</div>
                  <div className="text-sm text-gray-600">Entire work day(s)</div>
                </div>
              </div>
            </div>
            
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedType === 'partial' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedType('partial')
                setValue('type', 'partial')
              }}
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <div>
                  <div className="font-medium">Partial Day(s)</div>
                  <div className="text-sm text-gray-600">Specific hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partial Time Selection */}
        {selectedType === 'partial' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partialStartTime">Start Time</Label>
              <Input
                id="partialStartTime"
                type="time"
                {...register('partialStartTime')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partialEndTime">End Time</Label>
              <Input
                id="partialEndTime"
                type="time"
                {...register('partialEndTime')}
              />
            </div>
          </div>
        )}

        {/* Reason Selection */}
        <div className="space-y-2">
          <Label>Reason for PTO *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reasonOptions.map(option => (
              <div
                key={option.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedReason === option.value 
                    ? getReasonColor(option.value)
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedReason(option.value)
                  setValue('reason', option.value as any)
                }}
              >
                <div className="flex items-center space-x-2">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PTO Usage Option */}
        <div className="space-y-2">
          <Label>PTO Usage</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useEarnedPTO"
                checked={watch('useEarnedPTO') || false}
                onCheckedChange={(checked) => setValue('useEarnedPTO', checked as boolean)}
              />
              <Label htmlFor="useEarnedPTO" className="text-sm font-normal">
                Use my earned PTO hours for this leave
              </Label>
            </div>
            <div className="ml-6 text-sm text-gray-600">
              {watch('useEarnedPTO') ? (
                <div className="text-green-600">
                  ✓ This will be paid leave using your earned PTO hours
                </div>
              ) : (
                <div className="text-orange-600">
                  ⚠ This will be unpaid leave requiring manager approval
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <textarea
            id="notes"
            {...register('notes')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Add any additional information about your PTO request..."
          />
        </div>

        {/* Request Summary */}
        {watchedStartDate && watchedEndDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Request Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{calculateDaysRequested()} day(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{selectedType}</span>
                </div>
                {selectedType === 'partial' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours:</span>
                    <span className="font-medium">{calculateHoursRequested()} hours</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance After:</span>
                  <span className="font-medium">
                    {userBalance - calculateDaysRequested()} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation Messages */}
        {watchedStartDate && watchedEndDate && !isRequestValid() && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div className="text-sm text-red-700">
                {calculateDaysRequested() > userBalance 
                  ? 'Insufficient PTO balance for this request.'
                  : 'Please select valid dates for your PTO request.'
                }
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !isRequestValid()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit PTO Request'}
          </Button>
        </div>
      </form>
    </div>
  )
}