'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Hydrate the store
    useAuthStore.persist.rehydrate()
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    if (isAuthenticated && user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, user, isHydrated, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">ShiftIQ</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
