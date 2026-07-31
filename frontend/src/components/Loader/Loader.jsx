import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '50vh' }}>
      <div className="position-relative mb-4">
        <motion.div
          className="rounded-circle"
          style={{
            width: '60px',
            height: '60px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #171514',
            borderRadius: '50%'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="position-absolute top-50 start-50 translate-middle rounded-circle"
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderBottom: '3px solid #171514',
            borderRadius: '50%'
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <motion.p
        className="text-muted mb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Loading...
      </motion.p>
    </div>
  )
}
