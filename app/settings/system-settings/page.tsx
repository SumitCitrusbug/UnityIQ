'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Users, 
  Shield, 
  Clock, 
  AlertTriangle, 
  BarChart3,
  Save,
  RefreshCw,
  Info
} from 'lucide-react'

// Mock data for system settings
const mockCategoryWeights = {
  attendance: 30,
  punctuality: 30,
  taskEfficiency: 20,
  customerReviews: 20
}

const mockAlertThresholds = {
  lowScoreCutoff: 70,
  attendanceThreshold: 90,
  punctualityThreshold: 90,
  missedShiftsThreshold: 1,
  falseCompletionsThreshold: 2,
  falseCompletionsWindow: 30,
  lowReviewsThreshold: 95
}

const mockDisputeSettings = {
  finalizationTime: '23:59',
  disputeWindowEnd: '23:59',
  disputeWindowDay: 'Tuesday'
}

const mockRBACMatrix = {
  managers: {
    canExportCSV: true,
    canViewAllLocations: false,
    canOverrideDisputes: true,
    canManageBonuses: true
  },
  staff: {
    canViewLeaderboards: false,
    canViewReports: false,
    canClaimBonuses: true,
    canRaiseDisputes: true
  }
}

export default function SystemSettingsPage() {
  const [categoryWeights, setCategoryWeights] = useState(mockCategoryWeights)
  const [alertThresholds, setAlertThresholds] = useState(mockAlertThresholds)
  const [disputeSettings, setDisputeSettings] = useState(mockDisputeSettings)
  const [rbacMatrix, setRBACMatrix] = useState(mockRBACMatrix)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleWeightChange = (category: string, value: string) => {
    const numValue = parseInt(value) || 0
    setCategoryWeights(prev => ({
      ...prev,
      [category]: numValue
    }))
    setHasChanges(true)
  }

  const handleThresholdChange = (threshold: string, value: string) => {
    const numValue = parseInt(value) || 0
    setAlertThresholds(prev => ({
      ...prev,
      [threshold]: numValue
    }))
    setHasChanges(true)
  }

  const handleRBACToggle = (role: string, permission: string, value: boolean) => {
    setRBACMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [permission]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
    // Show success message
  }

  const getTotalWeight = () => {
    return Object.values(categoryWeights).reduce((sum, weight) => sum + weight, 0)
  }

  const isWeightValid = getTotalWeight() === 100

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings & Admin Control</h1>
          <p className="text-gray-600 mt-2">
            Configure Groove Score weights, alert thresholds, dispute windows, and RBAC policies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600">
              Unsaved Changes
            </Badge>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || !isWeightValid || isSaving}
            className="flex items-center space-x-2"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="weights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weights" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Category Weights</span>
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Alert Thresholds</span>
          </TabsTrigger>
          <TabsTrigger value="disputes" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Dispute Windows</span>
          </TabsTrigger>
          <TabsTrigger value="rbac" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>RBAC Matrix</span>
          </TabsTrigger>
        </TabsList>

        {/* Category Weights Tab */}
        <TabsContent value="weights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Category Weights & Score Formula</span>
              </CardTitle>
              <CardDescription>
                Configure the weights for each category in the weekly Groove Score calculation. 
                Total must equal 100%.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="attendance">Attendance %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="attendance"
                      type="number"
                      min="0"
                      max="100"
                      value={categoryWeights.attendance}
                      onChange={(e) => handleWeightChange('attendance', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="punctuality">Punctuality %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="punctuality"
                      type="number"
                      min="0"
                      max="100"
                      value={categoryWeights.punctuality}
                      onChange={(e) => handleWeightChange('punctuality', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taskEfficiency">Task Efficiency %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="taskEfficiency"
                      type="number"
                      min="0"
                      max="100"
                      value={categoryWeights.taskEfficiency}
                      onChange={(e) => handleWeightChange('taskEfficiency', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerReviews">Customer Reviews %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="customerReviews"
                      type="number"
                      min="0"
                      max="100"
                      value={categoryWeights.customerReviews}
                      onChange={(e) => handleWeightChange('customerReviews', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Weight:</span>
                  <Badge variant={isWeightValid ? "default" : "destructive"}>
                    {getTotalWeight()}%
                  </Badge>
                </div>
                {!isWeightValid && (
                  <p className="text-sm text-red-600 mt-2">
                    Total weight must equal exactly 100%
                  </p>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Effective From Next Run</p>
                    <p>Changes will apply to future weekly finalizations. Past finalized weeks are not re-scored.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Thresholds Tab */}
        <TabsContent value="thresholds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Low-Score Cutoff & Alert Thresholds</span>
              </CardTitle>
              <CardDescription>
                Configure thresholds for performance alerts and low-score detection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="lowScoreCutoff">Low Score Cutoff %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="lowScoreCutoff"
                      type="number"
                      min="0"
                      max="100"
                      value={alertThresholds.lowScoreCutoff}
                      onChange={(e) => handleThresholdChange('lowScoreCutoff', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attendanceThreshold">Attendance Threshold %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="attendanceThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={alertThresholds.attendanceThreshold}
                      onChange={(e) => handleThresholdChange('attendanceThreshold', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="punctualityThreshold">Punctuality Threshold %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="punctualityThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={alertThresholds.punctualityThreshold}
                      onChange={(e) => handleThresholdChange('punctualityThreshold', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="missedShiftsThreshold">Missed Shifts Threshold</Label>
                  <Input
                    id="missedShiftsThreshold"
                    type="number"
                    min="0"
                    value={alertThresholds.missedShiftsThreshold}
                    onChange={(e) => handleThresholdChange('missedShiftsThreshold', e.target.value)}
                    className="w-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="falseCompletionsThreshold">False Completions Threshold</Label>
                  <Input
                    id="falseCompletionsThreshold"
                    type="number"
                    min="0"
                    value={alertThresholds.falseCompletionsThreshold}
                    onChange={(e) => handleThresholdChange('falseCompletionsThreshold', e.target.value)}
                    className="w-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="falseCompletionsWindow">False Completions Window (days)</Label>
                  <Input
                    id="falseCompletionsWindow"
                    type="number"
                    min="1"
                    value={alertThresholds.falseCompletionsWindow}
                    onChange={(e) => handleThresholdChange('falseCompletionsWindow', e.target.value)}
                    className="w-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowReviewsThreshold">Low Reviews Threshold %</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="lowReviewsThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={alertThresholds.lowReviewsThreshold}
                      onChange={(e) => handleThresholdChange('lowReviewsThreshold', e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Applied Next Cycle</p>
                    <p>Threshold changes will apply to the next evaluation cycle. Current alerts are not affected.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dispute Windows Tab */}
        <TabsContent value="disputes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Finalization & Dispute Window</span>
              </CardTitle>
              <CardDescription>
                Configure weekly finalization time and dispute window settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="finalizationTime">Weekly Finalization Time</Label>
                  <Input
                    id="finalizationTime"
                    type="time"
                    value={disputeSettings.finalizationTime}
                    onChange={(e) => {
                      setDisputeSettings(prev => ({ ...prev, finalizationTime: e.target.value }))
                      setHasChanges(true)
                    }}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-500">Default: Sunday 23:59</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disputeWindowEnd">Dispute Window End Time</Label>
                  <Input
                    id="disputeWindowEnd"
                    type="time"
                    value={disputeSettings.disputeWindowEnd}
                    onChange={(e) => {
                      setDisputeSettings(prev => ({ ...prev, disputeWindowEnd: e.target.value }))
                      setHasChanges(true)
                    }}
                    className="w-32"
                  />
                  <p className="text-sm text-gray-500">Default: Tuesday 23:59</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disputeWindowDay">Dispute Window Day</Label>
                  <Select 
                    value={disputeSettings.disputeWindowDay}
                    onValueChange={(value) => {
                      setDisputeSettings(prev => ({ ...prev, disputeWindowDay: value }))
                      setHasChanges(true)
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Lock Rules</p>
                    <p>Locks trump overrides unless Admin forces with reason. Changes apply to future cycles only.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RBAC Matrix Tab */}
        <TabsContent value="rbac" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>RBAC Policy Matrix & Scope Controls</span>
              </CardTitle>
              <CardDescription>
                Configure permissions for different roles across Groove Score pages and features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                {/* Manager Permissions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Manager Permissions</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Export CSV</p>
                        <p className="text-sm text-gray-500">Can export reports and data to CSV</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.managers.canExportCSV}
                        onCheckedChange={(value) => handleRBACToggle('managers', 'canExportCSV', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">View All Locations</p>
                        <p className="text-sm text-gray-500">Can view data across all locations</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.managers.canViewAllLocations}
                        onCheckedChange={(value) => handleRBACToggle('managers', 'canViewAllLocations', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Override Disputes</p>
                        <p className="text-sm text-gray-500">Can override dispute decisions</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.managers.canOverrideDisputes}
                        onCheckedChange={(value) => handleRBACToggle('managers', 'canOverrideDisputes', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Manage Bonuses</p>
                        <p className="text-sm text-gray-500">Can approve/deny bonus claims</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.managers.canManageBonuses}
                        onCheckedChange={(value) => handleRBACToggle('managers', 'canManageBonuses', value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Staff Permissions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Staff Permissions</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">View Leaderboards</p>
                        <p className="text-sm text-gray-500">Can view team leaderboards</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.staff.canViewLeaderboards}
                        onCheckedChange={(value) => handleRBACToggle('staff', 'canViewLeaderboards', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">View Reports</p>
                        <p className="text-sm text-gray-500">Can view performance reports</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.staff.canViewReports}
                        onCheckedChange={(value) => handleRBACToggle('staff', 'canViewReports', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Claim Bonuses</p>
                        <p className="text-sm text-gray-500">Can submit bonus claims</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.staff.canClaimBonuses}
                        onCheckedChange={(value) => handleRBACToggle('staff', 'canClaimBonuses', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Raise Disputes</p>
                        <p className="text-sm text-gray-500">Can file dispute requests</p>
                      </div>
                      <Switch
                        checked={rbacMatrix.staff.canRaiseDisputes}
                        onCheckedChange={(value) => handleRBACToggle('staff', 'canRaiseDisputes', value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Immediate Effect</p>
                    <p>Permission changes apply immediately. All actions are audit-logged for compliance.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
