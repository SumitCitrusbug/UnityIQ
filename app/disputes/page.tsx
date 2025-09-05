'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dispute, DisputeEvidence } from '@/lib/types'
import { DisputeForm } from '@/components/disputes/dispute-form'
import { formatDate } from '@/lib/utils'
import { 
  AlertTriangle, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Upload,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Flag,
  Target,
  Award,
  Briefcase
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockDisputes: Dispute[] = [
  {
    id: '1',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    type: 'time_clock',
    title: 'Missing Clock Out Time',
    description: 'I forgot to clock out yesterday and my time shows as incomplete. I left at 5:30 PM.',
    status: 'pending',
    priority: 'medium',
    submittedAt: new Date('2024-01-20T10:00:00'),
    submittedBy: 'current-user',
    relatedRecordId: 'clock-123',
    relatedRecordType: 'time_clock'
  },
  {
    id: '2',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    type: 'grove_score',
    title: 'Incorrect Performance Score',
    description: 'My Grove score for last week shows 75% but I completed all tasks on time and exceeded expectations.',
    status: 'under_review',
    priority: 'high',
    submittedAt: new Date('2024-01-18T14:30:00'),
    submittedBy: 'current-user',
    assignedTo: 'manager-1',
    assignedAt: new Date('2024-01-19T09:00:00')
  },
  {
    id: '3',
    userId: 'current-user',
    staffName: 'John Doe',
    staffId: 'current-user',
    type: 'bonus',
    title: 'Missing Performance Bonus',
    description: 'I was promised a performance bonus for Q4 but it was not included in my last paycheck.',
    status: 'resolved',
    priority: 'high',
    submittedAt: new Date('2024-01-15T16:00:00'),
    submittedBy: 'current-user',
    assignedTo: 'hr-1',
    assignedAt: new Date('2024-01-16T10:00:00'),
    resolvedAt: new Date('2024-01-22T15:30:00'),
    resolvedBy: 'hr-1',
    resolution: 'Bonus has been processed and will appear in next paycheck. Apologies for the delay.'
  }
]

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const { hasRole, user } = useAuthStore()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time_clock':
        return <Clock className="h-5 w-5" />
      case 'attendance':
        return <Calendar className="h-5 w-5" />
      case 'grove_score':
        return <Target className="h-5 w-5" />
      case 'bonus':
        return <Award className="h-5 w-5" />
      case 'task':
        return <Briefcase className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'time_clock':
        return 'bg-blue-100 text-blue-600'
      case 'attendance':
        return 'bg-green-100 text-green-600'
      case 'grove_score':
        return 'bg-purple-100 text-purple-600'
      case 'bonus':
        return 'bg-yellow-100 text-yellow-600'
      case 'task':
        return 'bg-orange-100 text-orange-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-700 bg-yellow-50">Pending</Badge>
      case 'under_review':
        return <Badge variant="outline" className="text-blue-700 bg-blue-50">Under Review</Badge>
      case 'resolved':
        return <Badge variant="outline" className="text-green-700 bg-green-50">Resolved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="text-red-700 bg-red-50">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="text-gray-700 bg-gray-50">Low</Badge>
      case 'medium':
        return <Badge variant="outline" className="text-blue-700 bg-blue-50">Medium</Badge>
      case 'high':
        return <Badge variant="outline" className="text-orange-700 bg-orange-50">High</Badge>
      case 'urgent':
        return <Badge variant="outline" className="text-red-700 bg-red-50">Urgent</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const handleCreateDispute = (dispute: Omit<Dispute, 'id' | 'submittedAt' | 'status'>) => {
    const newDispute: Dispute = {
      ...dispute,
      id: Date.now().toString(),
      submittedAt: new Date(),
      status: 'pending',
      staffName: dispute.staffName || user?.name || 'Current User',
      staffId: dispute.staffId || user?.id || 'current-user',
      submittedBy: user?.id || 'current-user'
    }
    setDisputes(prev => [newDispute, ...prev])
    setIsCreateOpen(false)
  }

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute)
    setIsViewOpen(true)
  }

  const handleResolveDispute = (disputeId: string, resolution: string) => {
    setDisputes(prev => prev.map(dispute => 
      dispute.id === disputeId 
        ? { 
            ...dispute, 
            status: 'resolved', 
            resolvedAt: new Date(), 
            resolvedBy: user?.id || 'admin',
            resolution 
          }
        : dispute
    ))
    setIsViewOpen(false)
  }

  const handleRejectDispute = (disputeId: string, reason: string) => {
    setDisputes(prev => prev.map(dispute => 
      dispute.id === disputeId 
        ? { 
            ...dispute, 
            status: 'rejected', 
            resolvedAt: new Date(), 
            resolvedBy: user?.id || 'admin',
            resolution: reason 
          }
        : dispute
    ))
    setIsViewOpen(false)
  }

  const myDisputes = disputes.filter(d => d.userId === 'current-user')
  const assignedDisputes = disputes.filter(d => d.assignedTo === user?.id)
  const allDisputes = disputes

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disputes & Issues</h1>
            <p className="text-gray-600">Report and manage workplace disputes and issues</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Dispute
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Dispute</DialogTitle>
                <DialogDescription>
                  Report an issue or dispute that needs to be addressed
                </DialogDescription>
              </DialogHeader>
              <DisputeForm
                onSubmit={handleCreateDispute}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Dispute Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {disputes.filter(d => d.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {disputes.filter(d => d.status === 'under_review').length}
                  </div>
                  <div className="text-sm text-gray-600">Under Review</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {disputes.filter(d => d.status === 'resolved').length}
                  </div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {disputes.filter(d => d.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="my-disputes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-disputes" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>My Disputes</span>
            </TabsTrigger>
            {hasRole(['admin', 'manager']) && (
              <TabsTrigger value="assigned" className="flex items-center space-x-2">
                <Flag className="h-4 w-4" />
                <span>Assigned to Me</span>
              </TabsTrigger>
            )}
            {hasRole(['admin', 'manager']) && (
              <TabsTrigger value="all" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>All Disputes</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* My Disputes Tab */}
          <TabsContent value="my-disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Disputes</CardTitle>
                <CardDescription>Disputes you have submitted</CardDescription>
              </CardHeader>
              <CardContent>
                {myDisputes.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes yet</h3>
                    <p className="text-gray-500">Submit your first dispute to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myDisputes.map(dispute => (
                      <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDispute(dispute)}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(dispute.type)}`}>
                            {getTypeIcon(dispute.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{dispute.title}</h4>
                            <p className="text-sm text-gray-600">{dispute.description.substring(0, 100)}...</p>
                            <p className="text-sm text-gray-500">Submitted: {formatDate(dispute.submittedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(dispute.status)}
                          {getPriorityBadge(dispute.priority)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assigned Disputes Tab */}
          {hasRole(['admin', 'manager']) && (
            <TabsContent value="assigned" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned to Me</CardTitle>
                  <CardDescription>Disputes assigned to you for review</CardDescription>
                </CardHeader>
                <CardContent>
                  {assignedDisputes.length === 0 ? (
                    <div className="text-center py-8">
                      <Flag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No assigned disputes</h3>
                      <p className="text-gray-500">No disputes have been assigned to you yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assignedDisputes.map(dispute => (
                        <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDispute(dispute)}>
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(dispute.type)}`}>
                              {getTypeIcon(dispute.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{dispute.title}</h4>
                              <p className="text-sm text-gray-600">By: {dispute.staffName}</p>
                              <p className="text-sm text-gray-500">Submitted: {formatDate(dispute.submittedAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(dispute.status)}
                            {getPriorityBadge(dispute.priority)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* All Disputes Tab */}
          {hasRole(['admin', 'manager']) && (
            <TabsContent value="all" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Disputes</CardTitle>
                  <CardDescription>All disputes in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allDisputes.map(dispute => (
                      <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDispute(dispute)}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(dispute.type)}`}>
                            {getTypeIcon(dispute.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{dispute.title}</h4>
                            <p className="text-sm text-gray-600">By: {dispute.staffName}</p>
                            <p className="text-sm text-gray-500">Submitted: {formatDate(dispute.submittedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(dispute.status)}
                          {getPriorityBadge(dispute.priority)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Dispute Detail Modal */}
        {selectedDispute && (
          <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getTypeIcon(selectedDispute.type)}
                  <span>{selectedDispute.title}</span>
                </DialogTitle>
                <DialogDescription>
                  Dispute #{selectedDispute.id} • {selectedDispute.staffName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {getStatusBadge(selectedDispute.status)}
                  {getPriorityBadge(selectedDispute.priority)}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedDispute.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Submitted:</span>
                    <p className="text-gray-600">{formatDate(selectedDispute.submittedAt)}</p>
                  </div>
                  {selectedDispute.assignedTo && (
                    <div>
                      <span className="font-medium">Assigned To:</span>
                      <p className="text-gray-600">{selectedDispute.assignedTo}</p>
                    </div>
                  )}
                </div>
                
                {selectedDispute.resolution && (
                  <div>
                    <h4 className="font-medium mb-2">Resolution</h4>
                    <p className="text-sm text-gray-600">{selectedDispute.resolution}</p>
                    {selectedDispute.resolvedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Resolved on {formatDate(selectedDispute.resolvedAt)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {hasRole(['admin', 'manager']) && selectedDispute.status !== 'resolved' && selectedDispute.status !== 'rejected' && (
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => handleRejectDispute(selectedDispute.id, 'Dispute rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleResolveDispute(selectedDispute.id, 'Dispute resolved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  )
}


