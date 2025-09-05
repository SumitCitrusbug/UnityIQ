'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LocationForm } from '@/components/locations/location-form'
import { formatDate, formatTime } from '@/lib/utils'
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2,
  Clock,
  Wifi,
  Users,
  Building,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockLocations = [
  {
    id: '1',
    name: 'Main Office',
    brand: 'Craft Therapy Network',
    brandId: '1',
    timezone: 'America/Los_Angeles',
    storeHours: {
      open: '09:00',
      close: '21:00'
    },
    approvedIPs: ['203.0.113.17', '203.0.113.18'],
    status: 'active',
    staffCount: 8,
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin-1'
  },
  {
    id: '2',
    name: 'Branch Office',
    brand: 'Craft Therapy Network',
    brandId: '1',
    timezone: 'America/Los_Angeles',
    storeHours: {
      open: '10:00',
      close: '20:00'
    },
    approvedIPs: ['203.0.113.19'],
    status: 'active',
    staffCount: 4,
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin-1'
  },
  {
    id: '3',
    name: 'Downtown Store',
    brand: 'Shroom Groove',
    brandId: '2',
    timezone: 'America/New_York',
    storeHours: {
      open: '11:00',
      close: '23:00'
    },
    approvedIPs: ['198.51.100.1', '198.51.100.2'],
    status: 'active',
    staffCount: 6,
    createdAt: new Date('2024-01-20'),
    createdBy: 'admin-1'
  }
]

const mockBrands = [
  { id: '1', name: 'Craft Therapy Network' },
  { id: '2', name: 'Shroom Groove' }
]

export default function LocationsPage() {
  const [locations] = useState(mockLocations)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage locations.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const handleCreateLocation = () => {
    setSelectedLocation(null)
    setIsFormOpen(true)
  }

  const handleEditLocation = (location: any) => {
    setSelectedLocation(location)
    setIsFormOpen(true)
  }

  const handleLocationSaved = (location: any) => {
    console.log('Location saved:', location)
    setIsFormOpen(false)
    setSelectedLocation(null)
  }

  const handleDeleteLocation = (location: any) => {
    if (location.staffCount > 0) {
      alert(`Cannot delete location "${location.name}" because it has ${location.staffCount} assigned staff members. Please reassign staff first.`)
      return
    }
    
    if (confirm(`Are you sure you want to delete "${location.name}"? This action cannot be undone.`)) {
      console.log('Location deleted:', location)
    }
  }

  const handleTestIPValidation = (location: any) => {
    console.log('Testing IP validation for:', location.name)
    // This would test the IP validation logic
    alert(`Testing IP validation for ${location.name}. Check console for details.`)
  }

  const totalLocations = locations.length
  const activeLocations = locations.filter(l => l.status === 'active').length
  const totalStaff = locations.reduce((sum, location) => sum + location.staffCount, 0)
  const totalIPs = locations.reduce((sum, location) => sum + location.approvedIPs.length, 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locations Management</h1>
            <p className="text-gray-600">Create and manage store locations with operational settings</p>
          </div>
          <Button onClick={handleCreateLocation}>
            <Plus className="mr-2 h-4 w-4" />
            New Location
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Total Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {totalLocations}
              </div>
              <p className="text-sm text-gray-500">Active: {activeLocations}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Total Staff</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {totalStaff}
              </div>
              <p className="text-sm text-gray-500">Across all locations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="h-5 w-5" />
                <span>Approved IPs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {totalIPs}
              </div>
              <p className="text-sm text-gray-500">For clock-in validation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Brands</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {mockBrands.length}
              </div>
              <p className="text-sm text-gray-500">With locations</p>
            </CardContent>
          </Card>
        </div>

        {/* Locations List */}
        <Card>
          <CardHeader>
            <CardTitle>All Locations</CardTitle>
            <CardDescription>Manage location settings and operational parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-lg">{location.name}</h3>
                          {getStatusBadge(location.status)}
                          <Badge variant="outline">{location.brand}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatTime(new Date(`2024-01-01T${location.storeHours.open}`))} - {formatTime(new Date(`2024-01-01T${location.storeHours.close}`))}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{location.staffCount} staff members</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Wifi className="h-4 w-4" />
                            <span>{location.approvedIPs.length} approved IPs</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="text-sm text-gray-500 mb-1">Approved IP Addresses:</div>
                          <div className="flex flex-wrap gap-2">
                            {location.approvedIPs.map((ip, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {ip}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          Timezone: {location.timezone} | Created: {formatDate(location.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestIPValidation(location)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Test IP
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditLocation(location)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteLocation(location)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedLocation ? 'Edit Location' : 'Create New Location'}
              </DialogTitle>
              <DialogDescription>
                {selectedLocation ? 'Update location settings' : 'Add a new location with operational parameters'}
              </DialogDescription>
            </DialogHeader>
            <LocationForm
              location={selectedLocation}
              brands={mockBrands}
              onSubmit={handleLocationSaved}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
