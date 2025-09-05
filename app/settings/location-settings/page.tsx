'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import { 
  Settings, 
  MapPin, 
  Clock, 
  Coffee,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Save
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data for locations with their specific settings
const mockLocations = [
  {
    id: '1',
    name: 'Main Office',
    brand: 'Craft Therapy Network',
    timezone: 'America/Los_Angeles',
    settings: {
      // Time Clock Settings
      earlyClockInWindow: 5, // minutes
      lateGraceWindow: 5, // minutes
      noShowThreshold: 30, // minutes
      
      // Break Settings
      lunchBreakDuration: 30, // minutes
      personalBreakDuration: 15, // minutes
      maxLunchBreaks: 1,
      maxPersonalBreaks: 2,
      lunchEligibilityHours: 4, // minimum hours for lunch
      oneStaffPerLocationBreak: true,
      
      // Attendance Settings
      minimumShiftsPerWeek: 2,
      attendancePenaltyPercent: 5,
      
      // Payroll Settings
      hourlyRate: 18.00,
      overtimeRate: 27.00,
      overtimeThreshold: 40, // hours per week
      
      // PTO Settings
      ptoAccrualRate: 1.25, // hours per month
      probationPeriodMonths: 3,
      ptoRequestDeadline: 15, // day of month
      
      // Bonus Settings
      perfectAttendanceBonus: 50,
      performanceBonusThreshold: 95,
      performanceBonusAmount: 100
    }
  },
  {
    id: '2',
    name: 'Branch Office',
    brand: 'Craft Therapy Network',
    timezone: 'America/Los_Angeles',
    settings: {
      earlyClockInWindow: 10,
      lateGraceWindow: 10,
      noShowThreshold: 45,
      lunchBreakDuration: 45,
      personalBreakDuration: 15,
      maxLunchBreaks: 1,
      maxPersonalBreaks: 3,
      lunchEligibilityHours: 5,
      oneStaffPerLocationBreak: true,
      minimumShiftsPerWeek: 2,
      attendancePenaltyPercent: 3,
      hourlyRate: 20.00,
      overtimeRate: 30.00,
      overtimeThreshold: 40,
      ptoAccrualRate: 1.5,
      probationPeriodMonths: 3,
      ptoRequestDeadline: 15,
      perfectAttendanceBonus: 75,
      performanceBonusThreshold: 90,
      performanceBonusAmount: 150
    }
  }
]

export default function LocationSettingsPage() {
  const [locations, setLocations] = useState(mockLocations)
  const [selectedLocation, setSelectedLocation] = useState(mockLocations[0])
  const [isEditing, setIsEditing] = useState(false)
  const [editedSettings, setEditedSettings] = useState(selectedLocation.settings)
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage location settings.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location)
    setEditedSettings(location.settings)
    setIsEditing(false)
  }

  const handleSettingChange = (key: string, value: any) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    const updatedLocations = locations.map(loc => 
      loc.id === selectedLocation.id 
        ? { ...loc, settings: editedSettings }
        : loc
    )
    setLocations(updatedLocations)
    setSelectedLocation({ ...selectedLocation, settings: editedSettings })
    setIsEditing(false)
    console.log('Settings saved for location:', selectedLocation.name)
  }

  const handleResetSettings = () => {
    setEditedSettings(selectedLocation.settings)
    setIsEditing(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Location Settings</h1>
            <p className="text-gray-600">Configure location-specific rules and policies</p>
          </div>
          <div className="flex space-x-3">
            {isEditing && (
              <>
                <Button variant="outline" onClick={handleResetSettings}>
                  Reset
                </Button>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Edit Settings
              </Button>
            )}
          </div>
        </div>

        {/* Location Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Location</CardTitle>
            <CardDescription>Choose a location to configure its settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocation.id === location.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.brand}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Clock Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Time Clock Settings</span>
              </CardTitle>
              <CardDescription>Configure clock-in/out policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="earlyWindow">Early Clock-In Window (minutes)</Label>
                  <Input
                    id="earlyWindow"
                    type="number"
                    value={editedSettings.earlyClockInWindow}
                    onChange={(e) => handleSettingChange('earlyClockInWindow', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateWindow">Late Grace Window (minutes)</Label>
                  <Input
                    id="lateWindow"
                    type="number"
                    value={editedSettings.lateGraceWindow}
                    onChange={(e) => handleSettingChange('lateGraceWindow', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noShowThreshold">No-Show Threshold (minutes)</Label>
                <Input
                  id="noShowThreshold"
                  type="number"
                  value={editedSettings.noShowThreshold}
                  onChange={(e) => handleSettingChange('noShowThreshold', parseInt(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Break Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coffee className="h-5 w-5" />
                <span>Break Settings</span>
              </CardTitle>
              <CardDescription>Configure break policies and rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lunchDuration">Lunch Break Duration (minutes)</Label>
                  <Input
                    id="lunchDuration"
                    type="number"
                    value={editedSettings.lunchBreakDuration}
                    onChange={(e) => handleSettingChange('lunchBreakDuration', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalDuration">Personal Break Duration (minutes)</Label>
                  <Input
                    id="personalDuration"
                    type="number"
                    value={editedSettings.personalBreakDuration}
                    onChange={(e) => handleSettingChange('personalBreakDuration', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxLunch">Max Lunch Breaks</Label>
                  <Input
                    id="maxLunch"
                    type="number"
                    value={editedSettings.maxLunchBreaks}
                    onChange={(e) => handleSettingChange('maxLunchBreaks', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPersonal">Max Personal Breaks</Label>
                  <Input
                    id="maxPersonal"
                    type="number"
                    value={editedSettings.maxPersonalBreaks}
                    onChange={(e) => handleSettingChange('maxPersonalBreaks', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunchEligibility">Lunch Eligibility (minimum hours)</Label>
                <Input
                  id="lunchEligibility"
                  type="number"
                  value={editedSettings.lunchEligibilityHours}
                  onChange={(e) => handleSettingChange('lunchEligibilityHours', parseInt(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payroll Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Payroll Settings</span>
              </CardTitle>
              <CardDescription>Configure location-specific pay rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={editedSettings.hourlyRate}
                    onChange={(e) => handleSettingChange('hourlyRate', parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeRate">Overtime Rate ($)</Label>
                  <Input
                    id="overtimeRate"
                    type="number"
                    step="0.01"
                    value={editedSettings.overtimeRate}
                    onChange={(e) => handleSettingChange('overtimeRate', parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="overtimeThreshold">Overtime Threshold (hours/week)</Label>
                <Input
                  id="overtimeThreshold"
                  type="number"
                  value={editedSettings.overtimeThreshold}
                  onChange={(e) => handleSettingChange('overtimeThreshold', parseInt(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bonus Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Bonus Settings</span>
              </CardTitle>
              <CardDescription>Configure location-specific bonus rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="attendanceBonus">Perfect Attendance Bonus ($)</Label>
                <Input
                  id="attendanceBonus"
                  type="number"
                  value={editedSettings.perfectAttendanceBonus}
                  onChange={(e) => handleSettingChange('perfectAttendanceBonus', parseInt(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="performanceThreshold">Performance Threshold (%)</Label>
                  <Input
                    id="performanceThreshold"
                    type="number"
                    value={editedSettings.performanceBonusThreshold}
                    onChange={(e) => handleSettingChange('performanceBonusThreshold', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="performanceBonus">Performance Bonus ($)</Label>
                  <Input
                    id="performanceBonus"
                    type="number"
                    value={editedSettings.performanceBonusAmount}
                    onChange={(e) => handleSettingChange('performanceBonusAmount', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PTO Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>PTO & Attendance Settings</span>
            </CardTitle>
            <CardDescription>Configure PTO accrual and attendance policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ptoAccrual">PTO Accrual Rate (hours/month)</Label>
                <Input
                  id="ptoAccrual"
                  type="number"
                  step="0.01"
                  value={editedSettings.ptoAccrualRate}
                  onChange={(e) => handleSettingChange('ptoAccrualRate', parseFloat(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="probationPeriod">Probation Period (months)</Label>
                <Input
                  id="probationPeriod"
                  type="number"
                  value={editedSettings.probationPeriodMonths}
                  onChange={(e) => handleSettingChange('probationPeriodMonths', parseInt(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ptoDeadline">PTO Request Deadline (day of month)</Label>
                <Input
                  id="ptoDeadline"
                  type="number"
                  min="1"
                  max="31"
                  value={editedSettings.ptoRequestDeadline}
                  onChange={(e) => handleSettingChange('ptoRequestDeadline', parseInt(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Settings Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Settings Summary</CardTitle>
            <CardDescription>Overview of configured settings for {selectedLocation.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Time Clock</div>
                <div className="text-lg font-bold text-blue-800">
                  {editedSettings.earlyClockInWindow}m early, {editedSettings.lateGraceWindow}m late
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Breaks</div>
                <div className="text-lg font-bold text-green-800">
                  {editedSettings.lunchBreakDuration}m lunch, {editedSettings.personalBreakDuration}m personal
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Payroll</div>
                <div className="text-lg font-bold text-purple-800">
                  ${editedSettings.hourlyRate}/hr, ${editedSettings.overtimeRate} OT
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Bonuses</div>
                <div className="text-lg font-bold text-orange-800">
                  ${editedSettings.perfectAttendanceBonus} attendance
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
