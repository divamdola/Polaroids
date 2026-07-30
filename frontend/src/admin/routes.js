export const adminRoutes = [
  { path: '/admin', label: 'Dashboard', element: 'Dashboard' },
  { path: '/admin/orders', label: 'Orders', element: 'Orders' },
  { path: '/admin/analytics', label: 'Analytics', element: 'Analytics' },
  { path: '/admin/products', label: 'Product Management', element: 'ProductManagement' },
  { path: '/admin/customers', label: 'Customer Management', element: 'CustomerManagement' },
  { path: '/admin/discounts', label: 'Discount Codes', element: 'DiscountCodes' },
]

// Dynamic routes that shouldn't appear in sidebar
export const dynamicAdminRoutes = [
  { path: '/admin/customers/:userId/orders', label: 'User Orders', element: 'UserOrders' },
]
