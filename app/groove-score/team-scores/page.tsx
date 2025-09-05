'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Download } from 'lucide-react'

export default function TeamScoresPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Groove Scores</h1>
          <p className="text-gray-600 mt-2">
            Monitor team performance and identify coaching opportunities
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">Main Street</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">84%</Badge>
                <span className="text-xs text-gray-500">Finalized</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-gray-600">Main Street</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default">91%</Badge>
                <span className="text-xs text-gray-500">Finalized</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
