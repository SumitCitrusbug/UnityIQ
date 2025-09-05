'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/utils'
import { 
  Coffee, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react'

interface BreakSlot {
  id: string
  startTime: Date
  endTime: Date
  type: 'lunch' | 'break'
  status: 'available' | 'taken' | 'ineligible' | 'locked'
  takenBy?: string
  reason?: string
}

interface BreakTimelineProps {
  shiftStart: Date
  shiftEnd: Date
  breakSlots: BreakSlot[]
  onSlotClick?: (slot: BreakSlot) => void
  userRole: 'staff' | 'manager' | 'admin'
}

export function BreakTimeline({ 
  shiftStart, 
  shiftEnd, 
  breakSlots, 
  onSlotClick,
  userRole 
}: BreakTimelineProps) {
  const [selectedSlot, setSelectedSlot] = useState<BreakSlot | null>(null)

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200'
      case 'taken':
        return 'bg-red-100 border-red-300 text-red-800'
      case 'ineligible':
        return 'bg-gray-100 border-gray-300 text-gray-500'
      case 'locked':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getSlotIcon = (slot: BreakSlot) => {
    switch (slot.status) {
      case 'available':
        return <Unlock className="h-4 w-4" />
      case 'taken':
        return <Lock className="h-4 w-4" />
      case 'ineligible':
        return <AlertTriangle className="h-4 w-4" />
      case 'locked':
        return <Lock className="h-4 w-4" />
      default:
        return <Coffee className="h-4 w-4" />
    }
  }

  const getSlotTooltip = (slot: BreakSlot) => {
    switch (slot.status) {
      case 'available':
        return `Click to claim this ${slot.type} break`
      case 'taken':
        return `Taken by ${slot.takenBy}`
      case 'ineligible':
        return slot.reason || 'Not eligible for this break'
      case 'locked':
        return 'This slot is locked by manager'
      default:
        return ''
    }
  }

  const canInteractWithSlot = (slot: BreakSlot) => {
    if (userRole === 'staff') {
      return slot.status === 'available'
    }
    return ['available', 'taken', 'locked'].includes(slot.status)
  }

  const handleSlotClick = (slot: BreakSlot) => {
    if (canInteractWithSlot(slot)) {
      setSelectedSlot(slot)
      onSlotClick?.(slot)
    }
  }

  // Generate time slots for the timeline
  const generateTimeSlots = () => {
    const slots = []
    const start = new Date(shiftStart)
    const end = new Date(shiftEnd)
    const duration = end.getTime() - start.getTime()
    const slotWidth = 60 // 1 hour = 60px

    for (let i = 0; i < duration / (60 * 60 * 1000); i++) {
      const time = new Date(start.getTime() + i * 60 * 60 * 1000)
      slots.push({
        time,
        position: i * slotWidth
      })
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="space-y-4">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Break Timeline</h3>
          <p className="text-sm text-gray-600">
            {formatTime(shiftStart)} - {formatTime(shiftEnd)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-700 bg-green-50">
            <Unlock className="h-3 w-3 mr-1" />
            Available
          </Badge>
          <Badge variant="outline" className="text-red-700 bg-red-50">
            <Lock className="h-3 w-3 mr-1" />
            Taken
          </Badge>
          <Badge variant="outline" className="text-gray-700 bg-gray-50">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Ineligible
          </Badge>
        </div>
      </div>

      {/* Timeline Container */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            {/* Time markers */}
            <div className="flex relative h-16 border-b border-gray-200">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="absolute border-l border-gray-200 h-full"
                  style={{ left: `${slot.position}px` }}
                >
                  <div className="absolute -top-6 left-0 text-xs text-gray-500 transform -translate-x-1/2">
                    {formatTime(slot.time)}
                  </div>
                </div>
              ))}
            </div>

            {/* Break slots */}
            <div className="relative h-20 mt-4">
              {breakSlots.map((slot) => {
                const startOffset = (slot.startTime.getTime() - shiftStart.getTime()) / (60 * 60 * 1000) * 60
                const duration = (slot.endTime.getTime() - slot.startTime.getTime()) / (60 * 60 * 1000) * 60
                
                return (
                  <div
                    key={slot.id}
                    className={`absolute top-2 h-12 border rounded-lg cursor-pointer transition-all duration-200 ${getSlotStatusColor(slot.status)} ${
                      canInteractWithSlot(slot) ? 'hover:shadow-md' : 'cursor-not-allowed'
                    }`}
                    style={{
                      left: `${startOffset}px`,
                      width: `${duration}px`,
                      minWidth: '60px'
                    }}
                    onClick={() => handleSlotClick(slot)}
                    title={getSlotTooltip(slot)}
                  >
                    <div className="flex items-center justify-between h-full px-2">
                      <div className="flex items-center space-x-1">
                        {getSlotIcon(slot)}
                        <span className="text-xs font-medium capitalize">
                          {slot.type}
                        </span>
                      </div>
                      <div className="text-xs">
                        {formatTime(slot.startTime)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Shift duration bar */}
            <div className="absolute top-0 left-0 h-16 bg-blue-50 border border-blue-200 rounded opacity-50"
                 style={{
                   width: `${(shiftEnd.getTime() - shiftStart.getTime()) / (60 * 60 * 1000) * 60}px`
                 }}>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Break Rules Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Break Rules</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center space-x-2">
            <Coffee className="h-4 w-4" />
            <span>Lunch breaks: 1×30 minutes (shifts ≥4 hours)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Personal breaks: 2×15 minutes (all shifts)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>One staff on break per location at a time</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Slot Details */}
      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Break Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="capitalize font-medium">{selectedSlot.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span>{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant="outline" className={getSlotStatusColor(selectedSlot.status)}>
                  {selectedSlot.status}
                </Badge>
              </div>
              {selectedSlot.takenBy && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Taken by:</span>
                  <span>{selectedSlot.takenBy}</span>
                </div>
              )}
              {selectedSlot.reason && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reason:</span>
                  <span>{selectedSlot.reason}</span>
                </div>
              )}
            </div>
            
            {userRole === 'staff' && selectedSlot.status === 'available' && (
              <Button 
                className="w-full mt-4"
                onClick={() => {
                  console.log('Claiming break slot:', selectedSlot.id)
                  setSelectedSlot(null)
                }}
              >
                Claim This Break
              </Button>
            )}
            
            {userRole !== 'staff' && (
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  Lock Slot
                </Button>
                <Button variant="outline" size="sm">
                  Override
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
