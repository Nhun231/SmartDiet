import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  MoreVert,
  AccountBalance,
  Refresh
} from '@mui/icons-material';
import { coinTransactionService } from '../../services/coinTransactionService';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, statusFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await coinTransactionService.getAllTransactions();
      setTransactions(response.data.data.transactions || []);
    } catch (error) {
      setError('Lỗi khi tải danh sách giao dịch: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.transactionCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  const handleTransactionAction = (transaction, action) => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    try {
      setError('');
      setSuccess('');

      await coinTransactionService.updateTransactionStatus(
        selectedTransaction._id,
        actionType
      );

      // Update local state
      const updatedTransactions = transactions.map(tx => {
        if (tx._id === selectedTransaction._id) {
          return {
            ...tx,
            status: actionType,
            [actionType === 'completed' ? 'completedAt' : 'rejectedAt']: new Date().toISOString()
          };
        }
        return tx;
      });

      setTransactions(updatedTransactions);
      setSuccess(`Giao dịch ${selectedTransaction.transactionCode} đã được ${actionType === 'completed' ? 'xác nhận' : 'từ chối'}`);
      
    } catch (error) {
      setError('Lỗi khi xử lý giao dịch: ' + (error.response?.data?.message || error.message));
    } finally {
      setConfirmDialogOpen(false);
      setSelectedTransaction(null);
      setActionType('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'completed': return 'Hoàn thành';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleMenuClick = (event, transaction) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTransaction(null);
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
          Quản lý giao dịch xu
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchTransactions}
          sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}
        >
          Làm mới
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Tìm kiếm giao dịch"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: '#666' }} />
          }}
        />
        <TextField
          select
          label="Trạng thái"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
          SelectProps={{ native: true }}
        >
          <option value="all">Tất cả</option>
          <option value="pending">Chờ xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="rejected">Từ chối</option>
        </TextField>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
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

      {/* Transactions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
              <TableCell><strong>Mã GD</strong></TableCell>
              <TableCell><strong>Email người dùng</strong></TableCell>
              <TableCell><strong>Số xu</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày tạo</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction._id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {transaction._id}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {transaction.transactionCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  {transaction.userId?.email || 'N/A'}
                </TableCell>
                <TableCell>
                  <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                    {transaction.amount.toLocaleString('vi-VN')} xu
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    ≈ {formatCurrency(transaction.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(transaction.status)}
                    color={getStatusColor(transaction.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(transaction.createdAt)}
                  </Typography>
                  {transaction.completedAt && (
                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                      Hoàn thành: {formatDate(transaction.completedAt)}
                    </Typography>
                  )}
                  {transaction.rejectedAt && (
                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                      Từ chối: {formatDate(transaction.rejectedAt)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {transaction.status === 'pending' ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleTransactionAction(transaction, 'completed')}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleTransactionAction(transaction, 'rejected')}
                      >
                        Từ chối
                      </Button>
                    </Box>
                  ) : (
                    <Chip 
                      label={transaction.status === 'completed' ? 'Đã xử lý' : 'Đã từ chối'} 
                      color={getStatusColor(transaction.status)} 
                      size="small" 
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredTransactions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <AccountBalance sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666' }}>
            {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy giao dịch nào' : 'Chưa có giao dịch nào'}
          </Typography>
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>
          Xác nhận hành động
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn {actionType === 'completed' ? 'xác nhận' : 'từ chối'} giao dịch{' '}
            <strong>{selectedTransaction?.transactionCode}</strong>?
          </Typography>
          {selectedTransaction && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedTransaction.userId?.email || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Số xu:</strong> {selectedTransaction.amount.toLocaleString('vi-VN')} xu
              </Typography>
              <Typography variant="body2">
                <strong>Ngày tạo:</strong> {formatDate(selectedTransaction.createdAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={actionType === 'completed' ? 'success' : 'error'}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionManagement;
