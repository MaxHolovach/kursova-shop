const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: String, required: true }, // ID товару (ASIN)
        }
    ],
    shippingAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'При отриманні'
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);