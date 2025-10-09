const CoinTransaction = require('../models/coinTransaction.model');
const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../utils/BaseError');
const catchAsync = require('../utils/catchAsync');

// Create a new coin transaction
const createCoinTransaction = catchAsync(async (req, res) => {
  const { amount, paymentMethod = 'bank_transfer' } = req.body;
  const userId = req.user.id;

  // Validate amount
  if (!amount || amount < 1 || amount > 1000000) {
    throw new BaseError(StatusCodes.BAD_REQUEST, 'Số xu phải từ 1 đến 1,000,000');
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng');
  }

  // Create transaction
  const transaction = new CoinTransaction({
    userId,
    amount,
    paymentMethod
  });

  console.log('Creating transaction with data:', {
    userId,
    amount,
    paymentMethod,
    transactionCode: transaction.transactionCode
  });

  await transaction.save();

  console.log('Transaction saved successfully:', {
    id: transaction._id,
    transactionCode: transaction.transactionCode,
    status: transaction.status
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Giao dịch nạp xu đã được tạo thành công',
    data: {
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        transactionCode: transaction.transactionCode,
        createdAt: transaction.createdAt
      }
    }
  });
});

// Get user's coin transactions
const getUserCoinTransactions = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  const query = { userId };
  if (status) {
    query.status = status;
  }

  const transactions = await CoinTransaction.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-__v');

  const total = await CoinTransaction.countDocuments(query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// Get all coin transactions (admin only)
const getAllCoinTransactions = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { transactionCode: { $regex: search, $options: 'i' } },
      { bankTransactionId: { $regex: search, $options: 'i' } }
    ];
  }

  const transactions = await CoinTransaction.find(query)
    .populate('userId', 'username email')
    .populate('processedBy', 'username')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-__v');

  const total = await CoinTransaction.countDocuments(query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// Update transaction status (admin only)
const updateTransactionStatus = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const { status, adminNotes, rejectionReason } = req.body;
  const adminId = req.user.id;

  if (!['completed', 'rejected'].includes(status)) {
    throw new BaseError(StatusCodes.BAD_REQUEST, 'Trạng thái không hợp lệ');
  }

  const transaction = await CoinTransaction.findById(transactionId);
  if (!transaction) {
    throw new BaseError(StatusCodes.NOT_FOUND, 'Không tìm thấy giao dịch');
  }

  if (transaction.status !== 'pending') {
    throw new BaseError(StatusCodes.BAD_REQUEST, 'Giao dịch đã được xử lý');
  }

  // Update transaction
  transaction.status = status;
  transaction.processedBy = adminId;
  transaction.processedAt = new Date();
  
  if (adminNotes) {
    transaction.adminNotes = adminNotes;
  }
  
  if (status === 'rejected' && rejectionReason) {
    transaction.rejectionReason = rejectionReason;
  }

  await transaction.save();

  // If completed, add coins to user account
  if (status === 'completed') {
    const user = await User.findById(transaction.userId);
    if (user) {
      user.coins = (user.coins || 0) + transaction.amount;
      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Giao dịch đã được ${status === 'completed' ? 'xác nhận' : 'từ chối'}`,
    data: {
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        transactionCode: transaction.transactionCode,
        processedAt: transaction.processedAt
      }
    }
  });
});

// Get transaction statistics (admin only)
const getTransactionStats = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchQuery = {};
  if (startDate && endDate) {
    matchQuery.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const stats = await CoinTransaction.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const totalTransactions = await CoinTransaction.countDocuments(matchQuery);
  const totalAmount = await CoinTransaction.aggregate([
    { $match: { ...matchQuery, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      stats,
      totalTransactions,
      totalCoinsDistributed: totalAmount[0]?.total || 0
    }
  });
});

module.exports = {
  createCoinTransaction,
  getUserCoinTransactions,
  getAllCoinTransactions,
  updateTransactionStatus,
  getTransactionStats
};
