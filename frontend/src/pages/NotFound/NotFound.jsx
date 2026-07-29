import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'

export default function NotFound() {
  return (
    <section className="container py-5 text-center">
      <div className="rounded-4 p-5 shadow-sm" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.75)' }}>
        <h1 className="display-1 fw-bold">404</h1>
        <h2 className="fw-bold mb-3">Page not found</h2>
        <p className="text-muted">The page you are looking for doesn’t exist.</p>
        <Link to="/">
          <Button>Back home</Button>
        </Link>
      </div>
    </section>
  )
}
