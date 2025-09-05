'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/store'
import { 
  Settings, 
  Clock, 
  Bell, 
  Shield, 
  Users,
  Database,
  Save
} from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    gracePeriod: 15, // minutes
    lateThreshold: 5, // minutes
    notificationEmail: true,
    notificationSms: false,
    autoCarryForward: true,
    scorePenalty: 5, // points
    maxDisputes: 3,
    dataRetention: 365, // days
  })
  const [isSaving, setIsSaving] = useState(false)
  const { hasRole } = useAuthStore()

  if (!hasRole('admin')) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access settings.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      // Show success message
    }, 1000)
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>

        {/* Attendance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Attendance Settings</span>
            </CardTitle>
            <CardDescription>Configure attendance and time tracking rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gracePeriod">Grace Period (minutes)</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  value={settings.gracePeriod}
                  onChange={(e) => handleSettingChange('gracePeriod', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500">Allowable time after scheduled start before marking as late</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lateThreshold">Late Threshold (minutes)</Label>
                <Input
                  id="lateThreshold"
                  type="number"
                  value={settings.lateThreshold}
                  onChange={(e) => handleSettingChange('lateThreshold', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500">Time after grace period to mark as late</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Auto Carry Forward</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.autoCarryForward}
                  onChange={(e) => handleSettingChange('autoCarryForward', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Automatically carry forward overdue tasks to the next day</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Settings</span>
            </CardTitle>
            <CardDescription>Configure how users receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationEmail}
                  onChange={(e) => handleSettingChange('notificationEmail', e.target.checked)}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notificationSms}
                  onChange={(e) => handleSettingChange('notificationSms', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scoring Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Scoring & Penalties</span>
            </CardTitle>
            <CardDescription>Configure scoring rules and penalties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="scorePenalty">Failed Task Penalty (points)</Label>
                <Input
                  id="scorePenalty"
                  type="number"
                  value={settings.scorePenalty}
                  onChange={(e) => handleSettingChange('scorePenalty', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500">Points deducted for failed tasks</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDisputes">Max Disputes per Month</Label>
                <Input
                  id="maxDisputes"
                  type="number"
                  value={settings.maxDisputes}
                  onChange={(e) => handleSettingChange('maxDisputes', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500">Maximum disputes an employee can submit per month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Data Management</span>
            </CardTitle>
            <CardDescription>Configure data retention and management policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
              <Input
                id="dataRetention"
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500">How long to keep completed task data before archiving</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Data Protection</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                All data is encrypted and stored securely. Regular backups are performed automatically.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
