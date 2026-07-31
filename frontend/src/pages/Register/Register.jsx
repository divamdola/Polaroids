import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import { useStore } from '../../context/StoreContext'

export default function Register() {
  const { register: registerUser } = useStore()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    try {
      const user = await registerUser({ name: data.name, email: data.email, password: data.password })
      // Redirect admin users to admin dashboard, regular users to home
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 border-0 rounded-4">
            <SectionHeading eyebrow="Join us" title="Create your account" text="Create a personal account to save favorites, track orders, and shop with ease." align="center" />
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mt-2">
              <div className="col-12"><label className="form-label">Name</label><input className="form-control rounded-pill" {...register('name', { required: true })} /></div>
              <div className="col-12"><label className="form-label">Email</label><input className="form-control rounded-pill" type="email" {...register('email', { required: true })} /></div>
              <div className="col-12"><label className="form-label">Password</label><input className="form-control rounded-pill" type="password" {...register('password', { required: true })} /></div>
              <div className="col-12"><Button type="submit">Create account</Button></div>
            </form>
            <p className="mt-3 mb-0 text-muted text-center">Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
    </section>
  )
}
