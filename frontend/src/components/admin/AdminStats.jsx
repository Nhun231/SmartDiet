import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Restaurant,
  AccountBalance,
  People,
  Assessment,
  TrendingUp,
  TrendingDown,
  Star
} from '@mui/icons-material';
import { coinTransactionService } from '../../services/coinTransactionService';
import { ingredientService } from '../../services/ingredientService';
import { userService } from '../../services/userService';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalIngredients: 0,
    totalUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    totalCoinsDistributed: 0,
    recentTransactions: [],
    topUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch transaction stats
      const transactionStats = await coinTransactionService.getTransactionStats();
      
      // Fetch ingredients count
      const ingredientsResponse = await ingredientService.getAllIngredients();
      
      // Fetch user stats
      const userStats = await userService.getUserStats();

      setStats({
        totalIngredients: ingredientsResponse.data?.length || 0,
        totalUsers: userStats.data?.totalUsers || 0,
        totalTransactions: transactionStats.data?.totalTransactions || 0,
        pendingTransactions: transactionStats.data?.stats?.find(s => s._id === 'pending')?.count || 0,
        completedTransactions: transactionStats.data?.stats?.find(s => s._id === 'completed')?.count || 0,
        totalCoinsDistributed: transactionStats.data?.totalCoinsDistributed || 0,
        recentTransactions: transactionStats.data?.recentTransactions || [],
        topUsers: userStats.data?.topUsers || []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Lỗi khi tải thống kê: ' + (error.response?.data?.message || error.message));
      
      // Fallback to mock data
      const mockUserStats = {
        totalUsers: 150,
        topUsers: [
          { username: 'Nguyễn Văn A', coins: 5000, level: 3 },
          { username: 'Trần Thị B', coins: 3200, level: 2 },
          { username: 'Lê Văn C', coins: 1800, level: 2 }
        ]
      };

      setStats({
        totalIngredients: 0,
        totalUsers: mockUserStats.totalUsers,
        totalTransactions: 0,
        pendingTransactions: 0,
        completedTransactions: 0,
        totalCoinsDistributed: 0,
        recentTransactions: [],
        topUsers: mockUserStats.topUsers
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2E7D32', mb: 3 }}>
        Thống kê tổng quan
      </Typography>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#E8F5E9', border: '2px solid #4CAF50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Restaurant sx={{ fontSize: 32, color: '#2E7D32', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                  Nguyên liệu
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                {stats.totalIngredients}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Tổng số nguyên liệu
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#E3F2FD', border: '2px solid #2196F3' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 32, color: '#1976D2', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                  Người dùng
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Tổng số người dùng
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF3E0', border: '2px solid #FF9800' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ fontSize: 32, color: '#F57C00', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F57C00' }}>
                  Giao dịch
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#F57C00', fontWeight: 'bold' }}>
                {stats.totalTransactions}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Tổng số giao dịch
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#F3E5F5', border: '2px solid #9C27B0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 32, color: '#7B1FA2', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#7B1FA2' }}>
                  Xu phân phối
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#7B1FA2', fontWeight: 'bold' }}>
                {stats.totalCoinsDistributed.toLocaleString('vi-VN')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Tổng xu đã phân phối
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Status Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2E7D32' }}>
                Trạng thái giao dịch
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Chờ xử lý:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                  {stats.pendingTransactions}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Đã hoàn thành:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  {stats.completedTransactions}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Tổng cộng:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                  {stats.totalTransactions}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2E7D32' }}>
                Người dùng có nhiều xu nhất
              </Typography>
              {stats.topUsers.map((user, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ fontSize: 16, color: index === 0 ? '#FFD700' : '#ccc', mr: 1 }} />
                    <Typography variant="body2">{user.username}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                    {user.coins.toLocaleString('vi-VN')} xu
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#2E7D32' }}>
            Hành động nhanh
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Sử dụng các tab phía trên để quản lý nguyên liệu, giao dịch và người dùng.
            Bạn có thể thêm nguyên liệu mới, xác nhận giao dịch xu, và theo dõi hoạt động của người dùng.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminStats;
