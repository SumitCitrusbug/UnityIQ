'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ShiftSwapForm } from '@/components/swaps/shift-swap-form'
import { formatDateTime } from '@/lib/utils'
import { 
  RefreshCw, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data for shift swaps
const mockShiftSwaps = [
  {
    id: '1',
    originalShift: {
      id: '1',
      title: 'Morning Shift',
      date: new Date('2024-01-26T09:00:00'),
      assignedTo: 'John Doe'
    },
    requestedSwap: {
      id: '2',
      title: 'Evening Shift',
      date: new Date('2024-01-27T17:00:00'),
      assignedTo: 'Jane Smith'
    },
    status: 'pending',
    submittedAt: new Date('2024-01-25T10:00:00'),
    expiresAt: new Date('2024-01-25T18:00:00'),
    reason: 'Family emergency'
  },
  {
    id: '2',
    originalShift: {
      id: '3',
      title: 'Weekend Shift',
      date: new Date('2024-01-28T10:00:00'),
      assignedTo: 'Mike Johnson'
    },
    requestedSwap: {
      id: '4',
      title: 'Weekday Shift',
      date: new Date('2024-01-29T09:00:00'),
      assignedTo: 'Sarah Wilson'
    },
    status: 'approved',
    submittedAt: new Date('2024-01-24T14:00:00'),
    approvedAt: new Date('2024-01-24T16:00:00'),
    approvedBy: 'manager-1'
  }
]

export default function SwapsPage() {
  const [shiftSwaps] = useState(mockShiftSwaps)
  const [isSwapOpen, setIsSwapOpen] = useState(false)
  const { user } = useAuthStore()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'approved':
        return <Badge variant="success">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const handleSwapRequested = (swap: any) => {
    console.log('Shift swap requested:', swap)
    setIsSwapOpen(false)
  }

  const isExpired = (expiresAt: Date) => {
    return new Date() > expiresAt
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shift Swaps</h1>
            <p className="text-gray-600">Request and manage shift exchanges</p>
          </div>
          <Dialog open={isSwapOpen} onOpenChange={setIsSwapOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request Swap
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Shift Swap</DialogTitle>
                <DialogDescription>
                  Request to swap shifts with another employee
                </DialogDescription>
              </DialogHeader>
              <ShiftSwapForm
                onSubmit={handleSwapRequested}
                onCancel={() => setIsSwapOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Shift Swaps List */}
        <Card>
          <CardHeader>
            <CardTitle>Shift Swap Requests</CardTitle>
            <CardDescription>View and manage shift swap requests</CardDescription>
          </CardHeader>
          <CardContent>
            {shiftSwaps.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No swap requests</h3>
                <p className="text-gray-500">No shift swap requests have been submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shiftSwaps.map((swap) => (
                  <div key={swap.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(swap.status)}
                        <div>
                          <h3 className="font-medium">Shift Swap Request #{swap.id}</h3>
                          <p className="text-sm text-gray-500">
                            Submitted: {formatDateTime(swap.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(swap.status)}
                        {isExpired(swap.expiresAt) && swap.status === 'pending' && (
                          <Badge variant="secondary">Expired</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Your Shift</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Title:</strong> {swap.originalShift.title}</p>
                          <p><strong>Date:</strong> {formatDateTime(swap.originalShift.date)}</p>
                          <p><strong>Assigned to:</strong> {swap.originalShift.assignedTo}</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Requested Shift</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Title:</strong> {swap.requestedSwap.title}</p>
                          <p><strong>Date:</strong> {formatDateTime(swap.requestedSwap.date)}</p>
                          <p><strong>Assigned to:</strong> {swap.requestedSwap.assignedTo}</p>
                        </div>
                      </div>
                    </div>

                    {swap.reason && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">Reason</h4>
                        <p className="text-sm text-gray-600">{swap.reason}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Expires: {formatDateTime(swap.expiresAt)}</span>
                        </div>
                      </div>
                      {swap.status === 'pending' && !isExpired(swap.expiresAt) && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Cancel
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {shiftSwaps.filter(s => s.status === 'pending').length}
              </div>
              <p className="text-sm text-gray-500">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Approved</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {shiftSwaps.filter(s => s.status === 'approved').length}
              </div>
              <p className="text-sm text-gray-500">Successfully swapped</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Expired</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">
                {shiftSwaps.filter(s => isExpired(s.expiresAt) && s.status === 'pending').length}
              </div>
              <p className="text-sm text-gray-500">No longer valid</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
