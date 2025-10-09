import baseAxios from '../api/axios';

export const premiumService = {
  // Get all premium packages
  getAllPackages: async () => {
    try {
      const response = await baseAxios.get('/premium-packages');
      return response;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  // Get package by level
  getPackageByLevel: async (level) => {
    try {
      const response = await axios.get(`/premium-packages/level/${level}`);
      return response;
    } catch (error) {
      console.error('Error fetching package by level:', error);
      throw error;
    }
  },

  // Get user package status
  getUserPackageStatus: async () => {
    try {
      const response = await baseAxios.get('/premium-packages/user/status');
      return response;
    } catch (error) {
      console.error('Error fetching user package status:', error);
      throw error;
    }
  },

  // Upgrade user package
  upgradePackage: async (level, paymentMethod = 'coins') => {
    try {
      const response = await baseAxios.post('/premium-packages/upgrade', {
        level,
        paymentMethod
      });
      return response;
    } catch (error) {
      console.error('Error upgrading package:', error);
      throw error;
    }
  },

  // Add coins to user account (admin only)
  addCoins: async (userId, amount, reason) => {
    try {
      const response = await axios.post('/premium-packages/add-coins', {
        userId,
        amount,
        reason
      });
      return response;
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  }
};
