'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnalyticsCharts } from '@/components/analytics/analytics-charts'
import { AnalyticsFilters } from '@/components/analytics/analytics-filters'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Download
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock analytics data
const mockAnalyticsData = {
  taskCompletion: {
    total: 150,
    completed: 142,
    failed: 5,
    pending: 3,
    completionRate: 94.7
  },
  attendance: {
    totalShifts: 200,
    completedShifts: 195,
    missedShifts: 3,
    lateArrivals: 2,
    attendanceRate: 97.5
  },
  performance: {
    averageScore: 92.3,
    topPerformer: 'John Doe',
    improvementRate: 5.2
  },
  trends: {
    weekly: [
      { week: 'Week 1', tasks: 25, attendance: 98 },
      { week: 'Week 2', tasks: 30, attendance: 96 },
      { week: 'Week 3', tasks: 28, attendance: 97 },
      { week: 'Week 4', tasks: 32, attendance: 99 }
    ],
    monthly: [
      { month: 'Jan', tasks: 120, attendance: 95 },
      { month: 'Feb', tasks: 135, attendance: 97 },
      { month: 'Mar', tasks: 142, attendance: 98 }
    ]
  }
}

export default function AnalyticsPage() {
  const [analyticsData] = useState(mockAnalyticsData)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month')
  const [selectedMetric, setSelectedMetric] = useState<'tasks' | 'attendance' | 'performance'>('tasks')
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin', 'manager'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view analytics.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleExport = () => {
    console.log('Exporting analytics data...')
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights and performance metrics</p>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Filters */}
        <AnalyticsFilters
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.taskCompletion.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.taskCompletion.completed} of {analyticsData.taskCompletion.total} tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.attendance.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.attendance.completedShifts} of {analyticsData.attendance.totalShifts} shifts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.performance.averageScore}</div>
              <p className="text-xs text-muted-foreground">
                +{analyticsData.performance.improvementRate}% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.taskCompletion.failed + analyticsData.attendance.missedShifts}
              </div>
              <p className="text-xs text-muted-foreground">
                Failed tasks + missed shifts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <AnalyticsCharts
          data={analyticsData}
          timeRange={timeRange}
          selectedMetric={selectedMetric}
        />

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Employees with highest performance scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-yellow-800">1</span>
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-500">Operations</p>
                    </div>
                  </div>
                  <Badge variant="success">98.5%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-800">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-gray-500">Operations</p>
                    </div>
                  </div>
                  <Badge variant="success">96.2%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-800">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Mike Johnson</p>
                      <p className="text-sm text-gray-500">Maintenance</p>
                    </div>
                  </div>
                  <Badge variant="success">94.8%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Trends</CardTitle>
              <CardDescription>Performance trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Task Completion</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">+5.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Attendance</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">+2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Punctuality</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600">+3.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Issues</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">-1.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
