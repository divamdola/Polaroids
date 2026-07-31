import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { StoreProvider } from './context/StoreContext'

function App() {
  return (
    <BrowserRouter>
    <StoreProvider>
        <div className="app-shell">
          <AppRoutes />
          <ToastContainer position="bottom-right" theme="light" />
        </div>
    </StoreProvider>
    </BrowserRouter>
  )
}

export default App
