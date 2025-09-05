'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BonusRuleForm } from '@/components/bonuses/bonus-rule-form'
import { formatDate } from '@/lib/utils'
import { 
  DollarSign, 
  Plus, 
  Target, 
  TrendingUp,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockBonusRules = [
  {
    id: '1',
    name: 'Perfect Attendance Bonus',
    description: 'Bonus for perfect attendance in a month',
    type: 'attendance',
    target: 100,
    bonus: 50,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin-1'
  },
  {
    id: '2',
    name: 'Task Completion Excellence',
    description: 'Bonus for 95%+ task completion rate',
    type: 'performance',
    target: 95,
    bonus: 100,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin-1'
  },
  {
    id: '3',
    name: 'Team Player Bonus',
    description: 'Bonus for helping team members',
    type: 'teamwork',
    target: 5,
    bonus: 25,
    status: 'inactive',
    createdAt: new Date('2024-01-10'),
    createdBy: 'admin-1'
  }
]

const mockBonusEarnings = [
  {
    id: '1',
    employeeName: 'John Doe',
    ruleName: 'Perfect Attendance Bonus',
    amount: 50,
    earnedDate: new Date('2024-01-31'),
    status: 'paid'
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    ruleName: 'Task Completion Excellence',
    amount: 100,
    earnedDate: new Date('2024-01-30'),
    status: 'pending'
  }
]

export default function BonusesPage() {
  const [bonusRules] = useState(mockBonusRules)
  const [bonusEarnings] = useState(mockBonusEarnings)
  const [isRuleOpen, setIsRuleOpen] = useState(false)
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin', 'manager'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage bonuses.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      case 'paid':
        return <Badge variant="success">Paid</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const handleBonusRuleCreated = (rule: any) => {
    console.log('Bonus rule created:', rule)
    setIsRuleOpen(false)
  }

  const totalBonusesPaid = bonusEarnings
    .filter(earning => earning.status === 'paid')
    .reduce((sum, earning) => sum + earning.amount, 0)

  const totalBonusesPending = bonusEarnings
    .filter(earning => earning.status === 'pending')
    .reduce((sum, earning) => sum + earning.amount, 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bonus Management</h1>
            <p className="text-gray-600">Configure and track employee bonuses</p>
          </div>
          <Dialog open={isRuleOpen} onOpenChange={setIsRuleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Bonus Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Bonus Rule</DialogTitle>
                <DialogDescription>
                  Set up a new bonus rule for employees
                </DialogDescription>
              </DialogHeader>
              <BonusRuleForm
                onSubmit={handleBonusRuleCreated}
                onCancel={() => setIsRuleOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Bonus Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Total Paid</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${totalBonusesPaid}
              </div>
              <p className="text-sm text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                ${totalBonusesPending}
              </div>
              <p className="text-sm text-gray-500">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Active Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {bonusRules.filter(rule => rule.status === 'active').length}
              </div>
              <p className="text-sm text-gray-500">Bonus rules</p>
            </CardContent>
          </Card>
        </div>

        {/* Bonus Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Bonus Rules</CardTitle>
            <CardDescription>Configure bonus criteria and amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bonusRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{rule.name}</h3>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>Type: {rule.type}</span>
                        <span>Target: {rule.target}%</span>
                        <span>Bonus: ${rule.bonus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(rule.status)}
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bonus Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bonus Earnings</CardTitle>
            <CardDescription>Track bonus payments and pending amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bonusEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{earning.employeeName}</h3>
                      <p className="text-sm text-gray-600">{earning.ruleName}</p>
                      <p className="text-sm text-gray-500">
                        Earned: {formatDate(earning.earnedDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${earning.amount}
                      </div>
                    </div>
                    {getStatusBadge(earning.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
