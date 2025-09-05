'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TaskReviewForm } from '@/components/reviews/task-review-form'
import { Task } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin,
  Camera,
  FileText,
  Eye
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data for tasks awaiting review
const mockTasksAwaitingReview: Task[] = [
  {
    id: '1',
    templateId: '1',
    title: 'Daily Kitchen Cleanup',
    description: 'Complete end-of-day kitchen cleanup including equipment sanitization',
    location: 'Main Kitchen',
    assignee: {
      type: 'individual',
      id: '1',
      name: 'John Doe'
    },
    dueDate: new Date('2024-01-25T18:00:00'),
    requiredInputs: ['photo', 'note'],
    status: 'awaiting_review',
    completedBy: '1',
    completedAt: new Date('2024-01-25T17:45:00'),
    proof: {
      photos: ['photo1.jpg', 'photo2.jpg'],
      notes: 'Completed all cleaning tasks. Equipment sanitized and floors mopped.',
      submittedAt: new Date('2024-01-25T17:45:00'),
      submittedBy: '1'
    },
    isAdHoc: false,
    createdAt: new Date('2024-01-25T09:00:00'),
    createdBy: 'manager-1'
  },
  {
    id: '2',
    templateId: '2',
    title: 'Weekly Inventory Check',
    description: 'Verify stock levels and update inventory system',
    location: 'Storage Room',
    assignee: {
      type: 'team',
      id: '1',
      name: 'Kitchen Staff'
    },
    dueDate: new Date('2024-01-26T16:00:00'),
    requiredInputs: ['note'],
    status: 'awaiting_review',
    completedBy: '2',
    completedAt: new Date('2024-01-26T15:30:00'),
    proof: {
      notes: 'Inventory checked and updated. All items accounted for.',
      submittedAt: new Date('2024-01-26T15:30:00'),
      submittedBy: '2'
    },
    isAdHoc: false,
    createdAt: new Date('2024-01-25T10:00:00'),
    createdBy: 'manager-1'
  }
]

export default function ReviewsPage() {
  const [tasksAwaitingReview] = useState<Task[]>(mockTasksAwaitingReview)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin', 'manager'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to review tasks.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleReviewTask = (task: Task) => {
    setSelectedTask(task)
    setIsReviewOpen(true)
  }

  const handleTaskReviewed = (taskId: string, grade: any) => {
    // Update task with grade
    console.log('Task reviewed:', taskId, grade)
    setIsReviewOpen(false)
    setSelectedTask(null)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Reviews</h1>
            <p className="text-gray-600">Review and grade completed tasks</p>
          </div>
          <Badge variant="warning" className="text-lg px-3 py-1">
            {tasksAwaitingReview.length} Pending
          </Badge>
        </div>

        {/* Tasks Awaiting Review */}
        {tasksAwaitingReview.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks to review</h3>
              <p className="text-gray-500">All tasks have been reviewed or no tasks are awaiting review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tasksAwaitingReview.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      {task.isAdHoc && (
                        <Badge variant="outline" className="text-xs">Ad-Hoc</Badge>
                      )}
                    </div>
                    <Badge variant="warning">Awaiting Review</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Completed by {task.completedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDateTime(task.completedAt!)}</span>
                    </div>
                  </div>

                  {/* Proof Preview */}
                  {task.proof && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Proof of Completion:</h4>
                      {task.proof.notes && (
                        <p className="text-sm text-gray-600 mb-2">{task.proof.notes}</p>
                      )}
                      {task.proof.photos && task.proof.photos.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Camera className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {task.proof.photos.length} photo(s) uploaded
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReviewTask(task)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReviewTask(task)}
                    >
                      Grade Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Dialog */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Task</DialogTitle>
              <DialogDescription>
                Review the completed task and assign a grade
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <TaskReviewForm
                task={selectedTask}
                onSubmit={(grade) => handleTaskReviewed(selectedTask.id, grade)}
                onCancel={() => {
                  setIsReviewOpen(false)
                  setSelectedTask(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
