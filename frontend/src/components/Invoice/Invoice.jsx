import { formatCurrency } from '../../utils/formatters'
import { FiDownload } from 'react-icons/fi'

export const generateInvoice = (order) => {
  // Handle both string and object order IDs
  const orderId = typeof order._id === 'string' ? order._id : (order._id?.$oid || order._id?.toString() || 'Unknown')
  
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${orderId.slice(-8).toUpperCase()}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #000;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-number {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .invoice-date {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #000;
        }
        .address {
          line-height: 1.6;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .table th {
          background: #f5f5f5;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #000;
        }
        .table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        .table tr:last-child td {
          border-bottom: 2px solid #000;
        }
        .total-section {
          text-align: right;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .total-label {
          margin-right: 30px;
          color: #666;
        }
        .total-value {
          font-weight: bold;
          min-width: 100px;
        }
        .grand-total {
          font-size: 20px;
          color: #000;
          border-top: 2px solid #000;
          padding-top: 15px;
          margin-top: 15px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .status {
          display: inline-block;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status.paid {
          background: #d4edda;
          color: #155724;
        }
        .status.pending {
          background: #fff3cd;
          color: #856404;
        }
        .status.cancelled {
          background: #f8d7da;
          color: #721c24;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Polaroids Store</div>
        <div class="invoice-details">
          <div class="invoice-number">INVOICE #${orderId.slice(-8).toUpperCase()}</div>
          <div class="invoice-date">Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Bill To</div>
        <div class="address">
          <strong>${order.shippingAddress?.name || 'Customer'}</strong><br>
          ${order.shippingAddress?.email || ''}<br>
          ${order.shippingAddress?.address || ''}<br>
          ${order.shippingAddress?.city || ''}<br>
          ${order.shippingAddress?.postalCode || ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Order Details</div>
        <table class="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>
                  <strong>${item.title}</strong>
                  ${item.customImages && item.customImages.length > 0 ? 
                    `<br><small style="color: #666;">Custom Images: ${item.customImages.length}</small>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${formatCurrency(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="total-section">
        <div class="total-row">
          <span class="total-label">Subtotal:</span>
          <span class="total-value">${formatCurrency(order.subtotal || 0)}</span>
        </div>
        <div class="total-row">
          <span class="total-label">Shipping:</span>
          <span class="total-value">${formatCurrency(order.shipping || 0)}</span>
        </div>
        <div class="total-row">
          <span class="total-label">Tax (8%):</span>
          <span class="total-value">${formatCurrency(order.tax || 0)}</span>
        </div>
        <div class="total-row grand-total">
          <span class="total-label">Grand Total:</span>
          <span class="total-value">${formatCurrency(order.total || 0)}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Payment Information</div>
        <div>
          <strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}<br>
          <strong>Payment Status:</strong> 
          <span class="status ${(order.paymentStatus || 'pending').toLowerCase()}">${order.paymentStatus || 'Pending'}</span>
          ${order.paymentDetails?.razorpayPaymentId ? 
            `<br><strong>Transaction ID:</strong> ${order.paymentDetails.razorpayPaymentId}` : ''}
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your order!</p>
        <p>For any questions, please contact us at hello@polaroidstore.com</p>
        <p>Invoice generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `

  // Create a new window and print
  const printWindow = window.open('', '_blank')
  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.onload = function() {
    printWindow.print()
  }
}

export default function InvoiceButton({ order, children }) {
  const handleDownloadInvoice = () => {
    generateInvoice(order)
  }

  return (
    <button
      onClick={handleDownloadInvoice}
      className="btn btn-outline-dark btn-sm rounded-pill"
      title="Download Invoice"
    >
      {children || <><FiDownload /> Invoice</>}
    </button>
  )
}