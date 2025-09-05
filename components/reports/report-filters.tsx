'use client'

import { ReportFilters as ReportFiltersType } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ReportFiltersProps {
  filters: ReportFiltersType
  onChange: (filters: ReportFiltersType) => void
  reportType: 'tasks' | 'attendance' | 'performance'
}

export function ReportFilters({ filters, onChange, reportType }: ReportFiltersProps) {
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: new Date(value)
      }
    })
  }

  const handleLocationChange = (value: string) => {
    const locations = value.split(',').map(loc => loc.trim()).filter(Boolean)
    onChange({
      ...filters,
      locations: locations.length > 0 ? locations : undefined
    })
  }

  const handleDepartmentChange = (value: string) => {
    const departments = value.split(',').map(dept => dept.trim()).filter(Boolean)
    onChange({
      ...filters,
      departments: departments.length > 0 ? departments : undefined
    })
  }

  const handleUserChange = (value: string) => {
    const users = value.split(',').map(user => user.trim()).filter(Boolean)
    onChange({
      ...filters,
      users: users.length > 0 ? users : undefined
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Date Range */}
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={filters.dateRange.start.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange('start', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={filters.dateRange.end.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />
      </div>

      {/* Locations */}
      <div className="space-y-2">
        <Label htmlFor="locations">Locations</Label>
        <Input
          id="locations"
          placeholder="Main Office, Branch Office"
          value={filters.locations?.join(', ') || ''}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
        <p className="text-xs text-gray-500">Comma-separated list</p>
      </div>

      {/* Departments */}
      <div className="space-y-2">
        <Label htmlFor="departments">Departments</Label>
        <Input
          id="departments"
          placeholder="Operations, Maintenance"
          value={filters.departments?.join(', ') || ''}
          onChange={(e) => handleDepartmentChange(e.target.value)}
        />
        <p className="text-xs text-gray-500">Comma-separated list</p>
      </div>

      {/* Users */}
      <div className="space-y-2">
        <Label htmlFor="users">Users</Label>
        <Input
          id="users"
          placeholder="john@example.com, jane@example.com"
          value={filters.users?.join(', ') || ''}
          onChange={(e) => handleUserChange(e.target.value)}
        />
        <p className="text-xs text-gray-500">Comma-separated list</p>
      </div>

      {/* Report Type Specific Filters */}
      {reportType === 'tasks' && (
        <div className="space-y-2">
          <Label>Task Status</Label>
          <div className="flex space-x-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Completed</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Failed</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Pending</span>
            </label>
          </div>
        </div>
      )}

      {reportType === 'attendance' && (
        <div className="space-y-2">
          <Label>Attendance Status</Label>
          <div className="flex space-x-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Present</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Late</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Absent</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
