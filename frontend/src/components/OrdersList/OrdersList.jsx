const orders = [
  { id: 'PO-1024', date: 'July 18, 2026', total: '$184', status: 'Delivered' },
  { id: 'PO-1018', date: 'June 29, 2026', total: '$96', status: 'Processing' },
]

export default function OrdersList() {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h4 className="fw-semibold mb-4">Recent orders</h4>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.total}</td>
                  <td><span className="badge rounded-pill bg-dark">{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
