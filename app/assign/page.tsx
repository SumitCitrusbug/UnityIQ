'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TaskAssignmentForm } from '@/components/assign/task-assignment-form'
import { AdHocTaskForm } from '@/components/assign/ad-hoc-task-form'
import { Task, TaskTemplate } from '@/lib/types'
import { Plus, ClipboardList, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockTemplates: TaskTemplate[] = [
  {
    id: '1',
    name: 'Kitchen Cleanup',
    department: 'Operations',
    location: 'Main Kitchen',
    title: 'Daily Kitchen Cleanup',
    description: 'Complete end-of-day kitchen cleanup including equipment sanitization',
    expectedOutcome: 'Clean and sanitized kitchen ready for next day',
    tags: ['individual', 'recurring'],
    requiredInputs: ['photo', 'note'],
    status: 'published',
    version: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'admin-1'
  },
  {
    id: '2',
    name: 'Inventory Check',
    department: 'Operations',
    location: 'Storage Room',
    title: 'Weekly Inventory Check',
    description: 'Verify stock levels and update inventory system',
    expectedOutcome: 'Accurate inventory records',
    tags: ['team', 'recurring'],
    requiredInputs: ['note'],
    status: 'published',
    version: 1,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'admin-1'
  }
]

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'staff', department: 'Operations' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'staff', department: 'Operations' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'staff', department: 'Maintenance' },
]

const mockTeams = [
  { id: '1', name: 'Kitchen Staff', members: ['1', '2'] },
  { id: '2', name: 'Maintenance Team', members: ['3'] },
]

const mockRoles = [
  { id: '1', name: 'All Staff', description: 'All staff members' },
  { id: '2', name: 'Operations Team', description: 'Operations department staff' },
]

export default function AssignPage() {
  const [isTemplateAssignOpen, setIsTemplateAssignOpen] = useState(false)
  const [isAdHocOpen, setIsAdHocOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null)
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin', 'manager'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to assign tasks.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleTemplateAssign = (template: TaskTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateAssignOpen(true)
  }

  const handleTaskAssigned = (task: Task) => {
    // Handle task assignment
    console.log('Task assigned:', task)
    setIsTemplateAssignOpen(false)
    setSelectedTemplate(null)
  }

  const handleAdHocTaskCreated = (task: Task) => {
    // Handle ad-hoc task creation
    console.log('Ad-hoc task created:', task)
    setIsAdHocOpen(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assign Tasks</h1>
            <p className="text-gray-600">Assign tasks to individuals, teams, or roles</p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isAdHocOpen} onOpenChange={setIsAdHocOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ad-Hoc Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Ad-Hoc Task</DialogTitle>
                  <DialogDescription>
                    Create a one-time task without using a template
                  </DialogDescription>
                </DialogHeader>
                <AdHocTaskForm
                  onSubmit={handleAdHocTaskCreated}
                  onCancel={() => setIsAdHocOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Available Templates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p><strong>Department:</strong> {template.department}</p>
                    <p><strong>Location:</strong> {template.location}</p>
                  </div>
                  
                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-1">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleTemplateAssign(template)}
                    >
                      <UserPlus className="mr-1 h-3 w-3" />
                      Assign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Assignments</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No recent assignments to display</p>
                <p className="text-sm">Assign tasks to see them here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Assignment Dialog */}
        <Dialog open={isTemplateAssignOpen} onOpenChange={setIsTemplateAssignOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Task</DialogTitle>
              <DialogDescription>
                Assign "{selectedTemplate?.name}" to users, teams, or roles
              </DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <TaskAssignmentForm
                template={selectedTemplate}
                users={mockUsers}
                teams={mockTeams}
                roles={mockRoles}
                onSubmit={handleTaskAssigned}
                onCancel={() => {
                  setIsTemplateAssignOpen(false)
                  setSelectedTemplate(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
