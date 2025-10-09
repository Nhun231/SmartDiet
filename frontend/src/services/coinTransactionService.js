import baseAxios from '../api/axios';

export const coinTransactionService = {
  // Create a new coin transaction
  createTransaction: async (amount, paymentMethod = 'bank_transfer') => {
    try {
      const response = await baseAxios.post('/coin-transactions', {
        amount,
        paymentMethod
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user's coin transactions
  getUserTransactions: async (page = 1, limit = 10, status = null) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await baseAxios.get('/coin-transactions/user', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get all transactions (admin only)
  getAllTransactions: async (page = 1, limit = 20, status = null, search = null) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (search) params.search = search;
      
      const response = await baseAxios.get('/coin-transactions/admin', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update transaction status (admin only)
  updateTransactionStatus: async (transactionId, status, adminNotes = null, rejectionReason = null) => {
    try {
      const response = await baseAxios.put(`/coin-transactions/admin/${transactionId}`, {
        status,
        adminNotes,
        rejectionReason
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction statistics (admin only)
  getTransactionStats: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await baseAxios.get('/coin-transactions/admin/stats', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
};
