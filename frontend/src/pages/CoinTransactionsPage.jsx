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
  Alert
} from '@mui/material';
import { 
  AccountBalance, 
  History,
  Add 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { coinTransactionService } from '../services/coinTransactionService';

const CoinTransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await coinTransactionService.getUserTransactions();
        setTransactions(response.data.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Fallback to localStorage for demo
        const savedTransactions = JSON.parse(localStorage.getItem('coinTransactions') || '[]');
        setTransactions(savedTransactions);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

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

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6">Đang tải...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            <History sx={{ mr: 2, verticalAlign: 'middle' }} />
            Lịch sử giao dịch xu
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Xem lịch sử các giao dịch nạp xu của bạn
          </Typography>
        </Box>

        {/* Add Coins Button */}
        <Box sx={{ mb: 4, textAlign: 'right' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/add-coins')}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#2E7D32' },
              px: 3,
              py: 1.5
            }}
          >
            Nạp xu mới
          </Button>
        </Box>

        {/* Transactions List */}
        {transactions.length > 0 ? (
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
                      <TableCell><strong>Mã giao dịch</strong></TableCell>
                      <TableCell><strong>Số xu</strong></TableCell>
                      <TableCell><strong>Trạng thái</strong></TableCell>
                      <TableCell><strong>Ngày tạo</strong></TableCell>
                      <TableCell><strong>Chi tiết</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction, index) => (
                      <TableRow key={transaction.id || index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {transaction.id || `TXN${String(index + 1).padStart(3, '0')}`}
                          </Typography>
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
                            <Typography variant="body2" sx={{ color: '#FF9800' }}>
                              Đang chờ admin xác nhận
                            </Typography>
                          )}
                          {transaction.status === 'completed' && (
                            <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                              Xu đã được cộng vào tài khoản
                            </Typography>
                          )}
                          {transaction.status === 'rejected' && (
                            <Typography variant="body2" sx={{ color: '#F44336' }}>
                              {transaction.rejectionReason || 'Giao dịch bị từ chối'}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <AccountBalance sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                  Chưa có giao dịch nào
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                  Bạn chưa thực hiện giao dịch nạp xu nào
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/add-coins')}
                  sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#2E7D32' }
                  }}
                >
                  Nạp xu ngay
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card sx={{ mt: 4, backgroundColor: '#E3F2FD' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', fontWeight: 'bold' }}>
              Thông tin về giao dịch xu
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Tỷ lệ quy đổi:</strong> 1 VNĐ = 1 xu
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Thời gian xử lý:</strong> Trong vòng 24 giờ
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Phương thức thanh toán:</strong> Chuyển khoản ngân hàng
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Nội dung chuyển khoản:</strong> NAPHXU [Mã giao dịch]
              </li>
              <li>
                <strong>Liên hệ hỗ trợ:</strong> admin@smartdiet.com
              </li>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CoinTransactionsPage;
