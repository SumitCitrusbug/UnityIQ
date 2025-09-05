'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TaskTemplateForm } from '@/components/templates/task-template-form'
import { TaskTemplatePreview } from '@/components/templates/task-template-preview'
import { TaskTemplate, TaskTag, RequiredInput } from '@/lib/types'
import { Plus, Search, Filter, Eye, Edit, Trash2, Archive } from 'lucide-react'
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
    status: 'draft',
    version: 2,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'admin-1'
  },
  {
    id: '3',
    name: 'Equipment Maintenance',
    department: 'Maintenance',
    location: 'Equipment Room',
    title: 'Monthly Equipment Check',
    description: 'Inspect and maintain all equipment',
    expectedOutcome: 'All equipment in working order',
    tags: ['individual'],
    requiredInputs: ['photo'],
    status: 'archived',
    version: 1,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    createdBy: 'admin-1'
  }
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TaskTemplate[]>(mockTemplates)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { hasRole } = useAuthStore()

  if (!hasRole('admin')) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access task templates.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>
      case 'draft':
        return <Badge variant="warning">Draft</Badge>
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const handleCreateTemplate = (templateData: Omit<TaskTemplate, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newTemplate: TaskTemplate = {
      ...templateData,
      id: Date.now().toString(),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user'
    }
    setTemplates([newTemplate, ...templates])
    setIsCreateOpen(false)
  }

  const handleUpdateTemplate = (templateData: Omit<TaskTemplate, 'id' | 'version' | 'createdAt' | 'createdBy'>) => {
    setTemplates(templates.map(t => 
      t.id === selectedTemplate?.id 
        ? { ...templateData, id: t.id, version: t.version + 1, createdAt: t.createdAt, createdBy: t.createdBy }
        : t
    ))
    setIsEditOpen(false)
    setSelectedTemplate(null)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId 
        ? { ...t, status: 'archived' as const }
        : t
    ))
  }

  const handlePublishTemplate = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId 
        ? { ...t, status: 'published' as const, updatedAt: new Date() }
        : t
    ))
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Templates</h1>
            <p className="text-gray-600">Create and manage reusable task templates</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>
                  Create a new task template that can be reused for assignments
                </DialogDescription>
              </DialogHeader>
              <TaskTemplateForm
                onSubmit={handleCreateTemplate}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.title}</CardDescription>
                  </div>
                  {getStatusBadge(template.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p><strong>Department:</strong> {template.department}</p>
                    <p><strong>Location:</strong> {template.location}</p>
                    <p><strong>Version:</strong> {template.version}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsPreviewOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {template.status !== 'archived' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTemplate(template)
                            setIsEditOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                    {template.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishTemplate(template.id)}
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found matching your criteria.</p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
              <DialogDescription>
                Update the task template details
              </DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <TaskTemplateForm
                template={selectedTemplate}
                onSubmit={handleUpdateTemplate}
                onCancel={() => {
                  setIsEditOpen(false)
                  setSelectedTemplate(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Template Preview</DialogTitle>
              <DialogDescription>
                Preview how this template will appear when assigned
              </DialogDescription>
            </DialogHeader>
            {selectedTemplate && (
              <TaskTemplatePreview template={selectedTemplate} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
