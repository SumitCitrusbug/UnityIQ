'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ShiftForm } from '@/components/shifts/shift-form'
import { CalendarView } from '@/components/calendar/calendar-view'
import { Shift, Break } from '@/lib/types'
import { formatDateTime, formatTime } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus,
  Edit,
  Trash2,
  Users,
  Coffee,
  CheckCircle,
  AlertTriangle,
  Building,
  Filter,
  Download
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data with proper structure for calendar
const mockShifts: Shift[] = [
  {
    id: '1',
    title: 'Morning Shift',
    location: 'Main Office',
    startTime: new Date('2024-01-25T09:00:00'),
    endTime: new Date('2024-01-25T17:00:00'),
    assignedTo: 'John Doe',
    status: 'scheduled',
    breaks: [
      {
        id: '1',
        startTime: new Date('2024-01-25T12:00:00'),
        endTime: new Date('2024-01-25T13:00:00'),
        type: 'lunch',
        status: 'scheduled'
      }
    ],
    createdAt: new Date('2024-01-20T10:00:00'),
    createdBy: 'manager-1'
  },
  {
    id: '2',
    title: 'Evening Shift',
    location: 'Branch Office',
    startTime: new Date('2024-01-25T17:00:00'),
    endTime: new Date('2024-01-25T23:00:00'),
    assignedTo: 'Jane Smith',
    status: 'in_progress',
    breaks: [],
    createdAt: new Date('2024-01-20T10:00:00'),
    createdBy: 'manager-1'
  },
  {
    id: '3',
    title: 'Weekend Shift',
    location: 'Main Office',
    startTime: new Date('2024-01-27T10:00:00'),
    endTime: new Date('2024-01-27T18:00:00'),
    assignedTo: 'Mike Johnson',
    status: 'scheduled',
    breaks: [],
    createdAt: new Date('2024-01-20T10:00:00'),
    createdBy: 'manager-1'
  },
  {
    id: '4',
    title: 'Split Shift - Morning',
    location: 'Main Office',
    startTime: new Date('2024-01-26T08:00:00'),
    endTime: new Date('2024-01-26T12:00:00'),
    assignedTo: 'Sarah Wilson',
    status: 'scheduled',
    breaks: [],
    createdAt: new Date('2024-01-20T10:00:00'),
    createdBy: 'manager-1'
  },
  {
    id: '5',
    title: 'Split Shift - Evening',
    location: 'Main Office',
    startTime: new Date('2024-01-26T16:00:00'),
    endTime: new Date('2024-01-26T20:00:00'),
    assignedTo: 'Sarah Wilson',
    status: 'scheduled',
    breaks: [],
    createdAt: new Date('2024-01-20T10:00:00'),
    createdBy: 'manager-1'
  }
]

const mockBrands = [
  { id: '1', name: 'Craft Therapy Network' },
  { id: '2', name: 'Shroom Groove' }
]

const mockLocations = [
  { id: '1', name: 'Main Office', brand: 'Craft Therapy Network' },
  { id: '2', name: 'Branch Office', brand: 'Craft Therapy Network' },
  { id: '3', name: 'Downtown Store', brand: 'Shroom Groove' }
]

const mockStaff = [
  { id: '1', name: 'John Doe', role: 'Staff', locations: ['Main Office'] },
  { id: '2', name: 'Jane Smith', role: 'Staff', locations: ['Branch Office'] },
  { id: '3', name: 'Mike Johnson', role: 'Staff', locations: ['Main Office'] },
  { id: '4', name: 'Sarah Wilson', role: 'Staff', locations: ['Main Office'] }
]

export default function ShiftsPage() {
  const [shifts] = useState<Shift[]>(mockShifts)
  const [isShiftOpen, setIsShiftOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const { hasRole } = useAuthStore()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift)
  }

  const handleCreateShift = () => {
    setSelectedShift(null)
    setIsShiftOpen(true)
  }

  const handleShiftCreated = (shift: Shift) => {
    console.log('Shift created:', shift)
    setIsShiftOpen(false)
  }

  const filteredShifts = shifts.filter(shift => {
    if (selectedBrand !== 'all') {
      const location = mockLocations.find(loc => loc.name === shift.location)
      if (!location || location.brand !== selectedBrand) return false
    }
    if (selectedLocation !== 'all' && shift.location !== selectedLocation) {
      return false
    }
    return true
  })

  const getShiftStats = () => {
    const total = filteredShifts.length
    const scheduled = filteredShifts.filter(s => s.status === 'scheduled').length
    const inProgress = filteredShifts.filter(s => s.status === 'in_progress').length
    const completed = filteredShifts.filter(s => s.status === 'completed').length
    const missed = filteredShifts.filter(s => s.status === 'missed').length

    return { total, scheduled, inProgress, completed, missed }
  }

  const stats = getShiftStats()

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shift Management</h1>
            <p className="text-gray-600">Schedule and manage employee shifts across locations</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            {hasRole(['admin', 'manager']) && (
              <Button onClick={handleCreateShift}>
                <Plus className="mr-2 h-4 w-4" />
                Create Shift
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Brands</option>
                  {mockBrands.map(brand => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Locations</option>
                  {mockLocations.map(location => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">View</label>
                <div className="flex space-x-2">
                  <Button
                    variant={calendarView === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('day')}
                  >
                    Day
                  </Button>
                  <Button
                    variant={calendarView === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('week')}
                  >
                    Week
                  </Button>
                  <Button
                    variant={calendarView === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">This period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Active now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.missed}</div>
              <p className="text-xs text-muted-foreground">Issues</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <Card className="h-[600px]">
          <CalendarView
            shifts={filteredShifts}
            onShiftClick={handleShiftClick}
            onCreateShift={handleCreateShift}
            view={calendarView}
            onViewChange={setCalendarView}
          />
        </Card>

        {/* Shift Details Modal */}
        {selectedShift && (
          <Dialog open={!!selectedShift} onOpenChange={() => setSelectedShift(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Shift Details</DialogTitle>
                <DialogDescription>
                  View and manage shift information
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Title</label>
                    <p className="text-lg font-medium">{selectedShift.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedShift.status)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedShift.location}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned To</label>
                    <p className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{selectedShift.assignedTo}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Start Time</label>
                    <p className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDateTime(selectedShift.startTime)}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">End Time</label>
                    <p className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDateTime(selectedShift.endTime)}</span>
                    </p>
                  </div>
                </div>

                {selectedShift.breaks && selectedShift.breaks.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Scheduled Breaks</label>
                    <div className="mt-2 space-y-2">
                      {selectedShift.breaks.map(breakItem => (
                        <div key={breakItem.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <Coffee className="h-4 w-4" />
                            <span className="capitalize">{breakItem.type} Break</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime || breakItem.startTime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  {hasRole(['admin', 'manager']) && (
                    <>
                      <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </>
                  )}
                  <Button onClick={() => setSelectedShift(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Create/Edit Shift Modal */}
        <Dialog open={isShiftOpen} onOpenChange={setIsShiftOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedShift ? 'Edit Shift' : 'Create New Shift'}
              </DialogTitle>
              <DialogDescription>
                {selectedShift ? 'Update shift information' : 'Create a new shift assignment'}
              </DialogDescription>
            </DialogHeader>
            <ShiftForm
              shift={selectedShift}
              users={mockStaff.map(staff => ({
                id: staff.id,
                name: staff.name,
                email: `${staff.name.toLowerCase().replace(' ', '.')}@company.com`,
                role: staff.role
              }))}
              onSubmit={handleShiftCreated}
              onCancel={() => setIsShiftOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}