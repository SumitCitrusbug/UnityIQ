'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/utils'
import { 
  Shield, 
  Search, 
  Download, 
  Filter,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock audit data
const mockAuditLogs = [
  {
    id: '1',
    action: 'User Login',
    user: 'John Doe',
    userId: 'user-1',
    timestamp: new Date('2024-01-25T10:30:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Successful login from desktop',
    severity: 'info',
    category: 'authentication'
  },
  {
    id: '2',
    action: 'Task Created',
    user: 'Jane Smith',
    userId: 'user-2',
    timestamp: new Date('2024-01-25T09:15:00'),
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    details: 'Created task: "Clean restroom"',
    severity: 'info',
    category: 'task_management'
  },
  {
    id: '3',
    action: 'Failed Login Attempt',
    user: 'Unknown',
    userId: null,
    timestamp: new Date('2024-01-25T08:45:00'),
    ipAddress: '192.168.1.200',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Failed login attempt with invalid credentials',
    severity: 'warning',
    category: 'authentication'
  },
  {
    id: '4',
    action: 'Data Export',
    user: 'Mike Johnson',
    userId: 'user-3',
    timestamp: new Date('2024-01-24T16:20:00'),
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    details: 'Exported payroll data for January 2024',
    severity: 'info',
    category: 'data_export'
  },
  {
    id: '5',
    action: 'Permission Changed',
    user: 'Admin User',
    userId: 'admin-1',
    timestamp: new Date('2024-01-24T14:30:00'),
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Changed user permissions for Jane Smith',
    severity: 'warning',
    category: 'user_management'
  }
]

export default function AuditPage() {
  const [auditLogs] = useState(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view audit logs.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'warning':
        return <Badge variant="warning">Warning</Badge>
      case 'info':
        return <Badge variant="info">Info</Badge>
      default:
        return <Badge variant="success">Success</Badge>
    }
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity
    
    return matchesSearch && matchesCategory && matchesSeverity
  })

  const handleExport = () => {
    console.log('Exporting audit logs...')
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'task_management', label: 'Task Management' },
    { value: 'user_management', label: 'User Management' },
    { value: 'data_export', label: 'Data Export' },
    { value: 'system', label: 'System' }
  ]

  const severities = [
    { value: 'all', label: 'All Severities' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' }
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600">System activity and security audit trail</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {severities.map(severity => (
                    <option key={severity.value} value={severity.value}>
                      {severity.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {auditLogs.length} log entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(log.severity)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{log.action}</h3>
                          {getSeverityBadge(log.severity)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{log.user}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDateTime(log.timestamp)}</span>
                          </div>
                          <span>IP: {log.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {auditLogs.filter(log => log.severity === 'warning' || log.severity === 'error').length}
              </div>
              <p className="text-sm text-gray-500">Security-related events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Active Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {new Set(auditLogs.map(log => log.userId).filter(Boolean)).size}
              </div>
              <p className="text-sm text-gray-500">Unique users today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Total Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {auditLogs.length}
              </div>
              <p className="text-sm text-gray-500">Events logged today</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
