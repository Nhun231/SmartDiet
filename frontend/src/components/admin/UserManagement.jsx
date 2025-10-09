import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  People,
  Star,
  AccountBalance
} from '@mui/icons-material';
import { userService } from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, levelFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching users...');
      const response = await userService.getAllUsers();
      console.log('API Response:', response.data); // Debug log
      
      if (response.data?.success && response.data?.data?.users) {
        setUsers(response.data.data.users);
        console.log('Users loaded:', response.data.data.users.length);
      } else {
        console.log('Unexpected response format:', response.data);
        setError('Định dạng phản hồi không đúng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      setError('Lỗi khi tải danh sách người dùng: ' + (error.response?.data?.message || error.message));
      
      // Fallback to mock data for demo
      const mockUsers = [
        {
          _id: '1',
          username: 'Nguyễn Văn A',
          email: 'user1@example.com',
          level: 1,
          coins: 100,
          role: 'customer',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          username: 'Trần Thị B',
          email: 'user2@example.com',
          level: 2,
          coins: 500,
          role: 'customer',
          createdAt: '2024-01-14T15:45:00Z'
        },
        {
          _id: '3',
          username: 'Lê Văn C',
          email: 'user3@example.com',
          level: 3,
          coins: 1000,
          role: 'customer',
          createdAt: '2024-01-13T09:15:00Z'
        }
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(user => user.level === parseInt(levelFilter));
    }

    setFilteredUsers(filtered);
  };

  const getLevelName = (level) => {
    switch (level) {
      case 1: return 'Cơ bản';
      case 2: return 'Chuyên sâu';
      case 3: return 'Nâng cao';
      default: return 'Cơ bản';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 1: return '#6c757d';
      case 2: return '#4CAF50';
      case 3: return '#2E7D32';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleMenuClick = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleUpdateUserLevel = async (userId, newLevel) => {
    try {
      await userService.updateUserLevel(userId, newLevel);
      setSuccess(`Cập nhật cấp độ người dùng thành công!`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      setError('Lỗi khi cập nhật cấp độ: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateUserCoins = async (userId, newCoins) => {
    try {
      await userService.updateUserCoins(userId, newCoins);
      setSuccess(`Cập nhật số xu người dùng thành công!`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      setError('Lỗi khi cập nhật số xu: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
          Quản lý người dùng
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Tìm kiếm người dùng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: '#666' }} />
          }}
        />
        <TextField
          select
          label="Cấp độ"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          sx={{ minWidth: 150 }}
          SelectProps={{ native: true }}
        >
          <option value="all">Tất cả</option>
          <option value="1">Level 1 - Cơ bản</option>
          <option value="2">Level 2 - Chuyên sâu</option>
          <option value="3">Level 3 - Nâng cao</option>
        </TextField>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => {
            setSearchTerm('');
            setLevelFilter('all');
          }}
        >
          Xóa bộ lọc
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
              <TableCell><strong>Tên người dùng</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Cấp độ</strong></TableCell>
              <TableCell><strong>Số xu</strong></TableCell>
              <TableCell><strong>Vai trò</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user.username}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`Level ${user.level} - ${getLevelName(user.level)}`}
                    size="small"
                    sx={{
                      backgroundColor: getLevelColor(user.level),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalance sx={{ fontSize: 16, color: '#FFD700', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {user.coins.toLocaleString('vi-VN')} xu
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    size="small"
                    color={user.role === 'admin' ? 'error' : 'primary'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, user)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <People sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666' }}>
            {searchTerm || levelFilter !== 'all' ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
          </Typography>
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          // View user details - could open a dialog
          alert(`Thông tin người dùng:\nTên: ${selectedUser?.username}\nEmail: ${selectedUser?.email}\nCấp độ: ${selectedUser?.level}\nSố xu: ${selectedUser?.coins}`);
          handleMenuClose();
        }}>
          <People sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={() => {
          const newLevel = prompt(`Nhập cấp độ mới cho ${selectedUser?.username} (1-3):`, selectedUser?.level);
          if (newLevel && !isNaN(newLevel) && newLevel >= 1 && newLevel <= 3) {
            handleUpdateUserLevel(selectedUser?._id, parseInt(newLevel));
          }
          handleMenuClose();
        }}>
          <Star sx={{ mr: 1 }} />
          Chỉnh sửa cấp độ
        </MenuItem>
        <MenuItem onClick={() => {
          const newCoins = prompt(`Nhập số xu mới cho ${selectedUser?.username}:`, selectedUser?.coins);
          if (newCoins && !isNaN(newCoins) && newCoins >= 0) {
            handleUpdateUserCoins(selectedUser?._id, parseInt(newCoins));
          }
          handleMenuClose();
        }}>
          <AccountBalance sx={{ mr: 1 }} />
          Chỉnh sửa số xu
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserManagement;
