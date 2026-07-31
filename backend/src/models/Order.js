import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: String,
        quantity: Number,
        price: Number,
        customImages: [{
          image: { type: String, required: true },
          description: { type: String, default: '' }
        }],
      },
    ],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      amount: Number,
      currency: String,
      paidAt: Date,
    },
    shippingAddress: {
      name: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      notes: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
