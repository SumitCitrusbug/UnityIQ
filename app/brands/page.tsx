'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BrandForm } from '@/components/brands/brand-form'
import { formatDate } from '@/lib/utils'
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2,
  MapPin,
  Users,
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

// Mock data
const mockBrands = [
  {
    id: '1',
    name: 'Craft Therapy Network',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin-1',
    locationCount: 3,
    staffCount: 12
  },
  {
    id: '2',
    name: 'Shroom Groove',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin-1',
    locationCount: 2,
    staffCount: 8
  },
  {
    id: '3',
    name: 'Green Valley Co',
    status: 'archived',
    createdAt: new Date('2023-12-01'),
    createdBy: 'admin-1',
    locationCount: 0,
    staffCount: 0
  }
]

export default function BrandsPage() {
  const [brands] = useState(mockBrands)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<any>(null)
  const { hasRole } = useAuthStore()

  if (!hasRole(['admin'])) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to manage brands.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const handleCreateBrand = () => {
    setSelectedBrand(null)
    setIsFormOpen(true)
  }

  const handleEditBrand = (brand: any) => {
    setSelectedBrand(brand)
    setIsFormOpen(true)
  }

  const handleBrandSaved = (brand: any) => {
    console.log('Brand saved:', brand)
    setIsFormOpen(false)
    setSelectedBrand(null)
  }

  const handleDeleteBrand = (brand: any) => {
    if (brand.locationCount > 0) {
      alert(`Cannot delete brand "${brand.name}" because it has ${brand.locationCount} locations. Please move or delete the locations first.`)
      return
    }
    
    if (confirm(`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`)) {
      console.log('Brand deleted:', brand)
    }
  }

  const activeBrands = brands.filter(b => b.status === 'active')
  const archivedBrands = brands.filter(b => b.status === 'archived')
  const totalLocations = brands.reduce((sum, brand) => sum + brand.locationCount, 0)
  const totalStaff = brands.reduce((sum, brand) => sum + brand.staffCount, 0)

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brands Management</h1>
            <p className="text-gray-600">Create and manage organization brands</p>
          </div>
          <Button onClick={handleCreateBrand}>
            <Plus className="mr-2 h-4 w-4" />
            New Brand
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Total Brands</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {brands.length}
              </div>
              <p className="text-sm text-gray-500">Active: {activeBrands.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Total Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {totalLocations}
              </div>
              <p className="text-sm text-gray-500">Across all brands</p>
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
              <div className="text-3xl font-bold text-purple-600">
                {totalStaff}
              </div>
              <p className="text-sm text-gray-500">Assigned to brands</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Archived</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">
                {archivedBrands.length}
              </div>
              <p className="text-sm text-gray-500">Inactive brands</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Brands */}
        <Card>
          <CardHeader>
            <CardTitle>Active Brands</CardTitle>
            <CardDescription>Currently active brands in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {activeBrands.length === 0 ? (
              <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active brands</h3>
                <p className="text-gray-500">Create your first brand to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBrands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{brand.name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{brand.locationCount} locations</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{brand.staffCount} staff</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(brand.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(brand.status)}
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditBrand(brand)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteBrand(brand)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Archived Brands */}
        {archivedBrands.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Archived Brands</CardTitle>
              <CardDescription>Inactive brands that have been archived</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {archivedBrands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-gray-600">{brand.name}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{brand.locationCount} locations</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{brand.staffCount} staff</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(brand.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(brand.status)}
                      <Button variant="ghost" size="icon" onClick={() => handleEditBrand(brand)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brand Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedBrand ? 'Edit Brand' : 'Create New Brand'}
              </DialogTitle>
              <DialogDescription>
                {selectedBrand ? 'Update brand information' : 'Add a new brand to the system'}
              </DialogDescription>
            </DialogHeader>
            <BrandForm
              brand={selectedBrand}
              onSubmit={handleBrandSaved}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
