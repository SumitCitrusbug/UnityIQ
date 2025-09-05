'use client'

import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/store'

export function Header() {
  const { user } = useAuthStore()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tasks, shifts, users..."
              className="pl-10 w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
