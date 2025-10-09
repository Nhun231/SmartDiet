import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  AccountBalance, 
  CheckCircle, 
  Cancel, 
  Search,
  FilterList 
} from '@mui/icons-material';
import { coinTransactionService } from '../services/coinTransactionService';

const AdminCoinTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data - in real app, this would come from API
  const mockTransactions = [
    {
      id: 'TXN001',
      userId: 'user123',
      userEmail: 'user@example.com',
      amount: 50000,
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      paymentMethod: 'bank_transfer',
      transactionCode: 'NAPHXU001'
    },
    {
      id: 'TXN002',
      userId: 'user456',
      userEmail: 'premium@example.com',
      amount: 100000,
      status: 'completed',
      createdAt: '2024-01-14T15:45:00Z',
      paymentMethod: 'bank_transfer',
      transactionCode: 'NAPHXU002',
      completedAt: '2024-01-14T16:00:00Z'
    },
    {
      id: 'TXN003',
      userId: 'user789',
      userEmail: 'vip@example.com',
      amount: 200000,
      status: 'rejected',
      createdAt: '2024-01-13T09:15:00Z',
      paymentMethod: 'bank_transfer',
      transactionCode: 'NAPHXU003',
      rejectedAt: '2024-01-13T10:00:00Z',
      rejectionReason: 'Thông tin chuyển khoản không chính xác'
    }
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await coinTransactionService.getAllTransactions();
        setTransactions(response.data.data.transactions);
        setFilteredTransactions(response.data.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Fallback to mock data for demo
        const savedTransactions = JSON.parse(localStorage.getItem('coinTransactions') || '[]');
        const allTransactions = [...mockTransactions, ...savedTransactions];
        setTransactions(allTransactions);
        setFilteredTransactions(allTransactions);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, statusFilter, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.transactionCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    setFilteredTransactions(filtered);
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

  const handleTransactionAction = (transaction, action) => {
    setSelectedTransaction(transaction);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await coinTransactionService.updateTransactionStatus(
        selectedTransaction._id || selectedTransaction.id,
        actionType
      );

      // Update local state
      const updatedTransactions = transactions.map(tx => {
        if ((tx._id || tx.id) === (selectedTransaction._id || selectedTransaction.id)) {
          return {
            ...tx,
            status: actionType,
            [actionType === 'completed' ? 'completedAt' : 'rejectedAt']: new Date().toISOString()
          };
        }
        return tx;
      });

      setTransactions(updatedTransactions);
      setSuccess(`Giao dịch ${selectedTransaction.transactionCode || selectedTransaction.id} đã được ${actionType === 'completed' ? 'xác nhận' : 'từ chối'}`);
      
    } catch (error) {
      setError('Có lỗi xảy ra khi xử lý giao dịch: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
      setSelectedTransaction(null);
      setActionType('');
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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            <AccountBalance sx={{ mr: 2, verticalAlign: 'middle' }} />
            Quản lý giao dịch nạp xu
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Xem và xử lý các giao dịch nạp xu của người dùng
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                label="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 200 }}
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
          </CardContent>
        </Card>

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
        <Card>
          <CardContent>
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
                    <TableRow key={transaction._id || transaction.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {transaction._id || transaction.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {transaction.transactionCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {transaction.userId?.email || transaction.userEmail || 'N/A'}
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
                        {transaction.status === 'pending' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleTransactionAction(transaction, 'completed')}
                              disabled={loading}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => handleTransactionAction(transaction, 'rejected')}
                              disabled={loading}
                            >
                              Từ chối
                            </Button>
                          </Box>
                        )}
                        {transaction.status === 'completed' && (
                          <Chip label="Đã xử lý" color="success" size="small" />
                        )}
                        {transaction.status === 'rejected' && (
                          <Chip label="Đã từ chối" color="error" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredTransactions.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: '#666' }}>
                  Không có giao dịch nào
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>
          Xác nhận hành động
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn {actionType === 'completed' ? 'xác nhận' : 'từ chối'} giao dịch{' '}
            <strong>{selectedTransaction?.id}</strong>?
          </Typography>
          {selectedTransaction && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedTransaction.userEmail}
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
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={actionType === 'completed' ? 'success' : 'error'}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCoinTransactionsPage;
