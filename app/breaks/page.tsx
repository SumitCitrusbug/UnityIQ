'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BreakScheduleForm } from '@/components/breaks/break-schedule-form'
import { BreakTimeline } from '@/components/breaks/break-timeline'
import { Break } from '@/lib/types'
import { formatTime } from '@/lib/utils'
import { 
  Coffee, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockBreaks: Break[] = [
  {
    id: '1',
    startTime: new Date('2024-01-25T10:00:00'),
    endTime: new Date('2024-01-25T10:15:00'),
    type: 'break',
    status: 'scheduled'
  },
  {
    id: '2',
    startTime: new Date('2024-01-25T12:00:00'),
    endTime: new Date('2024-01-25T13:00:00'),
    type: 'lunch',
    status: 'completed'
  },
  {
    id: '3',
    startTime: new Date('2024-01-25T15:00:00'),
    endTime: new Date('2024-01-25T15:15:00'),
    type: 'break',
    status: 'in_progress'
  }
]

export default function BreaksPage() {
  const [breaks] = useState<Break[]>(mockBreaks)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline')
  const { hasRole, user } = useAuthStore()

  if (!hasRole(['admin', 'manager'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage break schedules.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Coffee className="h-5 w-5 text-gray-600" />
    }
  }

  const handleBreakScheduled = (breakItem: Break) => {
    console.log('Break scheduled:', breakItem)
    setIsScheduleOpen(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Break Management</h1>
            <p className="text-gray-600">Schedule and manage employee breaks</p>
          </div>
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Break
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Break</DialogTitle>
                <DialogDescription>
                  Add a new break to the schedule
                </DialogDescription>
              </DialogHeader>
              <BreakScheduleForm
                onSubmit={handleBreakScheduled}
                onCancel={() => setIsScheduleOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              Timeline View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
          </div>
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <Card>
            <CardHeader>
              <CardTitle>Break Timeline</CardTitle>
              <CardDescription>Visual timeline of break slots and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <BreakTimeline
                shiftStart={new Date('2024-01-25T09:00:00')}
                shiftEnd={new Date('2024-01-25T17:00:00')}
                breakSlots={[
                  {
                    id: '1',
                    startTime: new Date('2024-01-25T12:00:00'),
                    endTime: new Date('2024-01-25T12:30:00'),
                    type: 'lunch',
                    status: 'available'
                  },
                  {
                    id: '2',
                    startTime: new Date('2024-01-25T15:00:00'),
                    endTime: new Date('2024-01-25T15:15:00'),
                    type: 'break',
                    status: 'taken',
                    takenBy: 'John Doe'
                  },
                  {
                    id: '3',
                    startTime: new Date('2024-01-25T16:30:00'),
                    endTime: new Date('2024-01-25T16:45:00'),
                    type: 'break',
                    status: 'available'
                  }
                ]}
                onSlotClick={(slot) => console.log('Break slot clicked:', slot)}
                userRole={user?.role || 'staff'}
              />
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Break Schedule</CardTitle>
              <CardDescription>Manage scheduled breaks for today</CardDescription>
            </CardHeader>
            <CardContent>
            {breaks.length === 0 ? (
              <div className="text-center py-8">
                <Coffee className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No breaks scheduled</h3>
                <p className="text-gray-500">Schedule breaks to help manage employee rest periods.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {breaks.map((breakItem) => (
                  <div key={breakItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(breakItem.status)}
                      <div>
                        <h3 className="font-medium capitalize">{breakItem.type} Break</h3>
                        <p className="text-sm text-gray-600">
                          {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime || breakItem.startTime)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {breakItem.endTime ? 
                            Math.round((breakItem.endTime.getTime() - breakItem.startTime.getTime()) / (1000 * 60)) 
                            : 15} minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(breakItem.status)}
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Break Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coffee className="h-5 w-5" />
                <span>Total Breaks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {breaks.length}
              </div>
              <p className="text-sm text-gray-500">Scheduled today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {breaks.filter(b => b.status === 'completed').length}
              </div>
              <p className="text-sm text-gray-500">Breaks taken</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>In Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {breaks.filter(b => b.status === 'in_progress').length}
              </div>
              <p className="text-sm text-gray-500">Currently on break</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
