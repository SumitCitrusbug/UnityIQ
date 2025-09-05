'use client'

import { TaskTemplate } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { MapPin, Building, Calendar, User, Camera, FileText } from 'lucide-react'

interface TaskTemplatePreviewProps {
  template: TaskTemplate
}

export function TaskTemplatePreview({ template }: TaskTemplatePreviewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">{template.title}</CardTitle>
              <CardDescription className="text-base">{template.name}</CardDescription>
            </div>
            <Badge variant={template.status === 'published' ? 'success' : 'warning'}>
              {template.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{template.department}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{template.location}</span>
            </div>
          </div>

          {/* Description */}
          {template.description && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          )}

          {/* Expected Outcome */}
          {template.expectedOutcome && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Expected Outcome</h4>
              <p className="text-sm text-gray-600">{template.expectedOutcome}</p>
            </div>
          )}

          {/* Tags */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Required Inputs */}
          {template.requiredInputs.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Inputs</h4>
              <div className="flex flex-wrap gap-2">
                {template.requiredInputs.map((input) => (
                  <div key={input} className="flex items-center space-x-1">
                    {input === 'photo' ? (
                      <Camera className="h-4 w-4 text-gray-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-600 capitalize">{input}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(template.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Version: {template.version}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Preview:</strong> This is how the task will appear when assigned to users. 
          The actual assignment will include additional fields like due date, assignee, and completion window.
        </p>
      </div>
    </div>
  )
}
