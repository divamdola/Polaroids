import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { useStore } from '../../context/StoreContext'

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => {
    login({ name: data.email.split('@')[0], email: data.email })
    navigate('/profile')
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <SectionHeading eyebrow="Welcome back" title="Sign in" text="Continue your shopping journey with your personal account." align="center" />
            <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3 mt-3">
              <div>
                <label className="form-label">Email</label>
                <input className="form-control rounded-pill" type="email" {...register('email', { required: true })} />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input className="form-control rounded-pill" type="password" {...register('password', { required: true })} />
              </div>
              <Button type="submit">Sign in</Button>
            </form>
            <p className="mt-3 mb-0 text-muted text-center">
              New here? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
