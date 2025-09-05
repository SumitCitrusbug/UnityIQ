'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsChartsProps {
  data: any
  timeRange: 'week' | 'month' | 'quarter'
  selectedMetric: 'tasks' | 'attendance' | 'performance'
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function AnalyticsCharts({ data, timeRange, selectedMetric }: AnalyticsChartsProps) {
  const chartData = timeRange === 'week' ? data.trends.weekly : data.trends.monthly

  const taskStatusData = [
    { name: 'Completed', value: data.taskCompletion.completed, color: '#00C49F' },
    { name: 'Failed', value: data.taskCompletion.failed, color: '#FF8042' },
    { name: 'Pending', value: data.taskCompletion.pending, color: '#FFBB28' },
  ]

  const attendanceData = [
    { name: 'Present', value: data.attendance.completedShifts, color: '#00C49F' },
    { name: 'Missed', value: data.attendance.missedShifts, color: '#FF8042' },
    { name: 'Late', value: data.attendance.lateArrivals, color: '#FFBB28' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>
            {selectedMetric === 'tasks' ? 'Task completion' : 
             selectedMetric === 'attendance' ? 'Attendance rates' : 
             'Performance scores'} over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={timeRange === 'week' ? 'week' : 'month'} />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={selectedMetric === 'tasks' ? 'tasks' : 'attendance'} 
                stroke="#8884d8" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Task Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status Distribution</CardTitle>
          <CardDescription>Breakdown of task completion status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Attendance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Breakdown</CardTitle>
          <CardDescription>Distribution of attendance status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Task Completion Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${data.taskCompletion.completionRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.taskCompletion.completionRate}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Attendance Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${data.attendance.attendanceRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.attendance.attendanceRate}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${data.performance.averageScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.performance.averageScore}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
