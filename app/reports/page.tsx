'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ReportFilters } from '@/components/reports/report-filters'
import { ReportCharts } from '@/components/reports/report-charts'
import { ReportTable } from '@/components/reports/report-table'
import { Report, ReportFilters as ReportFiltersType } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Weekly Task Completion Report',
    type: 'weekly',
    filters: {
      dateRange: {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-21')
      },
      locations: ['Main Office'],
      departments: ['Operations']
    },
    data: {
      totalTasks: 45,
      completedTasks: 42,
      failedTasks: 2,
      pendingTasks: 1,
      completionRate: 93.3,
      averageCompletionTime: '2.5 hours',
      topPerformers: [
        { name: 'John Doe', completed: 12, score: 98 },
        { name: 'Jane Smith', completed: 10, score: 95 },
        { name: 'Mike Johnson', completed: 8, score: 92 }
      ]
    },
    generatedAt: new Date('2024-01-22T10:00:00'),
    generatedBy: 'admin-1'
  },
  {
    id: '2',
    title: 'Monthly Attendance Report',
    type: 'monthly',
    filters: {
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31')
      },
      locations: ['Main Office', 'Branch Office']
    },
    data: {
      totalShifts: 120,
      completedShifts: 115,
      missedShifts: 3,
      lateArrivals: 2,
      attendanceRate: 95.8,
      averageHours: 8.2,
      topPerformers: [
        { name: 'John Doe', attendance: 100, hours: 168 },
        { name: 'Jane Smith', attendance: 98, hours: 164 },
        { name: 'Mike Johnson', attendance: 95, hours: 160 }
      ]
    },
    generatedAt: new Date('2024-02-01T09:00:00'),
    generatedBy: 'manager-1'
  }
]

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [filters, setFilters] = useState<ReportFiltersType>({
    dateRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      end: new Date()
    }
  })
  const [reportType, setReportType] = useState<'tasks' | 'attendance' | 'performance'>('tasks')
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin', 'manager'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view reports.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleGenerateReport = () => {
    // Generate new report based on filters
    console.log('Generating report with filters:', filters)
  }

  const handleExportReport = (reportId: string) => {
    // Export report to CSV
    console.log('Exporting report:', reportId)
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'weekly':
        return <Calendar className="h-4 w-4" />
      case 'monthly':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'weekly':
        return <Badge variant="info">Weekly</Badge>
      case 'monthly':
        return <Badge variant="success">Monthly</Badge>
      default:
        return <Badge variant="outline">Custom</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and view detailed reports</p>
          </div>
        </div>

        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Select report type and configure filters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex space-x-2">
              <Button
                variant={reportType === 'tasks' ? 'default' : 'outline'}
                onClick={() => setReportType('tasks')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Task Reports
              </Button>
              <Button
                variant={reportType === 'attendance' ? 'default' : 'outline'}
                onClick={() => setReportType('attendance')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Attendance Reports
              </Button>
              <Button
                variant={reportType === 'performance' ? 'default' : 'outline'}
                onClick={() => setReportType('performance')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Performance Reports
              </Button>
            </div>

            <ReportFilters
              filters={filters}
              onChange={setFilters}
              reportType={reportType}
            />

            <div className="flex justify-end">
              <Button onClick={handleGenerateReport}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
              <p className="text-xs text-muted-foreground">
                Generated this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93.3%</div>
              <p className="text-xs text-muted-foreground">
                Average this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95.8%</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Requiring attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>View and export previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getReportTypeIcon(report.type)}
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-gray-500">
                        Generated on {formatDate(report.generatedAt)} by {report.generatedBy}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getReportTypeBadge(report.type)}
                        <span className="text-xs text-gray-500">
                          {formatDate(report.filters.dateRange.start)} - {formatDate(report.filters.dateRange.end)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportReport(report.id)}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Detail Modal */}
        {selectedReport && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedReport.title}</CardTitle>
                  <CardDescription>
                    Generated on {formatDate(selectedReport.generatedAt)}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleExportReport(selectedReport.id)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ReportCharts data={selectedReport.data} />
              <ReportTable data={selectedReport.data} />
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
