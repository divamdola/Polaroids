import { motion } from 'framer-motion'
import { FiCheck, FiPackage, FiTruck, FiClock, FiHome } from 'react-icons/fi'
import styles from './OrderTimeline.module.css'
import React from 'react'

const orderSteps = [
  { key: 'Pending', label: 'Order Placed', icon: FiClock, description: 'Your order has been received' },
  { key: 'Confirmed', label: 'Order Confirmed', icon: FiCheck, description: 'Your order has been confirmed' },
  { key: 'Processing', label: 'Processing', icon: FiPackage, description: 'Your order is being prepared' },
  { key: 'Shipped', label: 'Shipped', icon: FiTruck, description: 'Your order is on the way' },
  { key: 'Delivered', label: 'Delivered', icon: FiHome, description: 'Order delivered successfully' },
]

const statusPriority = {
  'Cancelled': 0,
  'Pending': 1,
  'Confirmed': 2,
  'Processing': 3,
  'Shipped': 4,
  'Delivered': 5,
}

export default function OrderTimeline({ status = 'Pending', orderDate }) {
  const getStatusIndex = () => {
    return statusPriority[status] || 1
  }

  const currentStepIndex = getStatusIndex()
  const isCancelled = status === 'Cancelled'

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <h5 className={styles.timelineTitle}>Order Timeline</h5>
        <span className={styles.orderDate}>
          <FiClock className={styles.clockIcon} />
          {formatDateTime(orderDate)}
        </span>
      </div>

      {isCancelled ? (
        <div className={`${styles.cancelledMessage} alert alert-danger`}>
          <FiClock className={styles.cancelledIcon} />
          <div>
            <strong>Order Cancelled</strong>
            <p className="mb-0">This order was cancelled by the customer or admin.</p>
          </div>
        </div>
      ) : (
        <div className={styles.timeline}>
          {orderSteps.map((step, index) => {
            const StepIcon = step.icon
            const isCompleted = index < currentStepIndex
            const isCurrent = index === currentStepIndex
            const isPending = index > currentStepIndex

            return (
              <React.Fragment key={step.key}>
                <motion.div
                  className={`${styles.timelineItem} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''} ${isPending ? styles.pending : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                <div className={styles.timelineIcon}>
                  <motion.div
                    className={`${styles.iconWrapper} ${isCompleted ? styles.iconCompleted : ''} ${isCurrent ? styles.iconCurrent : ''} ${isPending ? styles.iconPending : ''}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {isCompleted ? (
                      <FiCheck className={styles.checkIcon} />
                    ) : (
                      <StepIcon className={styles.stepIcon} />
                    )}
                  </motion.div>
                  {index < orderSteps.length - 1 && (
                    <motion.div
                      className={`${styles.timelineLine} ${isCompleted ? styles.lineCompleted : ''}`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    />
                  )}
                </div>
                <div className={styles.timelineContent}>
                  <motion.div
                    className={styles.timelineLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <span className={styles.label}>{step.label}</span>
                    {isCurrent && (
                      <span className={styles.currentBadge}>Current</span>
                    )}
                  </motion.div>
                  <motion.p
                    className={styles.timelineDescription}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {step.description}
                  </motion.p>
                  {isCompleted && (
                    <motion.span
                      className={styles.completedDate}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                    >
                      {formatDate(orderDate)}
                    </motion.span>
                  )}
                </div>
              </motion.div>
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}