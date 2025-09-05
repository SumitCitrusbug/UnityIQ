'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'
import { 
  ClipboardList, 
  Clock, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

// Mock data for dashboard
const dashboardStats = {
  tasks: {
    total: 24,
    completed: 18,
    pending: 4,
    overdue: 2
  },
  shifts: {
    today: 8,
    scheduled: 32,
    completed: 6,
    missed: 1
  },
  attendance: {
    present: 45,
    late: 3,
    absent: 2,
    score: 92
  },
  alerts: {
    disputes: 2,
    overdue: 2,
    flags: 1
  }
}

export default function DashboardPage() {
  const { user, hasRole } = useAuthStore()

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.tasks.total}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="text-green-600">{dashboardStats.tasks.completed} completed</span>
                <span>•</span>
                <span className="text-red-600">{dashboardStats.tasks.overdue} overdue</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shifts Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.shifts.today}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="text-green-600">{dashboardStats.shifts.completed} completed</span>
                <span>•</span>
                <span className="text-red-600">{dashboardStats.shifts.missed} missed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.attendance.score}%</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="text-green-600">{dashboardStats.attendance.present} present</span>
                <span>•</span>
                <span className="text-red-600">{dashboardStats.attendance.absent} absent</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.alerts.disputes + dashboardStats.alerts.overdue + dashboardStats.alerts.flags}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="text-red-600">{dashboardStats.alerts.disputes} disputes</span>
                <span>•</span>
                <span className="text-yellow-600">{dashboardStats.alerts.flags} flags</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasRole(['admin', 'manager']) && (
                <>
                  <Link href="/assign">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Assign New Task
                    </Button>
                  </Link>
                  <Link href="/reviews">
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Review Tasks
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/tasks">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  View My Tasks
                </Button>
              </Link>
              <Link href="/clock">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Clock In/Out
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed "Kitchen Cleanup" task</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Clocked in for morning shift</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Task "Inventory Check" is overdue</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-specific content */}
        {hasRole(['admin', 'manager']) && (
          <Card>
            <CardHeader>
              <CardTitle>Management Overview</CardTitle>
              <CardDescription>Key metrics and pending actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{dashboardStats.tasks.overdue}</div>
                  <p className="text-sm text-gray-600">Overdue Tasks</p>
                  <Link href="/overdue">
                    <Button variant="outline" size="sm" className="mt-2">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{dashboardStats.alerts.disputes}</div>
                  <p className="text-sm text-gray-600">Pending Disputes</p>
                  <Link href="/disputes">
                    <Button variant="outline" size="sm" className="mt-2">
                      Review
                    </Button>
                  </Link>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardStats.shifts.scheduled}</div>
                  <p className="text-sm text-gray-600">Scheduled Shifts</p>
                  <Link href="/shifts">
                    <Button variant="outline" size="sm" className="mt-2">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
