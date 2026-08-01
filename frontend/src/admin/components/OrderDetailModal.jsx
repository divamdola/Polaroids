import { FiX, FiDownload, FiImage, FiUser, FiMapPin, FiPackage, FiDollarSign, FiLoader } from 'react-icons/fi'
import { formatCurrency } from '../../utils/formatters'
import InvoiceButton from '../../components/Invoice/Invoice'
import { useState } from 'react'

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null
  const [downloadingImage, setDownloadingImage] = useState(null)

  const handleDownloadImage = async (imageUrl, imageName) => {
    setDownloadingImage(imageName)
    try {
      // Fetch the image as a blob to maintain quality
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob)
      
      // Create download link
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = imageName || `custom-image-${Date.now()}.jpg`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Failed to download image:', error)
      // Fallback to direct link download
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = imageName || 'custom-image.jpg'
      link.target = '_self'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setDownloadingImage(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
            display: inline-block;
          }
        `}
      </style>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content rounded-4">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-semibold">Order Details #{order._id?.slice(-6) || order.id?.slice(-6)}</h5>
              <small className="text-muted">{formatDate(order.createdAt)}</small>
            </div>
            <div className="d-flex gap-2">
              <InvoiceButton order={order}>
                <FiDownload />
              </InvoiceButton>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
          </div>
          
          <div className="modal-body">
            {/* Customer Information */}
            <div className="card border-0 shadow-sm rounded-3 mb-3">
              <div className="card-body">
                <h6 className="fw-semibold mb-3"><FiUser className="me-2" />Customer Information</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <small className="text-muted d-block">Name</small>
                    <span className="fw-medium">{order.user?.name || 'N/A'}</span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Email</small>
                    <span className="fw-medium">{order.user?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card border-0 shadow-sm rounded-3 mb-3">
              <div className="card-body">
                <h6 className="fw-semibold mb-3"><FiMapPin className="me-2" />Shipping Address</h6>
                <div className="row g-2">
                  <div className="col-12">
                    <small className="text-muted d-block">Address</small>
                    <span className="fw-medium">{order.shippingAddress?.address || 'N/A'}</span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">City</small>
                    <span className="fw-medium">{order.shippingAddress?.city || 'N/A'}</span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Postal Code</small>
                    <span className="fw-medium">{order.shippingAddress?.postalCode || 'N/A'}</span>
                  </div>
                  {order.shippingAddress?.notes && (
                    <div className="col-12">
                      <small className="text-muted d-block">Notes</small>
                      <span className="fw-medium">{order.shippingAddress.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items with Custom Images */}
            <div className="card border-0 shadow-sm rounded-3 mb-3">
              <div className="card-body">
                <h6 className="fw-semibold mb-3"><FiPackage className="me-2" />Order Items</h6>
                {order.items?.map((item, index) => (
                  <div key={index} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">{item.title || item.product?.title}</h6>
                        <small className="text-muted">Quantity: {item.quantity} × {formatCurrency(item.price)}</small>
                      </div>
                      <span className="fw-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    
                    {/* Custom Images Section */}
                    {item.customImages && item.customImages.length > 0 && (
                      <div className="mt-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FiImage className="text-primary" />
                          <small className="fw-semibold">Custom Images Uploaded ({item.customImages.length})</small>
                        </div>
                        <div className="row g-2">
                          {item.customImages.map((customImg, imgIndex) => (
                            <div key={imgIndex} className="col-6 col-md-4">
                              <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                                <img 
                                  src={customImg.image} 
                                  alt={`Custom image ${imgIndex + 1}`}
                                  className="img-fluid"
                                  style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                                />
                                <div className="card-body p-2">
                                  {customImg.description && (
                                    <small className="text-muted d-block mb-1" style={{ 
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden'
                                    }}>
                                      {customImg.description}
                                    </small>
                                  )}
                                  <button
                                    className="btn btn-sm btn-outline-primary w-100"
                                    onClick={() => handleDownloadImage(customImg.image, `${order._id?.slice(-6)}-${item.title?.replace(/\s+/g, '-')}-${imgIndex + 1}.jpg`)}
                                    disabled={downloadingImage === `${order._id?.slice(-6)}-${item.title?.replace(/\s+/g, '-')}-${imgIndex + 1}.jpg`}
                                  >
                                    {downloadingImage === `${order._id?.slice(-6)}-${item.title?.replace(/\s+/g, '-')}-${imgIndex + 1}.jpg` ? (
                                      <><FiLoader className="me-1 spin" /> Downloading...</>
                                    ) : (
                                      <><FiDownload className="me-1" /> Download</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <h6 className="fw-semibold mb-3"><FiDollarSign className="me-2" />Order Summary</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="mt-2">
                  <small className="text-muted">Payment Method: {order.paymentMethod}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary rounded-pill" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailModal