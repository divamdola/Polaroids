import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import Loader from '../components/Loader/Loader'

const Home = lazy(() => import('../pages/Home/Home'))
const AdminDashboard = lazy(() => import('../admin/pages/AdminDashboard'))
const Orders = lazy(() => import('../admin/pages/Orders'))
const Analytics = lazy(() => import('../admin/pages/Analytics'))
const ProductManagement = lazy(() => import('../admin/pages/ProductManagement'))
const CustomerManagement = lazy(() => import('../admin/pages/CustomerManagement'))
const UserOrders = lazy(() => import('../admin/pages/UserOrders'))
const DiscountCodes = lazy(() => import('../admin/pages/DiscountCodes'))
const AdminOrders = lazy(() => import('../admin/pages/Orders'))
const Shop = lazy(() => import('../pages/Shop/Shop'))
const ProductPage = lazy(() => import('../pages/Product/Product'))
const Cart = lazy(() => import('../pages/Cart/Cart'))
const Checkout = lazy(() => import('../pages/Checkout/Checkout'))
const About = lazy(() => import('../pages/About/About'))
const Contact = lazy(() => import('../pages/Contact/Contact'))
const Login = lazy(() => import('../pages/Login/Login'))
const Register = lazy(() => import('../pages/Register/Register'))
const Profile = lazy(() => import('../pages/Profile/Profile'))
const Collections = lazy(() => import('../pages/Collections/Collections'))
const CustomerOrders = lazy(() => import('../pages/Orders/Orders'))
const Wishlist = lazy(() => import('../pages/Wishlist/Wishlist'))
const NotFound = lazy(() => import('../pages/NotFound/NotFound'))
import AdminRoute from '../admin/components/AdminRoute'

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/orders" element={<CustomerOrders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><CustomerManagement /></AdminRoute>} />
          <Route path="/admin/customers/:userId/orders" element={<AdminRoute><UserOrders /></AdminRoute>} />
          <Route path="/admin/discounts" element={<AdminRoute><DiscountCodes /></AdminRoute>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
