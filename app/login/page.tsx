'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/store'
import { User } from '@/lib/types'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@shiftiq.com',
    role: 'admin',
    department: 'Operations',
    location: 'Main Office',
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@shiftiq.com',
    role: 'manager',
    department: 'Operations',
    location: 'Main Office',
  },
  {
    id: '3',
    name: 'Staff User',
    email: 'staff@shiftiq.com',
    role: 'staff',
    department: 'Operations',
    location: 'Main Office',
  },
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === data.email)
      
      if (user && data.password === 'password') {
        login(user)
        toast.success(`Welcome back, ${user.name}!`)
        router.push('/dashboard')
      } else {
        toast.error('Invalid credentials')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">ShiftIQ</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-medium">Demo Accounts:</p>
            <p>Admin: admin@shiftiq.com</p>
            <p>Manager: manager@shiftiq.com</p>
            <p>Staff: staff@shiftiq.com</p>
            <p className="mt-2">Password: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
