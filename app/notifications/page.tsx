'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { 
  Bell, 
  Check, 
  X, 
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    title: 'Task Overdue',
    message: 'Your task "Clean restroom" is overdue',
    type: 'warning',
    isRead: false,
    createdAt: new Date('2024-01-25T10:30:00'),
    actionUrl: '/tasks/1'
  },
  {
    id: '2',
    title: 'Shift Reminder',
    message: 'Your shift starts in 30 minutes',
    type: 'info',
    isRead: false,
    createdAt: new Date('2024-01-25T08:30:00'),
    actionUrl: '/shifts'
  },
  {
    id: '3',
    title: 'PTO Approved',
    message: 'Your vacation request for Feb 1-3 has been approved',
    type: 'success',
    isRead: true,
    createdAt: new Date('2024-01-24T16:00:00'),
    actionUrl: '/pto'
  },
  {
    id: '4',
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: "Stock inventory"',
    type: 'info',
    isRead: true,
    createdAt: new Date('2024-01-24T14:00:00'),
    actionUrl: '/tasks'
  },
  {
    id: '5',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 11 PM to 1 AM',
    type: 'warning',
    isRead: true,
    createdAt: new Date('2024-01-24T10:00:00'),
    actionUrl: null
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const { user } = useAuthStore()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'success':
        return <Badge variant="success">Success</Badge>
      case 'warning':
        return <Badge variant="warning">Warning</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="info">Info</Badge>
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">Stay updated with important alerts and messages</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Notification Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Unread</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {unreadCount}
              </div>
              <p className="text-sm text-gray-500">New notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Read</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {notifications.length - unreadCount}
              </div>
              <p className="text-sm text-gray-500">Read notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {notifications.filter(n => n.type === 'warning' || n.type === 'error').length}
              </div>
              <p className="text-sm text-gray-500">Important alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>Your notification history</CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up! No new notifications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start space-x-4 p-4 border rounded-lg ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getNotificationBadge(notification.type)}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mt-1 ${!notification.isRead ? 'text-blue-700' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDateTime(notification.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
