'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, formatTime } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plane,
  Heart,
  Zap,
  MessageSquare,
  Plus,
  CalendarDays
} from 'lucide-react'
import { PTORequest } from '@/lib/types'

interface PTOCalendarOverlayProps {
  currentMonth: Date
  ptoRequests: Array<PTORequest & { staffName?: string }>
  onApproveRequest: (requestId: string, notes?: string) => void
  onDenyRequest: (requestId: string, reason: string) => void
  onCreatePTORequest: (request: Omit<PTORequest, 'id' | 'status' | 'submittedAt'>) => void
  userRole: 'admin' | 'manager' | 'staff'
}

export function PTOCalendarOverlay({ 
  currentMonth, 
  ptoRequests, 
  onApproveRequest, 
  onDenyRequest,
  onCreatePTORequest,
  userRole 
}: PTOCalendarOverlayProps) {
  const [selectedRequest, setSelectedRequest] = useState<PTORequest | null>(null)
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [decisionType, setDecisionType] = useState<'approve' | 'deny'>('approve')
  const [decisionNotes, setDecisionNotes] = useState('')
  
  // New state for interactive calendar
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [isCreatingPTO, setIsCreatingPTO] = useState(false)
  const [newPTORequest, setNewPTORequest] = useState({
    startDate: '',
    endDate: '',
    type: 'full' as 'full' | 'partial',
    reason: 'travel' as 'travel' | 'leisure' | 'sick' | 'emergency' | 'other',
    notes: '',
    hoursRequested: 8
  })

  // Helper functions for date selection
  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => d.toDateString() === date.toDateString())
  }

  const isDateInRange = (date: Date) => {
    if (selectedDates.length < 2) return false
    const start = selectedDates[0]
    const end = selectedDates[selectedDates.length - 1]
    return date >= start && date <= end
  }

  const handleDateClick = (date: Date) => {
    if (selectedDates.length === 0) {
      setSelectedDates([date])
    } else if (selectedDates.length === 1) {
      const firstDate = selectedDates[0]
      if (date < firstDate) {
        setSelectedDates([date, firstDate])
      } else {
        setSelectedDates([firstDate, date])
      }
    } else {
      setSelectedDates([date])
    }
  }

  const handleCreatePTO = () => {
    if (selectedDates.length >= 1) {
      const startDate = selectedDates[0]
      const endDate = selectedDates.length > 1 ? selectedDates[selectedDates.length - 1] : startDate
      
      setNewPTORequest(prev => ({
        ...prev,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }))
      setIsCreatingPTO(true)
    }
  }

  const submitPTORequest = () => {
    const request = {
      userId: 'current-user',
      staffName: 'Current User',
      staffId: 'current-user',
      startDate: new Date(newPTORequest.startDate),
      endDate: new Date(newPTORequest.endDate),
      type: newPTORequest.type,
      reason: newPTORequest.reason,
      notes: newPTORequest.notes,
      hoursRequested: newPTORequest.hoursRequested,
      submittedBy: 'current-user'
    }
    
    onCreatePTORequest(request)
    setIsCreatingPTO(false)
    setSelectedDates([])
    setNewPTORequest({
      startDate: '',
      endDate: '',
      type: 'full',
      reason: 'travel',
      notes: '',
      hoursRequested: 8
    })
  }

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'travel':
        return <Plane className="h-4 w-4" />
      case 'leisure':
        return <Heart className="h-4 w-4" />
      case 'sick':
        return <Zap className="h-4 w-4" />
      case 'emergency':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCombinedColor = (reason: string, status: string) => {
    // Status takes priority over reason for color
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'denied':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return getReasonColor(reason)
    }
  }

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

  const getRequestsForMonth = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    return ptoRequests.filter(request => {
      const requestStart = new Date(request.startDate)
      const requestEnd = new Date(request.endDate)
      
      // Check if request overlaps with the current month
      return (requestStart <= endOfMonth && requestEnd >= startOfMonth)
    })
  }

  const getRequestsForDate = (date: Date) => {
    return getRequestsForMonth().filter(request => {
      const requestStart = new Date(request.startDate)
      const requestEnd = new Date(request.endDate)
      const checkDate = new Date(date)
      
      return checkDate >= requestStart && checkDate <= requestEnd
    })
  }

  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startOfCalendar = new Date(startOfMonth)
    startOfCalendar.setDate(startOfMonth.getDate() - startOfMonth.getDay())
    
    const days = []
    const current = new Date(startOfCalendar)
    
    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const handleRequestClick = (request: PTORequest) => {
    setSelectedRequest(request)
    setShowDecisionModal(true)
  }

  const handleDecision = () => {
    if (!selectedRequest) return
    
    if (decisionType === 'approve') {
      onApproveRequest(selectedRequest.id, decisionNotes)
    } else {
      onDenyRequest(selectedRequest.id, decisionNotes)
    }
    
    setShowDecisionModal(false)
    setSelectedRequest(null)
    setDecisionNotes('')
  }

  const calendarDays = generateCalendarDays()
  const monthRequests = getRequestsForMonth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">PTO Calendar - {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <p className="text-sm text-gray-600">
            Requests submitted by 15th of previous month for this month
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-yellow-700 bg-yellow-50">
            {monthRequests.filter(r => r.status === 'pending').length} Pending
          </Badge>
          <Badge variant="outline" className="text-green-700 bg-green-50">
            {monthRequests.filter(r => r.status === 'approved').length} Approved
          </Badge>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex items-center justify-center space-x-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-700">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-700">Approved</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-700">Denied</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              const isToday = day.toDateString() === new Date().toDateString()
              const dayRequests = getRequestsForDate(day)
              
              const isSelected = isDateSelected(day)
              const isInRange = isDateInRange(day)
              
              return (
                <div
                  key={index}
                  className={`min-h-24 p-1 border border-gray-200 cursor-pointer transition-colors ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'bg-blue-50 border-blue-300' : ''} ${
                    isSelected ? 'bg-blue-100 border-blue-400' : ''
                  } ${isInRange ? 'bg-blue-50' : ''} hover:bg-gray-100`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  } ${isToday ? 'text-blue-600' : ''} ${
                    isSelected ? 'text-blue-700 font-bold' : ''
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayRequests.slice(0, 2).map(request => (
                      <div
                        key={request.id}
                        className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getCombinedColor(request.reason, request.status)}`}
                        onClick={() => handleRequestClick(request)}
                        title={`${request.staffName || 'Unknown Staff'} - ${request.reason} (${request.status})`}
                      >
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-500' :
                            request.status === 'approved' ? 'bg-green-500' :
                            request.status === 'denied' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          {getReasonIcon(request.reason)}
                          <span className="truncate">{request.staffName || 'Unknown Staff'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="capitalize text-xs">{request.reason}</span>
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    ))}
                    {dayRequests.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayRequests.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Controls */}
      {userRole === 'staff' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>Create PTO Request</span>
            </CardTitle>
            <CardDescription>
              Click on dates to select your time off period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDates.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Selected Dates:</p>
                    <p className="text-sm text-blue-700">
                      {selectedDates.length === 1 
                        ? formatDate(selectedDates[0])
                        : `${formatDate(selectedDates[0])} - ${formatDate(selectedDates[selectedDates.length - 1])}`
                      }
                    </p>
                  </div>
                  <Button onClick={handleCreatePTO} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create PTO Request
                  </Button>
                </div>
              </div>
            )}
            
            {selectedDates.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <Calendar className="mx-auto h-8 w-8 mb-2" />
                <p>Click on dates in the calendar above to select your time off period</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* PTO Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>PTO Requests for {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          {monthRequests.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PTO requests</h3>
              <p className="text-gray-500">No PTO requests submitted for this month.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {monthRequests.map(request => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleRequestClick(request)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCombinedColor(request.reason, request.status)}`}>
                      {getReasonIcon(request.reason)}
                    </div>
                    <div>
                      <h4 className="font-medium">{request.staffName || 'Unknown Staff'}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {request.type === 'partial' && request.hoursRequested 
                              ? `${request.hoursRequested} hours`
                              : 'Full day'
                            }
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span className="capitalize">{request.reason}</span>
                        </div>
                      </div>
                      {request.notes && (
                        <p className="text-sm text-gray-500 mt-1">{request.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(request.status)}
                    {userRole !== 'staff' && request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRequest(request)
                            setDecisionType('approve')
                            setShowDecisionModal(true)
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRequest(request)
                            setDecisionType('deny')
                            setShowDecisionModal(true)
                          }}
                        >
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

      {/* Decision Modal */}
      {showDecisionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {decisionType === 'approve' ? 'Approve' : 'Deny'} PTO Request
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="font-medium">{selectedRequest.staffName || 'Unknown Staff'}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {selectedRequest.reason} • {selectedRequest.type}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {decisionType === 'approve' ? 'Approval Notes (Optional)' : 'Reason for Denial'}
                </label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder={decisionType === 'approve' 
                    ? 'Add any notes about this approval...'
                    : 'Please provide a reason for denial...'
                  }
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDecisionModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDecision}
                className={decisionType === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
                }
              >
                {decisionType === 'approve' ? 'Approve' : 'Deny'} Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PTO Creation Modal */}
      {isCreatingPTO && (
        <Dialog open={isCreatingPTO} onOpenChange={setIsCreatingPTO}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create PTO Request</DialogTitle>
              <DialogDescription>
                Submit your time off request for the selected dates
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">Selected Period:</p>
                <p className="text-sm text-blue-700">
                  {newPTORequest.startDate} - {newPTORequest.endDate}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newPTORequest.type} 
                    onValueChange={(value: 'full' | 'partial') => 
                      setNewPTORequest(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Day</SelectItem>
                      <SelectItem value="partial">Partial Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Select 
                    value={newPTORequest.reason} 
                    onValueChange={(value: 'travel' | 'leisure' | 'sick' | 'emergency' | 'other') => 
                      setNewPTORequest(prev => ({ ...prev, reason: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="leisure">Leisure</SelectItem>
                      <SelectItem value="sick">Sick</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newPTORequest.type === 'partial' && (
                <div>
                  <Label htmlFor="hours">Hours Requested</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    max="8"
                    value={newPTORequest.hoursRequested}
                    onChange={(e) => setNewPTORequest(prev => ({ 
                      ...prev, 
                      hoursRequested: parseInt(e.target.value) || 8 
                    }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newPTORequest.notes}
                  onChange={(e) => setNewPTORequest(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional details..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsCreatingPTO(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitPTORequest}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
