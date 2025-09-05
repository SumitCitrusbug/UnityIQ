'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PTORequestForm } from '@/components/pto/pto-request-form'
import { PTOCalendarOverlay } from '@/components/pto/pto-calendar-overlay'
import { PTORequest, PTOEarning, PTOBalance } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  Coins,
  CalendarDays,
  TrendingUp
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockPTORequests: PTORequest[] = [
  {
    id: '1',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-03'),
    type: 'full',
    reason: 'travel',
    status: 'pending',
    submittedAt: new Date('2024-01-25T10:00:00'),
    notes: 'Family vacation'
  },
  {
    id: '2',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-01-20'),
    type: 'full',
    reason: 'sick',
    status: 'approved',
    submittedAt: new Date('2024-01-18T14:00:00'),
    reviewedAt: new Date('2024-01-19T09:00:00'),
    reviewedBy: 'manager-1',
    notes: 'Doctor appointment'
  },
  {
    id: '3',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-15'),
    type: 'full',
    reason: 'other',
    status: 'denied',
    submittedAt: new Date('2024-01-14T16:00:00'),
    reviewedAt: new Date('2024-01-15T08:00:00'),
    reviewedBy: 'manager-1',
    notes: 'Personal matters'
  }
]

// Mock PTO Earnings data
const mockPTOEarnings: PTOEarning[] = [
  {
    id: '1',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    type: 'sick',
    hours: 8,
    earnedDate: new Date('2024-01-15'),
    description: 'Monthly sick leave accrual',
    status: 'approved',
    approvedBy: 'manager-1',
    approvedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    type: 'vacation',
    hours: 16,
    earnedDate: new Date('2024-01-01'),
    description: 'Monthly vacation accrual',
    status: 'approved',
    approvedBy: 'manager-1',
    approvedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    type: 'bonus',
    hours: 4,
    earnedDate: new Date('2024-01-20'),
    description: 'Performance bonus PTO',
    status: 'pending'
  }
]

// Mock PTO Balance data
const mockPTOBalance: PTOBalance = {
  userId: 'current-user',
  staffName: 'John Doe',
  sickHours: 24,
  vacationHours: 40,
  personalHours: 8,
  holidayHours: 16,
  bonusHours: 4,
  totalHours: 92,
  usedHours: 16,
  availableHours: 76,
  lastUpdated: new Date()
}

export default function PTOPage() {
  const [ptoRequests, setPTORequests] = useState<PTORequest[]>(mockPTORequests)
  const [ptoEarnings, setPTOEarnings] = useState<PTOEarning[]>(mockPTOEarnings)
  const [ptoBalance, setPTOBalance] = useState<PTOBalance>(mockPTOBalance)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isEarningOpen, setIsEarningOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const { hasRole, user } = useAuthStore()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-700 bg-yellow-50">Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="text-green-700 bg-green-50">Approved</Badge>
      case 'denied':
        return <Badge variant="outline" className="text-red-700 bg-red-50">Denied</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const handlePTORequested = (request: Omit<PTORequest, 'id' | 'status' | 'submittedAt'>) => {
    console.log('PTO request submitted:', request)
    const newRequest: PTORequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date(),
      staffName: request.staffName || user?.name || 'Current User',
      staffId: request.staffId || user?.id || 'current-user',
      submittedBy: user?.id || 'current-user'
    }
    setPTORequests(prev => [...prev, newRequest])
    setIsRequestOpen(false)
  }

  const handleApproveRequest = (requestId: string, notes?: string) => {
    setPTORequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved', reviewedAt: new Date(), reviewedBy: user?.id || 'admin' }
        : req
    ))
    console.log('PTO request approved:', requestId, notes)
  }

  const handleDenyRequest = (requestId: string, reason: string) => {
    setPTORequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'denied', reviewedAt: new Date(), reviewedBy: user?.id || 'admin' }
        : req
    ))
    console.log('PTO request denied:', requestId, reason)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(selectedMonth)
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setSelectedMonth(newMonth)
  }

  const handlePTOEarning = (earning: Omit<PTOEarning, 'id' | 'status' | 'earnedDate'>) => {
    console.log('PTO earning submitted:', earning)
    const newEarning: PTOEarning = {
      ...earning,
      id: Date.now().toString(),
      status: 'pending',
      earnedDate: new Date(),
      staffName: earning.staffName || user?.name || 'Current User',
      staffId: earning.staffId || user?.id || 'current-user'
    }
    setPTOEarnings(prev => [...prev, newEarning])
    setIsEarningOpen(false)
  }

  const handleApproveEarning = (earningId: string) => {
    setPTOEarnings(prev => prev.map(earning => 
      earning.id === earningId 
        ? { ...earning, status: 'approved', approvedAt: new Date(), approvedBy: user?.id || 'admin' }
        : earning
    ))
    console.log('PTO earning approved:', earningId)
  }

  const handleDenyEarning = (earningId: string) => {
    setPTOEarnings(prev => prev.map(earning => 
      earning.id === earningId 
        ? { ...earning, status: 'denied', approvedAt: new Date(), approvedBy: user?.id || 'admin' }
        : earning
    ))
    console.log('PTO earning denied:', earningId)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PTO Management</h1>
            <p className="text-gray-600">Earn PTO hours and request time off</p>
          </div>
        </div>

        {/* PTO Balance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Your PTO Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{ptoBalance.sickHours}</div>
                <div className="text-sm text-blue-800">Sick Hours</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{ptoBalance.vacationHours}</div>
                <div className="text-sm text-green-800">Vacation Hours</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{ptoBalance.personalHours}</div>
                <div className="text-sm text-purple-800">Personal Hours</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{ptoBalance.availableHours}</div>
                <div className="text-sm text-orange-800">Available Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="earn" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earn" className="flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span>Earn PTO</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4" />
              <span>Request Leave</span>
            </TabsTrigger>
          </TabsList>

          {/* Earn PTO Tab */}
          <TabsContent value="earn" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Earn PTO Hours</h2>
                <p className="text-gray-600">Accrue PTO hours automatically or through special circumstances</p>
              </div>
              <Dialog open={isEarningOpen} onOpenChange={setIsEarningOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Additional PTO
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Additional PTO Hours</DialogTitle>
                    <DialogDescription>
                      Submit a request to earn additional PTO hours for special circumstances
                    </DialogDescription>
                  </DialogHeader>
                  {/* PTO Earning Form will go here */}
                </DialogContent>
              </Dialog>
            </div>

            {/* Automatic PTO Earning Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Automatic PTO Earning</span>
                </CardTitle>
                <CardDescription>
                  PTO hours are automatically earned based on your work schedule and company policy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Monthly Accrual</h4>
                    <p className="text-sm text-blue-700">8 hours sick leave per month</p>
                    <p className="text-sm text-blue-700">16 hours vacation per month</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Work Performance</h4>
                    <p className="text-sm text-green-700">Bonus PTO for excellent performance</p>
                    <p className="text-sm text-green-700">Overtime compensation</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Special Circumstances</h4>
                    <p className="text-sm text-purple-700">Holiday bonuses</p>
                    <p className="text-sm text-purple-700">Company events</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PTO Earnings List */}
            <Card>
              <CardHeader>
                <CardTitle>PTO Earnings History</CardTitle>
                <CardDescription>Track your PTO hour accruals and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                {ptoEarnings.length === 0 ? (
                  <div className="text-center py-8">
                    <Coins className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No PTO earnings yet</h3>
                    <p className="text-gray-500">Submit your first PTO earning request to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ptoEarnings.map(earning => (
                      <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            earning.status === 'approved' ? 'bg-green-100 text-green-600' :
                            earning.status === 'denied' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            <Coins className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{earning.type.charAt(0).toUpperCase() + earning.type.slice(1)} Hours</h4>
                            <p className="text-sm text-gray-600">{earning.hours} hours • {formatDate(earning.earnedDate)}</p>
                            {earning.description && (
                              <p className="text-sm text-gray-500">{earning.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(earning.status)}
                          {hasRole(['admin', 'manager']) && earning.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => handleApproveEarning(earning.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDenyEarning(earning.id)}>
                                <XCircle className="h-4 w-4 mr-1" />
                                Deny
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Request Leave Tab */}
          <TabsContent value="leave" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Request Leave</h2>
                <p className="text-gray-600">Submit leave requests - with or without earned PTO hours</p>
              </div>
              <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Leave
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Request Leave</DialogTitle>
                    <DialogDescription>
                      Submit a new leave request (with or without earned PTO)
                    </DialogDescription>
                  </DialogHeader>
                  <PTORequestForm
                    onSubmit={handlePTORequested}
                    onCancel={() => setIsRequestOpen(false)}
                    userBalance={ptoBalance.availableHours}
                    userRole={user?.role || 'staff'}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Leave Options Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>Leave Request Options</span>
                </CardTitle>
                <CardDescription>
                  You can request leave in two ways
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>With Earned PTO</span>
                    </h4>
                    <p className="text-sm text-green-700 mt-2">
                      Use your earned PTO hours for paid leave. This is automatically approved if you have sufficient balance.
                    </p>
                    <div className="mt-2 text-sm text-green-600">
                      <p>✓ Paid leave</p>
                      <p>✓ Automatic approval (if sufficient PTO)</p>
                      <p>✓ Deducted from your PTO balance</p>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-900 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Without Earned PTO</span>
                    </h4>
                    <p className="text-sm text-orange-700 mt-2">
                      Request leave even without sufficient PTO hours. Requires manager approval and may be unpaid.
                    </p>
                    <div className="mt-2 text-sm text-orange-600">
                      <p>⚠ Requires manager approval</p>
                      <p>⚠ May be unpaid leave</p>
                      <p>⚠ Special circumstances only</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  onClick={() => setViewMode('calendar')}
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar View
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  size="sm"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  List View
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  ← Previous
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  Next →
                </Button>
              </div>
            </div>

            {/* Calendar Overlay View */}
            {viewMode === 'calendar' && (
              <PTOCalendarOverlay
                currentMonth={selectedMonth}
                ptoRequests={ptoRequests}
                onApproveRequest={handleApproveRequest}
                onDenyRequest={handleDenyRequest}
                onCreatePTORequest={handlePTORequested}
                userRole={user?.role || 'staff'}
              />
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <Card>
                <CardHeader>
                  <CardTitle>PTO Requests</CardTitle>
                  <CardDescription>Your time off requests and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {ptoRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                      <p className="text-gray-500">Submit your first time off request to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ptoRequests.map(request => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              request.status === 'approved' ? 'bg-green-100 text-green-600' :
                              request.status === 'denied' ? 'bg-red-100 text-red-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {getStatusIcon(request.status)}
                            </div>
                            <div>
                              <h4 className="font-medium">{request.reason.charAt(0).toUpperCase() + request.reason.slice(1)}</h4>
                              <p className="text-sm text-gray-600">
                                {formatDate(request.startDate)} - {formatDate(request.endDate)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {request.type} • {request.hoursRequested || 8} hours
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(request.status)}
                            {request.reviewedAt && (
                              <p className="text-xs text-gray-500">
                                Reviewed: {formatDate(request.reviewedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
