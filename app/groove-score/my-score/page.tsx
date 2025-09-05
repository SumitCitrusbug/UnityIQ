'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Info,
  Clock,
  CheckCircle,
  Star,
  Target,
  History,
  AlertCircle
} from 'lucide-react'
import { GrooveScore, GrooveScoreHistory, LocationScoreBreakdown } from '@/lib/types'

// Mock data for current week score
const mockCurrentScore: GrooveScore = {
  id: '1',
  userId: 'user-1',
  staffName: 'John Doe',
  weekStartDate: new Date('2024-01-15'),
  weekEndDate: new Date('2024-01-21'),
  totalScore: 84,
  attendanceScore: 92,
  punctualityScore: 80,
  taskEfficiencyScore: 75,
  customerReviewsScore: 96,
  isFinalized: true,
  finalizedAt: new Date('2024-01-21T23:59:00'),
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-21T23:59:00'),
  locationBreakdown: [
    {
      locationId: 'loc-1',
      locationName: 'Main Street',
      daysWorked: 3,
      customerReviewsScore: 90,
      attendanceScore: 100,
      punctualityScore: 75,
      taskEfficiencyScore: 80
    },
    {
      locationId: 'loc-2',
      locationName: 'Downtown',
      daysWorked: 2,
      customerReviewsScore: 100,
      attendanceScore: 80,
      punctualityScore: 85,
      taskEfficiencyScore: 70
    }
  ]
}

// Mock data for score history
const mockScoreHistory: GrooveScoreHistory[] = [
  {
    weekStartDate: new Date('2024-01-08'),
    weekEndDate: new Date('2024-01-14'),
    totalScore: 78,
    isEligible: true,
    isFinalized: true
  },
  {
    weekStartDate: new Date('2024-01-01'),
    weekEndDate: new Date('2024-01-07'),
    totalScore: 82,
    isEligible: true,
    isFinalized: true
  },
  {
    weekStartDate: new Date('2023-12-25'),
    weekEndDate: new Date('2023-12-31'),
    totalScore: 0,
    isEligible: false,
    isFinalized: true
  },
  {
    weekStartDate: new Date('2023-12-18'),
    weekEndDate: new Date('2023-12-24'),
    totalScore: 88,
    isEligible: true,
    isFinalized: true
  },
  {
    weekStartDate: new Date('2023-12-11'),
    weekEndDate: new Date('2023-12-17'),
    totalScore: 91,
    isEligible: true,
    isFinalized: true
  },
  {
    weekStartDate: new Date('2023-12-04'),
    weekEndDate: new Date('2023-12-10'),
    totalScore: 85,
    isEligible: true,
    isFinalized: true
  },
  {
    weekStartDate: new Date('2023-11-27'),
    weekEndDate: new Date('2023-12-03'),
    totalScore: 79,
    isEligible: true,
    isFinalized: true
  },
  {
    weekStartDate: new Date('2023-11-20'),
    weekEndDate: new Date('2023-11-26'),
    totalScore: 93,
    isEligible: true,
    isFinalized: true
  }
]

const categoryWeights = {
  attendance: 30,
  punctuality: 30,
  taskEfficiency: 20,
  customerReviews: 20
}

export default function MyGrooveScorePage() {
  const [currentScore] = useState<GrooveScore>(mockCurrentScore)
  const [scoreHistory] = useState<GrooveScoreHistory[]>(mockScoreHistory)

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default'
    if (score >= 80) return 'secondary'
    if (score >= 70) return 'outline'
    return 'destructive'
  }

  const formatWeekRange = (startDate: Date, endDate: Date) => {
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  const getTrendText = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 0) return `+${diff}% from last week`
    if (diff < 0) return `${diff}% from last week`
    return 'Same as last week'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Groove Score</h1>
          <p className="text-gray-600 mt-2">
            Track your weekly performance across all categories
          </p>
        </div>
        <Badge variant={getScoreBadgeVariant(currentScore.totalScore)} className="text-lg px-4 py-2">
          {currentScore.totalScore}%
        </Badge>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Current Week</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>8-Week History</span>
          </TabsTrigger>
        </TabsList>

        {/* Current Week Tab */}
        <TabsContent value="current" className="space-y-6">
          {/* Week Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Week of {formatWeekRange(currentScore.weekStartDate, currentScore.weekEndDate)}</span>
              </CardTitle>
              <CardDescription>
                {currentScore.isFinalized ? (
                  <span className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Finalized on {currentScore.finalizedAt?.toLocaleDateString()}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2 text-yellow-600">
                    <Clock className="h-4 w-4" />
                    <span>Provisional - Finalizes Sunday 11:59 PM</span>
                  </span>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Groove Score</span>
                <div className="flex items-center space-x-2">
                  {scoreHistory.length > 0 && getTrendIcon(currentScore.totalScore, scoreHistory[0].totalScore)}
                  <span className={`text-3xl font-bold ${getScoreColor(currentScore.totalScore)}`}>
                    {currentScore.totalScore}%
                  </span>
                </div>
              </CardTitle>
              {scoreHistory.length > 0 && (
                <CardDescription>
                  {getTrendText(currentScore.totalScore, scoreHistory[0].totalScore)}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Progress value={currentScore.totalScore} className="h-3" />
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Attendance</span>
                  <Badge variant="outline">{categoryWeights.attendance}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {currentScore.attendanceScore}%
                    </span>
                  </div>
                  <Progress value={currentScore.attendanceScore} className="h-2" />
                  <p className="text-sm text-gray-600">
                    Scheduled Days Worked ÷ Scheduled Days
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Punctuality */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Punctuality</span>
                  <Badge variant="outline">{categoryWeights.punctuality}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {currentScore.punctualityScore}%
                    </span>
                  </div>
                  <Progress value={currentScore.punctualityScore} className="h-2" />
                  <p className="text-sm text-gray-600">
                    On-Time Clock-ins ÷ Total Shifts
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Task Efficiency */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Task Efficiency</span>
                  <Badge variant="outline">{categoryWeights.taskEfficiency}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">
                      {currentScore.taskEfficiencyScore}%
                    </span>
                  </div>
                  <Progress value={currentScore.taskEfficiencyScore} className="h-2" />
                  <p className="text-sm text-gray-600">
                    Pass Days ÷ Days Worked × 100
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span>Customer Reviews</span>
                  <Badge variant="outline">{categoryWeights.customerReviews}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-600">
                      {currentScore.customerReviewsScore}%
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Info className="h-3 w-3" />
                      <span>Location-wide</span>
                    </div>
                  </div>
                  <Progress value={currentScore.customerReviewsScore} className="h-2" />
                  <p className="text-sm text-gray-600">
                    5-Star Reviews ÷ Total Reviews (blended across locations)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Multi-Location Breakdown */}
          {currentScore.locationBreakdown && currentScore.locationBreakdown.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Breakdown</span>
                </CardTitle>
                <CardDescription>
                  You worked at multiple locations this week. Here's how your scores were calculated:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentScore.locationBreakdown.map((location, index) => (
                    <div key={location.locationId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{location.locationName}</h4>
                        <Badge variant="outline">{location.daysWorked} days</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Reviews</p>
                          <p className="font-semibold">{location.customerReviewsScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Attendance</p>
                          <p className="font-semibold">{location.attendanceScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Punctuality</p>
                          <p className="font-semibold">{location.punctualityScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tasks</p>
                          <p className="font-semibold">{location.taskEfficiencyScore}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">How it works</p>
                        <p>Your overall score is calculated by averaging the location scores, weighted by the number of days you worked at each location.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dispute Link */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Dispute this week's score?</p>
                    <p className="text-sm text-gray-600">
                      You can dispute specific events (missed punches, task failures) that affected your score.
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  File Dispute
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>8-Week Performance History</CardTitle>
              <CardDescription>
                Track your progress over the last 8 weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoreHistory.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">
                          {formatWeekRange(week.weekStartDate, week.weekEndDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {week.isFinalized ? 'Finalized' : 'Provisional'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {week.isEligible ? (
                        <>
                          <Badge variant={getScoreBadgeVariant(week.totalScore)}>
                            {week.totalScore}%
                          </Badge>
                          {index > 0 && getTrendIcon(week.totalScore, scoreHistory[index - 1].totalScore)}
                        </>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          No Shifts
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
