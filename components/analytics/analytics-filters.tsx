'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalyticsFiltersProps {
  timeRange: 'week' | 'month' | 'quarter'
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter') => void
  selectedMetric: 'tasks' | 'attendance' | 'performance'
  onMetricChange: (metric: 'tasks' | 'attendance' | 'performance') => void
}

export function AnalyticsFilters({ 
  timeRange, 
  onTimeRangeChange, 
  selectedMetric, 
  onMetricChange 
}: AnalyticsFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Filters</CardTitle>
        <CardDescription>Customize your analytics view</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Time Range</h4>
            <div className="flex space-x-2">
              <Button
                variant={timeRange === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeRangeChange('week')}
              >
                Week
              </Button>
              <Button
                variant={timeRange === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeRangeChange('month')}
              >
                Month
              </Button>
              <Button
                variant={timeRange === 'quarter' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTimeRangeChange('quarter')}
              >
                Quarter
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Focus Metric</h4>
            <div className="flex space-x-2">
              <Button
                variant={selectedMetric === 'tasks' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onMetricChange('tasks')}
              >
                Tasks
              </Button>
              <Button
                variant={selectedMetric === 'attendance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onMetricChange('attendance')}
              >
                Attendance
              </Button>
              <Button
                variant={selectedMetric === 'performance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onMetricChange('performance')}
              >
                Performance
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
