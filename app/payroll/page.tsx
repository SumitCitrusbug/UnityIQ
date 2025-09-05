'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { 
  DollarSign, 
  Download, 
  Clock, 
  Users,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock payroll data
const mockPayrollData = [
  {
    id: '1',
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    position: 'Operations Manager',
    hoursWorked: 40,
    hourlyRate: 25.00,
    overtimeHours: 5,
    overtimeRate: 37.50,
    bonuses: 100,
    deductions: 50,
    grossPay: 1125.00,
    netPay: 1075.00,
    status: 'processed',
    payPeriod: '2024-01-01 to 2024-01-15'
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    position: 'Staff Member',
    hoursWorked: 35,
    hourlyRate: 18.00,
    overtimeHours: 0,
    overtimeRate: 27.00,
    bonuses: 50,
    deductions: 30,
    grossPay: 680.00,
    netPay: 650.00,
    status: 'pending',
    payPeriod: '2024-01-01 to 2024-01-15'
  },
  {
    id: '3',
    employeeName: 'Mike Johnson',
    employeeId: 'EMP003',
    position: 'Maintenance',
    hoursWorked: 40,
    hourlyRate: 22.00,
    overtimeHours: 8,
    overtimeRate: 33.00,
    bonuses: 0,
    deductions: 40,
    grossPay: 1024.00,
    netPay: 984.00,
    status: 'processed',
    payPeriod: '2024-01-01 to 2024-01-15'
  }
]

export default function PayrollPage() {
  const [payrollData] = useState(mockPayrollData)
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin', 'manager'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view payroll information.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge variant="success">Processed</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const handleExportPayroll = () => {
    console.log('Exporting payroll data...')
  }

  const handleProcessPayroll = () => {
    console.log('Processing payroll...')
  }

  const totalGrossPay = payrollData.reduce((sum, employee) => sum + employee.grossPay, 0)
  const totalNetPay = payrollData.reduce((sum, employee) => sum + employee.netPay, 0)
  const totalDeductions = payrollData.reduce((sum, employee) => sum + employee.deductions, 0)
  const totalBonuses = payrollData.reduce((sum, employee) => sum + employee.bonuses, 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600">Process and manage employee payroll</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleExportPayroll}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleProcessPayroll}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Gross Pay</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ${totalGrossPay.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Total gross pay</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Net Pay</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${totalNetPay.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Total net pay</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Deductions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                ${totalDeductions.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Total deductions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Bonuses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ${totalBonuses.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500">Total bonuses</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Details</CardTitle>
            <CardDescription>Current pay period: January 1-15, 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Employee</th>
                    <th className="text-left py-3 px-4">Hours</th>
                    <th className="text-left py-3 px-4">Rate</th>
                    <th className="text-left py-3 px-4">Overtime</th>
                    <th className="text-left py-3 px-4">Bonuses</th>
                    <th className="text-left py-3 px-4">Deductions</th>
                    <th className="text-left py-3 px-4">Gross</th>
                    <th className="text-left py-3 px-4">Net</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{employee.employeeName}</div>
                          <div className="text-sm text-gray-500">{employee.position}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{employee.hoursWorked}</td>
                      <td className="py-3 px-4">${employee.hourlyRate.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        {employee.overtimeHours > 0 ? (
                          <div>
                            <div>{employee.overtimeHours}h</div>
                            <div className="text-sm text-gray-500">${employee.overtimeRate.toFixed(2)}/h</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {employee.bonuses > 0 ? `$${employee.bonuses.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {employee.deductions > 0 ? `$${employee.deductions.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${employee.grossPay.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-bold text-green-600">
                        ${employee.netPay.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(employee.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Payroll Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Payroll Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Individual Payslips
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Tax Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Pay Period</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Period:</span>
                  <span className="text-sm font-medium">Jan 1-15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pay Date:</span>
                  <span className="text-sm font-medium">Jan 20, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Employees:</span>
                  <span className="text-sm font-medium">{payrollData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="warning">Processing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
