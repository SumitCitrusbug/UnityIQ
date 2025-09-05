'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatTime } from '@/lib/utils'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Grid3X3,
  List
} from 'lucide-react'

interface Shift {
  id: string
  title: string
  location: string
  brand: string
  startTime: Date
  endTime: Date
  assignedTo: string
  role: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed'
  color?: string
}

interface CalendarViewProps {
  shifts: Shift[]
  onShiftClick?: (shift: Shift) => void
  onCreateShift?: () => void
  view: 'day' | 'week' | 'month'
  onViewChange: (view: 'day' | 'week' | 'month') => void
}

export function CalendarView({ 
  shifts, 
  onShiftClick, 
  onCreateShift, 
  view, 
  onViewChange 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showListView, setShowListView] = useState(false)

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
        break
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
    }
    
    setCurrentDate(newDate)
  }

  const getViewTitle = () => {
    switch (view) {
      case 'day':
        return formatDate(currentDate)
      case 'week':
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
      case 'month':
        return currentDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
    }
  }

  const getDaysInView = () => {
    switch (view) {
      case 'day':
        return [currentDate]
      case 'week':
        const startOfWeek = new Date(currentDate)
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
        return Array.from({ length: 7 }, (_, i) => {
          const day = new Date(startOfWeek)
          day.setDate(startOfWeek.getDate() + i)
          return day
        })
      case 'month':
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        const startOfCalendar = new Date(startOfMonth)
        startOfCalendar.setDate(startOfMonth.getDate() - startOfMonth.getDay())
        
        const days = []
        const current = new Date(startOfCalendar)
        while (current <= endOfMonth || current.getDay() !== 0) {
          days.push(new Date(current))
          current.setDate(current.getDate() + 1)
          if (days.length >= 42) break // 6 weeks max
        }
        return days
    }
  }

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.startTime)
      return shiftDate.toDateString() === date.toDateString()
    })
  }

  const getShiftsForTimeRange = (startTime: Date, endTime: Date) => {
    return shifts.filter(shift => {
      const shiftStart = new Date(shift.startTime)
      const shiftEnd = new Date(shift.endTime)
      return shiftStart < endTime && shiftEnd > startTime
    })
  }

  const getShiftColor = (shift: Shift) => {
    switch (shift.status) {
      case 'scheduled':
        return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'in_progress':
        return 'bg-green-100 border-green-300 text-green-800'
      case 'completed':
        return 'bg-gray-100 border-gray-300 text-gray-800'
      case 'missed':
        return 'bg-red-100 border-red-300 text-red-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const renderDayView = () => {
    const dayShifts = getShiftsForDate(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-25 gap-0 border border-gray-200 rounded-lg">
          {/* Time column */}
          <div className="col-span-1 border-r border-gray-200">
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
                <span className="text-xs text-gray-500">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Main calendar area */}
          <div className="col-span-24 relative">
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b border-gray-100 relative">
                {/* Hour lines */}
                <div className="absolute inset-0 border-b border-gray-50"></div>
                
                {/* Shifts for this hour */}
                {dayShifts
                  .filter(shift => {
                    const shiftHour = new Date(shift.startTime).getHours()
                    return shiftHour === hour
                  })
                  .map(shift => (
                    <div
                      key={shift.id}
                      className={`absolute left-0 right-0 m-1 p-2 rounded border cursor-pointer hover:shadow-md transition-shadow ${getShiftColor(shift)}`}
                      onClick={() => onShiftClick?.(shift)}
                    >
                      <div className="text-xs font-medium truncate">{shift.title}</div>
                      <div className="text-xs opacity-75 truncate">{shift.assignedTo}</div>
                      <div className="text-xs opacity-75">
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const days = getDaysInView()
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-8 gap-0 border border-gray-200 rounded-lg">
          {/* Time column */}
          <div className="col-span-1 border-r border-gray-200">
            <div className="h-12 border-b border-gray-200"></div>
            {hours.map(hour => (
              <div key={hour} className="h-16 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
                <span className="text-xs text-gray-500">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => {
            const dayShifts = getShiftsForDate(day)
            return (
              <div key={day.toISOString()} className="col-span-1 border-r border-gray-200">
                {/* Day header */}
                <div className="h-12 border-b border-gray-200 flex flex-col items-center justify-center">
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.getDate()}
                  </div>
                </div>

                {/* Hour rows */}
                {hours.map(hour => (
                  <div key={hour} className="h-16 border-b border-gray-100 relative">
                    {/* Shifts for this hour */}
                    {dayShifts
                      .filter(shift => {
                        const shiftHour = new Date(shift.startTime).getHours()
                        return shiftHour === hour
                      })
                      .map(shift => (
                        <div
                          key={shift.id}
                          className={`absolute inset-0 m-0.5 p-1 rounded border cursor-pointer hover:shadow-md transition-shadow ${getShiftColor(shift)}`}
                          onClick={() => onShiftClick?.(shift)}
                        >
                          <div className="text-xs font-medium truncate">{shift.title}</div>
                          <div className="text-xs opacity-75 truncate">{shift.assignedTo}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const days = getDaysInView()

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="h-12 border-b border-r border-gray-200 flex items-center justify-center bg-gray-50">
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const dayShifts = getShiftsForDate(day)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isToday = day.toDateString() === new Date().toDateString()

            return (
              <div
                key={day.toISOString()}
                className={`min-h-32 border-b border-r border-gray-200 p-2 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayShifts.slice(0, 3).map(shift => (
                    <div
                      key={shift.id}
                      className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getShiftColor(shift)}`}
                      onClick={() => onShiftClick?.(shift)}
                    >
                      <div className="truncate">{shift.title}</div>
                      <div className="truncate opacity-75">{shift.assignedTo}</div>
                    </div>
                  ))}
                  {dayShifts.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayShifts.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderListView = () => {
    const sortedShifts = [...shifts].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )

    return (
      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          {sortedShifts.map(shift => (
            <div
              key={shift.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onShiftClick?.(shift)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">{shift.title}</h3>
                    <Badge variant="outline">{shift.status}</Badge>
                    <Badge variant="secondary">{shift.role}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{shift.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{shift.assignedTo}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-medium">{formatDate(shift.startTime)}</div>
                  <div className="text-xs text-gray-500">{shift.brand}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Shift Calendar</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('day')}
            >
              Day
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewChange('month')}
            >
              Month
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowListView(!showListView)}
          >
            {showListView ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={onCreateShift}>
            <Plus className="h-4 w-4 mr-2" />
            New Shift
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
        
        <h3 className="text-lg font-medium">{getViewTitle()}</h3>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 p-4">
        {showListView ? (
          renderListView()
        ) : (
          <>
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'month' && renderMonthView()}
          </>
        )}
      </div>
    </div>
  )
}
