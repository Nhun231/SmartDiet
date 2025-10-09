const mongoose = require('mongoose');

const coinTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    max: 1000000
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'credit_card', 'other'],
    default: 'bank_transfer'
  },
  transactionCode: {
    type: String,
    unique: true,
    default: null
  },
  bankTransactionId: {
    type: String,
    default: null
  },
  adminNotes: {
    type: String,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
coinTransactionSchema.index({ userId: 1, status: 1 });
coinTransactionSchema.index({ transactionCode: 1 });
coinTransactionSchema.index({ createdAt: -1 });

// Generate transaction code
coinTransactionSchema.pre('save', function(next) {
  if (this.isNew || !this.transactionCode) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.transactionCode = `NAPHXU${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('CoinTransaction', coinTransactionSchema);
