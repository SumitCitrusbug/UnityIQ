'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Calendar,
  Clock,
  FileText,
  Settings,
  AlertTriangle,
  BarChart3,
  UserCheck,
  CalendarDays,
  Timer,
  Briefcase,
  DollarSign,
  Shield,
  Bell,
  LogOut,
  Building,
  MapPin,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'staff'] },
  { name: 'Tasks', href: '/tasks', icon: ClipboardList, roles: ['admin', 'manager', 'staff'] },
  { name: 'Templates', href: '/templates', icon: FileText, roles: ['admin'] },
  { name: 'Brands', href: '/brands', icon: Building, roles: ['admin'] },
  { name: 'Locations', href: '/locations', icon: MapPin, roles: ['admin'] },
  { name: 'Assign', href: '/assign', icon: UserCheck, roles: ['admin', 'manager'] },
  { name: 'Reviews', href: '/reviews', icon: Users, roles: ['admin', 'manager'] },
  { name: 'Shifts', href: '/shifts', icon: Calendar, roles: ['admin', 'manager', 'staff'] },
  { name: 'Time Clock', href: '/clock', icon: Clock, roles: ['admin', 'manager', 'staff'] },
  { name: 'Breaks', href: '/breaks', icon: Timer, roles: ['admin', 'manager'] },
  { name: 'PTO', href: '/pto', icon: CalendarDays, roles: ['admin', 'manager', 'staff'] },
  { name: 'Swaps', href: '/swaps', icon: Briefcase, roles: ['admin', 'manager', 'staff'] },
  { name: 'Disputes', href: '/disputes', icon: AlertTriangle, roles: ['admin', 'manager', 'staff'] },
  { name: 'My Groove Score', href: '/groove-score/my-score', icon: TrendingUp, roles: ['staff'] },
  { name: 'Team Scores', href: '/groove-score/team-scores', icon: Users, roles: ['admin', 'manager'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'manager'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'manager'] },
  { name: 'Bonuses', href: '/bonuses', icon: DollarSign, roles: ['admin', 'manager'] },
  { name: 'Payroll', href: '/payroll', icon: DollarSign, roles: ['admin'] },
  { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['admin', 'manager', 'staff'] },
  { name: 'Audit', href: '/audit', icon: Shield, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  { name: 'Location Settings', href: '/settings/location-settings', icon: MapPin, roles: ['admin'] },
  { name: 'System Settings', href: '/settings/system-settings', icon: Settings, roles: ['admin'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout, hasRole } = useAuthStore()

  const filteredNavigation = navigation.filter(item => 
    hasRole(item.roles as any)
  )

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">UnityIQ</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
