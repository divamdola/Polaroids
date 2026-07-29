import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'

const Button = memo(function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const baseClasses = useMemo(() => 'btn rounded-pill px-4 py-2 fw-semibold shadow-sm', [])
  const variantClasses = useMemo(
    () => ({
      primary: 'btn-dark',
      outline: 'btn-outline-dark',
      secondary: 'btn-light text-dark',
    }),
    [],
  )

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </motion.button>
  )
})

export default Button
