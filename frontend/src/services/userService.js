import baseAxios from '../api/axios';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async (page = 1, limit = 20, search = null) => {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      
      const response = await baseAxios.get('/users/admin', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await baseAxios.get(`/users/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user level
  updateUserLevel: async (id, level) => {
    try {
      const response = await baseAxios.put(`/users/admin/${id}/level`, { level });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user coins
  updateUserCoins: async (id, coins) => {
    try {
      const response = await baseAxios.put(`/users/admin/${id}/coins`, { coins });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await baseAxios.get('/users/admin/stats');
      return response;
    } catch (error) {
      throw error;
    }
  }
};
