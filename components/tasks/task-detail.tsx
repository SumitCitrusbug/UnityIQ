'use client'

import { Task } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDateTime, isOverdue } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building, 
  Camera, 
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface TaskDetailProps {
  task: Task
  onComplete: () => void
  onClose: () => void
}

export function TaskDetail({ task, onComplete, onClose }: TaskDetailProps) {
  const getStatusBadge = () => {
    if (isOverdue(task.dueDate) && task.status !== 'completed') {
      return <Badge variant="destructive">Overdue</Badge>
    }
    
    switch (task.status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>
      case 'awaiting_review':
        return <Badge variant="warning">Awaiting Review</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'disputed':
        return <Badge variant="warning">Disputed</Badge>
      default:
        return <Badge variant="outline">Assigned</Badge>
    }
  }

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'awaiting_review':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'disputed':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Task Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            {task.isAdHoc && (
              <Badge variant="outline">Ad-Hoc</Badge>
            )}
          </div>
          {task.description && (
            <p className="text-gray-600">{task.description}</p>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Task Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">{task.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Assigned To</p>
                  <p className="text-sm text-gray-600">{task.assignee.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className={`text-sm ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatDateTime(task.dueDate)}
                  </p>
                </div>
              </div>

              {task.windowStart && task.windowEnd && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Completion Window</p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(task.windowStart)} - {formatDateTime(task.windowEnd)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {task.requiredInputs.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">Required Inputs:</p>
                {task.requiredInputs.map((input) => (
                  <div key={input} className="flex items-center space-x-2">
                    {input === 'photo' ? (
                      <Camera className="h-4 w-4 text-gray-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-600 capitalize">{input}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No specific inputs required</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completion Status */}
      {task.status === 'completed' && task.proof && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completion Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completed by {task.completedBy}</p>
                <p className="text-sm text-gray-600">
                  {task.completedAt ? formatDateTime(task.completedAt) : 'Unknown time'}
                </p>
              </div>
            </div>

            {task.proof.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Notes:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {task.proof.notes}
                </p>
              </div>
            )}

            {task.proof.photos && task.proof.photos.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Photos:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {task.proof.photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Grade Information */}
      {task.grade && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              {task.grade.result === 'pass' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {task.grade.result === 'pass' ? 'Passed' : 'Failed'}
                </p>
                <p className="text-sm text-gray-600">
                  Graded by {task.grade.gradedBy} on {formatDateTime(task.grade.gradedAt)}
                </p>
              </div>
            </div>

            {task.grade.reason && (
              <div>
                <p className="text-sm font-medium mb-2">Reason:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {task.grade.reason}
                </p>
              </div>
            )}

            {task.grade.overridden && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm font-medium text-yellow-800">Override Applied</p>
                {task.grade.overrideReason && (
                  <p className="text-sm text-yellow-700 mt-1">{task.grade.overrideReason}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dispute Information */}
      {task.dispute && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dispute</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Status: {task.dispute.status}</p>
                <p className="text-sm text-gray-600">
                  Submitted by {task.dispute.submittedBy} on {formatDateTime(task.dispute.submittedAt)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Reason:</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {task.dispute.reason}
              </p>
            </div>

            {task.dispute.resolution && (
              <div>
                <p className="text-sm font-medium mb-2">Resolution:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  {task.dispute.resolution}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {task.status === 'assigned' && (
          <Button onClick={onComplete}>
            Complete Task
          </Button>
        )}
      </div>
    </div>
  )
}
