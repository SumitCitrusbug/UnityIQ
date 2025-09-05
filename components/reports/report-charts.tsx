'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface ReportChartsProps {
  data: any
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ReportCharts({ data }: ReportChartsProps) {
  // Task completion data
  const taskData = [
    { name: 'Completed', value: data.completedTasks || 0, color: '#00C49F' },
    { name: 'Failed', value: data.failedTasks || 0, color: '#FF8042' },
    { name: 'Pending', value: data.pendingTasks || 0, color: '#FFBB28' },
  ]

  // Performance data for bar chart
  const performanceData = data.topPerformers?.map((performer: any) => ({
    name: performer.name.split(' ')[0], // First name only
    completed: performer.completed || performer.attendance || 0,
    score: performer.score || 0,
  })) || []

  // Weekly trend data (mock)
  const weeklyTrend = [
    { day: 'Mon', tasks: 8, attendance: 95 },
    { day: 'Tue', tasks: 12, attendance: 98 },
    { day: 'Wed', tasks: 10, attendance: 92 },
    { day: 'Thu', tasks: 15, attendance: 96 },
    { day: 'Fri', tasks: 9, attendance: 94 },
    { day: 'Sat', tasks: 6, attendance: 90 },
    { day: 'Sun', tasks: 4, attendance: 88 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Task Completion Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Task Completion</CardTitle>
          <CardDescription>Distribution of task statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Employee performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Trend Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
          <CardDescription>Performance trends over the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="attendance" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Summary of important performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.completionRate || data.attendanceRate || 0}%
              </div>
              <div className="text-sm text-green-700">
                {data.completionRate ? 'Completion Rate' : 'Attendance Rate'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.totalTasks || data.totalShifts || 0}
              </div>
              <div className="text-sm text-blue-700">
                {data.totalTasks ? 'Total Tasks' : 'Total Shifts'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.averageCompletionTime || data.averageHours || '0h'}
              </div>
              <div className="text-sm text-purple-700">
                {data.averageCompletionTime ? 'Avg Completion Time' : 'Avg Hours'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {data.failedTasks || data.missedShifts || 0}
              </div>
              <div className="text-sm text-orange-700">
                {data.failedTasks ? 'Failed Tasks' : 'Missed Shifts'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
