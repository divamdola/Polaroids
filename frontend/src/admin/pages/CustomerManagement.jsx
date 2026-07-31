import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiUsers, FiEdit, FiShield, FiUserX, FiMail, FiSearch, FiShoppingBag, FiExternalLink } from 'react-icons/fi'
import AdminShell from '../components/AdminShell'
import Loader from '../../components/Loader/Loader'

const CustomerManagement = memo(function CustomerManagement() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [userOrders, setUserOrders] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('Fetching users from:', `${import.meta.env.VITE_API_BASE_URL}/admin/customers`)
      
      // Try localStorage token as fallback
      const localToken = localStorage.getItem('authToken')
      const headers = {}
      if (localToken) {
        headers['Authorization'] = `Bearer ${localToken}`
      }
      
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/customers`, { 
        withCredentials: true,
        headers
      })
      console.log('Users response:', response.data)
      
      const usersData = Array.isArray(response.data) ? response.data : []
      setUsers(usersData)
      
      // Initialize order counts to 0 for all users
      const orderCounts = {}
      usersData.forEach(user => {
        orderCounts[user._id] = 0
      })
      setUserOrders(orderCounts)
      
      // Fetch order counts for each user (in parallel for better performance)
      const orderPromises = usersData.map(async (user) => {
        try {
          const ordersResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${user._id}/orders`, { 
            withCredentials: true,
            headers
          })
          return { userId: user._id, count: ordersResponse.data?.orders?.length || 0 }
        } catch (error) {
          console.error(`Failed to fetch orders for user ${user._id}:`, error)
          return { userId: user._id, count: 0 }
        }
      })
      
      const orderResults = await Promise.all(orderPromises)
      const finalOrderCounts = {}
      orderResults.forEach(({ userId, count }) => {
        finalOrderCounts[userId] = count
      })
      setUserOrders(finalOrderCounts)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      console.error('Error details:', error.response?.data)
      console.error('Error status:', error.response?.status)
      setUsers([])
      alert('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log('Changing role for user:', userId, 'to:', newRole)
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`, { role: newRole }, { withCredentials: true })
      console.log('Role change response:', response.data)
      await fetchUsers()
      setShowRoleModal(false)
      setEditingUser(null)
      alert('User role updated successfully')
    } catch (error) {
      console.error('Failed to update user role:', error)
      alert('Failed to update user role: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      console.log('Deleting user:', userId)
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`, { withCredentials: true })
      console.log('Delete response:', response.data)
      await fetchUsers()
      alert('User deleted successfully')
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user: ' + (error.response?.data?.message || error.message))
    }
  }

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const name = user.name || ''
    const email = user.email || ''
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase())
  }) : []

  const getRoleBadgeColor = (role) => {
    return role === 'admin' ? 'bg-danger' : 'bg-success'
  }

  return (
    <AdminShell>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-semibold mb-1">
              <span className="d-inline-flex align-items-center">
                <FiUsers className="me-2" style={{ width: '24px', height: '24px' }} />
                Customer Management
              </span>
            </h3>
            <p className="text-muted mb-0">Manage user accounts and permissions</p>
          </div>
          <div className="d-flex gap-2">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <FiSearch style={{ width: '18px', height: '18px' }} />
              </span>
              <input
                type="text"
                className="form-control rounded-pill ps-5"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <FiUsers className="text-muted" style={{ width: '20px', height: '20px' }} />
                          </span>
                        </div>
                        <div>
                          <div className="fw-semibold">{user.name || 'Unknown User'}</div>
                          <small className="text-muted">{user._id || 'N/A'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2 text-muted" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <FiMail style={{ width: '18px', height: '18px' }} />
                        </span>
                        {user.email || 'No email'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">{userOrders[user._id] || 0} orders</span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setEditingUser(user)
                            setSelectedRole(user.role)
                            setShowRoleModal(true)
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <FiEdit style={{ width: '16px', height: '16px' }} />
                          </span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => navigate(`/admin/customers/${user._id}/orders`)}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <FiShoppingBag style={{ width: '16px', height: '16px' }} />
                          </span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <FiUserX style={{ width: '16px', height: '16px' }} />
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-5">
                <div className="text-muted mb-3 d-flex justify-content-center">
                  <FiUsers style={{ width: '48px', height: '48px' }} />
                </div>
                <p className="text-muted">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {showRoleModal && editingUser && (
        <>
          <div className="modal-backdrop fade show" style={{ display: 'block', zIndex: 1050 }}></div>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1055 }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change User Role</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRoleModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Change role for <strong>{editingUser.name}</strong></p>
                  <div className="mt-3">
                    <label className="form-label">Select Role:</label>
                    <select
                      className="form-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleRoleChange(editingUser._id, selectedRole)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  )
})

export default CustomerManagement