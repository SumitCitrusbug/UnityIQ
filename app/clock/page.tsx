'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate, formatTime } from '@/lib/utils'
import { 
  Clock, 
  MapPin, 
  Wifi, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Timer,
  History
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

interface ClockRecord {
  id: string
  staffId: string
  staffName: string
  location: string
  clockIn: Date
  clockOut?: Date
  status: 'clocked_in' | 'clocked_out' | 'missed_clock_out'
  ipAddress: string
  locationVerified: boolean
  shiftId?: string
  shiftStart?: Date
  shiftEnd?: Date
}

interface ClockHistory {
  id: string
  date: Date
  clockIn: Date
  clockOut?: Date
  totalHours: number
  status: 'on_time' | 'late' | 'early' | 'missed_clock_out'
  location: string
  shiftId?: string
}

// Mock data
const mockCurrentShift = {
  id: '1',
  title: 'Morning Shift',
  location: 'Main Office',
  startTime: new Date('2024-01-25T09:00:00'),
  endTime: new Date('2024-01-25T17:00:00'),
  status: 'scheduled'
}

const mockClockHistory: ClockHistory[] = [
  {
    id: '1',
    date: new Date('2024-01-24'),
    clockIn: new Date('2024-01-24T09:05:00'),
    clockOut: new Date('2024-01-24T17:00:00'),
    totalHours: 7.92,
    status: 'late',
    location: 'Main Office',
    shiftId: '1'
  },
  {
    id: '2',
    date: new Date('2024-01-23'),
    clockIn: new Date('2024-01-23T08:55:00'),
    clockOut: new Date('2024-01-23T17:10:00'),
    totalHours: 8.25,
    status: 'on_time',
    location: 'Main Office',
    shiftId: '2'
  },
  {
    id: '3',
    date: new Date('2024-01-22'),
    clockIn: new Date('2024-01-22T09:00:00'),
    clockOut: new Date('2024-01-22T16:45:00'),
    totalHours: 7.75,
    status: 'early',
    location: 'Main Office',
    shiftId: '3'
  }
]

const mockLocationSettings = {
  approvedIPs: ['203.0.113.17', '203.0.113.18'],
  earlyClockInWindow: 5, // minutes
  lateGraceWindow: 5, // minutes
  noShowThreshold: 30, // minutes
  locationName: 'Main Office'
}

export default function TimeClockPage() {
  const [pin, setPin] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ClockRecord | null>(null)
  const [clockHistory, setClockHistory] = useState<ClockHistory[]>(mockClockHistory)
  const [locationStatus, setLocationStatus] = useState<{
    ipVerified: boolean
    locationVerified: boolean
    message: string
  }>({
    ipVerified: false,
    locationVerified: false,
    message: 'Checking location...'
  })
  const { user } = useAuthStore()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Check location and IP verification
  useEffect(() => {
    // Simulate location verification
    const checkLocation = async () => {
      try {
        // In a real app, this would check IP and geolocation
        const mockIP = '203.0.113.17'
        const isIPApproved = mockLocationSettings.approvedIPs.includes(mockIP)
        
        setLocationStatus({
          ipVerified: isIPApproved,
          locationVerified: true, // Simulated
          message: isIPApproved 
            ? 'Location verified - Ready to clock in/out'
            : 'Location not approved for clock in/out'
        })
      } catch (error) {
        setLocationStatus({
          ipVerified: false,
          locationVerified: false,
          message: 'Unable to verify location'
        })
      }
    }

    checkLocation()
  }, [])

  const handleClockIn = () => {
    if (!pin.trim()) {
      alert('Please enter your PIN')
      return
    }

    if (!locationStatus.ipVerified) {
      alert('Clock in not allowed from this location')
      return
    }

    const now = new Date()
    const shiftStart = mockCurrentShift.startTime
    const earlyWindow = new Date(shiftStart.getTime() - mockLocationSettings.earlyClockInWindow * 60000)
    const lateGrace = new Date(shiftStart.getTime() + mockLocationSettings.lateGraceWindow * 60000)

    if (now < earlyWindow) {
      alert(`Too early - return at ${formatTime(earlyWindow)}`)
      return
    }

    const newRecord: ClockRecord = {
      id: Date.now().toString(),
      staffId: user?.id || 'current-user',
      staffName: user?.name || 'Current User',
      location: mockLocationSettings.locationName,
      clockIn: now,
      status: 'clocked_in',
      ipAddress: '203.0.113.17',
      locationVerified: true,
      shiftId: mockCurrentShift.id,
      shiftStart: mockCurrentShift.startTime,
      shiftEnd: mockCurrentShift.endTime
    }

    setCurrentRecord(newRecord)
    setIsClockedIn(true)
    setPin('')
    
    console.log('Clocked in:', newRecord)
  }

  const handleClockOut = () => {
    if (!currentRecord) return

    const now = new Date()
    const updatedRecord = {
      ...currentRecord,
      clockOut: now,
      status: 'clocked_out' as const
    }

    // Calculate total hours
    const totalHours = (now.getTime() - currentRecord.clockIn.getTime()) / (1000 * 60 * 60)
    
    // Determine status
    let status: 'on_time' | 'late' | 'early' = 'on_time'
    if (currentRecord.clockIn > new Date(currentRecord.clockIn.getTime() + mockLocationSettings.lateGraceWindow * 60000)) {
      status = 'late'
    } else if (now < new Date(mockCurrentShift.endTime.getTime() - 15 * 60000)) {
      status = 'early'
    }

    // Add to history
    const historyEntry: ClockHistory = {
      id: Date.now().toString(),
      date: new Date(currentRecord.clockIn.toDateString()),
      clockIn: currentRecord.clockIn,
      clockOut: now,
      totalHours: Math.round(totalHours * 100) / 100,
      status,
      location: currentRecord.location,
      shiftId: currentRecord.shiftId
    }

    setClockHistory(prev => [historyEntry, ...prev])
    setCurrentRecord(null)
    setIsClockedIn(false)
    
    console.log('Clocked out:', updatedRecord)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_time':
        return <Badge variant="outline" className="text-green-700 bg-green-50">On Time</Badge>
      case 'late':
        return <Badge variant="outline" className="text-red-700 bg-red-50">Late</Badge>
      case 'early':
        return <Badge variant="outline" className="text-yellow-700 bg-yellow-50">Early</Badge>
      case 'missed_clock_out':
        return <Badge variant="outline" className="text-red-700 bg-red-50">Missed Clock Out</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_time':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'late':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'early':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Clock</h1>
            <p className="text-gray-600">Clock in and out for your shifts</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Location Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">IP Address</span>
                  <Badge variant={locationStatus.ipVerified ? "success" : "destructive"}>
                    {locationStatus.ipVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Location</span>
                  <Badge variant={locationStatus.locationVerified ? "success" : "destructive"}>
                    {locationStatus.locationVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {locationStatus.message}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Shift */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Shift</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Shift</div>
                <div className="font-medium">{mockCurrentShift.title}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Start Time</div>
                <div className="font-medium">{formatTime(mockCurrentShift.startTime)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">End Time</div>
                <div className="font-medium">{formatTime(mockCurrentShift.endTime)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clock In/Out */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Clock In/Out</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isClockedIn && currentRecord ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-medium text-green-800">Clocked In</span>
                  </div>
                  <div className="text-sm text-green-700">
                    Since {formatTime(currentRecord.clockIn)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    <Timer className="inline h-6 w-6 mr-2" />
                    {Math.floor((currentTime.getTime() - currentRecord.clockIn.getTime()) / (1000 * 60 * 60))}h{' '}
                    {Math.floor(((currentTime.getTime() - currentRecord.clockIn.getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m
                  </div>
                  <div className="text-sm text-gray-600">Time worked today</div>
                </div>

                <Button 
                  onClick={handleClockOut}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!locationStatus.ipVerified}
                >
                  Clock Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Enter Your PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter your 4-digit PIN"
                    maxLength={4}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>

                <Button 
                  onClick={handleClockIn}
                  className="w-full"
                  disabled={!locationStatus.ipVerified || pin.length !== 4}
                >
                  Clock In
                </Button>

                {!locationStatus.ipVerified && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-700">
                        Clock in not allowed from this location
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Clock History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Recent Clock History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clockHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clock history</h3>
                <p className="text-gray-500">Your clock in/out history will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clockHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(record.status)}
                      </div>
                      <div>
                        <div className="font-medium">{formatDate(record.date)}</div>
                        <div className="text-sm text-gray-600">
                          {formatTime(record.clockIn)} - {record.clockOut ? formatTime(record.clockOut) : 'Not clocked out'}
                        </div>
                        <div className="text-sm text-gray-500">{record.location}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{record.totalHours}h</div>
                      <div className="text-sm text-gray-600">Total hours</div>
                      <div className="mt-1">{getStatusBadge(record.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}