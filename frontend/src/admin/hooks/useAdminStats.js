import { useMemo } from 'react'

export function useAdminStats(orders = [], inventory = [], customers = []) {
  return useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const lowStockItems = inventory.filter((item) => (item.stock || 0) < 10)

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalInventory: inventory.length,
      totalCustomers: customers.length,
      lowStockItems,
    }
  }, [orders, inventory, customers])
}
