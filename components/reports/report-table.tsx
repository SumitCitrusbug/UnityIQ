'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ReportTableProps {
  data: any
}

export function ReportTable({ data }: ReportTableProps) {
  const performers = data.topPerformers || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Performance Data</CardTitle>
        <CardDescription>Individual employee performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  {data.completedTasks ? 'Tasks Completed' : 'Attendance %'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  {data.completedTasks ? 'Score' : 'Hours Worked'}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {performers.map((performer: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{performer.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">
                      {data.completedTasks ? performer.completed : performer.attendance}%
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">
                      {data.completedTasks ? performer.score : performer.hours}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant={
                        (data.completedTasks ? performer.score : performer.attendance) >= 95 
                          ? 'success' 
                          : (data.completedTasks ? performer.score : performer.attendance) >= 85 
                          ? 'warning' 
                          : 'destructive'
                      }
                    >
                      {(data.completedTasks ? performer.score : performer.attendance) >= 95 
                        ? 'Excellent' 
                        : (data.completedTasks ? performer.score : performer.attendance) >= 85 
                        ? 'Good' 
                        : 'Needs Improvement'
                      }
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {performers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No performance data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
