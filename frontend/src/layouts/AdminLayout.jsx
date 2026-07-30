import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  return (
    <div className={styles.adminLayout}>
      <Navbar />
      <main className={styles.adminMain}>
        <Outlet />
      </main>
    </div>
  )
}