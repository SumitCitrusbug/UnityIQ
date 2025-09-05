'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TaskDetail } from '@/components/tasks/task-detail'
import { TaskCompletionForm } from '@/components/tasks/task-completion-form'
import { Task, TaskProof } from '@/lib/types'
import { formatDateTime, isOverdue } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Camera, 
  FileText,
  Eye
} from 'lucide-react'

// Mock data
const mockTasks: Task[] = [
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
    windowStart: new Date('2024-01-25T17:00:00'),
    windowEnd: new Date('2024-01-25T19:00:00'),
    requiredInputs: ['photo', 'note'],
    status: 'assigned',
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
    status: 'in_progress',
    isAdHoc: false,
    createdAt: new Date('2024-01-25T10:00:00'),
    createdBy: 'manager-1'
  },
  {
    id: '3',
    title: 'Emergency Equipment Fix',
    description: 'Fix the broken dishwasher immediately',
    location: 'Kitchen',
    assignee: {
      type: 'individual',
      id: '3',
      name: 'Mike Johnson'
    },
    dueDate: new Date('2024-01-24T14:00:00'),
    requiredInputs: ['photo'],
    status: 'assigned',
    isAdHoc: true,
    createdAt: new Date('2024-01-24T13:00:00'),
    createdBy: 'manager-1'
  },
  {
    id: '4',
    templateId: '1',
    title: 'Daily Kitchen Cleanup',
    description: 'Complete end-of-day kitchen cleanup including equipment sanitization',
    location: 'Main Kitchen',
    assignee: {
      type: 'individual',
      id: '1',
      name: 'John Doe'
    },
    dueDate: new Date('2024-01-23T18:00:00'),
    requiredInputs: ['photo', 'note'],
    status: 'completed',
    completedBy: '1',
    completedAt: new Date('2024-01-23T17:45:00'),
    proof: {
      photos: ['photo1.jpg'],
      notes: 'Completed all cleaning tasks. Equipment sanitized.',
      submittedAt: new Date('2024-01-23T17:45:00'),
      submittedBy: '1'
    },
    isAdHoc: false,
    createdAt: new Date('2024-01-23T09:00:00'),
    createdBy: 'manager-1'
  }
]

export default function TasksPage() {
  const [tasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCompletionOpen, setIsCompletionOpen] = useState(false)
  const [viewFilter, setViewFilter] = useState<'today' | 'week'>('today')

  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday

  const filteredTasks = tasks.filter(task => {
    if (viewFilter === 'today') {
      return task.dueDate.toDateString() === today.toDateString()
    } else {
      return task.dueDate >= startOfWeek && task.dueDate <= endOfWeek
    }
  })

  const getStatusBadge = (task: Task) => {
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDetailOpen(true)
  }

  const handleCompleteTask = (task: Task) => {
    setSelectedTask(task)
    setIsCompletionOpen(true)
  }

  const handleTaskCompleted = (taskId: string, proof: TaskProof) => {
    // Update task status
    console.log('Task completed:', taskId, proof)
    setIsCompletionOpen(false)
    setSelectedTask(null)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600">View and complete your assigned tasks</p>
          </div>
        </div>

        {/* View Filter */}
        <div className="flex space-x-2">
          <Button
            variant={viewFilter === 'today' ? 'default' : 'outline'}
            onClick={() => setViewFilter('today')}
          >
            Today
          </Button>
          <Button
            variant={viewFilter === 'week' ? 'default' : 'outline'}
            onClick={() => setViewFilter('week')}
          >
            This Week
          </Button>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500">
                {viewFilter === 'today' 
                  ? "You don't have any tasks due today." 
                  : "You don't have any tasks due this week."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <Card 
                key={task.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  isOverdue(task.dueDate) && task.status !== 'completed' ? 'border-red-200' : ''
                }`}
                onClick={() => handleTaskClick(task)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      {task.isAdHoc && (
                        <Badge variant="outline" className="text-xs">Ad-Hoc</Badge>
                      )}
                    </div>
                    {getStatusBadge(task)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{task.assignee.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className={isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600' : ''}>
                        {formatDateTime(task.dueDate)}
                      </span>
                    </div>
                  </div>

                  {task.requiredInputs.length > 0 && (
                    <div className="flex items-center space-x-2">
                      {task.requiredInputs.map((input) => (
                        <div key={input} className="flex items-center space-x-1">
                          {input === 'photo' ? (
                            <Camera className="h-3 w-3 text-gray-400" />
                          ) : (
                            <FileText className="h-3 w-3 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-500 capitalize">{input}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTaskClick(task)
                      }}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    {task.status === 'assigned' && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompleteTask(task)
                        }}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Task Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
              <DialogDescription>
                View complete task information and completion status
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <TaskDetail 
                task={selectedTask} 
                onComplete={() => {
                  setIsDetailOpen(false)
                  handleCompleteTask(selectedTask)
                }}
                onClose={() => {
                  setIsDetailOpen(false)
                  setSelectedTask(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Task Completion Dialog */}
        <Dialog open={isCompletionOpen} onOpenChange={setIsCompletionOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Complete Task</DialogTitle>
              <DialogDescription>
                Submit proof of completion for this task
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <TaskCompletionForm
                task={selectedTask}
                onSubmit={(proof) => handleTaskCompleted(selectedTask.id, proof)}
                onCancel={() => {
                  setIsCompletionOpen(false)
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
