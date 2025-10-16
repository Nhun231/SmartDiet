import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, TextField, Alert, CircularProgress } from '@mui/material';
import { AccountBalance, QrCode, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { premiumService } from '../services/premiumService';
import { coinTransactionService } from '../services/coinTransactionService';

const AddCoinsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [userPackageStatus, setUserPackageStatus] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await premiumService.getUserPackageStatus();
        setUserPackageStatus(response.data.data);
      } catch (error) {
        console.error('Error fetching user status:', error);
      }
    };
    fetchUserStatus();
  }, []);

  const handleAmountChange = (event) => {
    const value = event.target.value;
    if (value === '' || (Number(value) > 0 && Number(value) <= 1000000)) {
      setAmount(value);
      setError('');
    }
  };

  const handleAddCoins = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Vui lòng nhập số xu hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await coinTransactionService.createTransaction(Number(amount));
      const transaction = response.data.data.transaction;
      
      setTransactionData(transaction);
      setSuccess(`Đã tạo giao dịch nạp ${Number(amount).toLocaleString('vi-VN')} xu. Vui lòng quét QR code để thanh toán.`);
    } catch (error) {
      setError('Có lỗi xảy ra khi tạo giao dịch: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = () => {
    navigate('/coin-transactions');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
            Nạp xu vào tài khoản
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Nạp xu để sử dụng các tính năng premium và nâng cấp gói
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Current Balance */}
          <Card sx={{ backgroundColor: '#E8F5E9', border: '2px solid #4CAF50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ fontSize: 32, color: '#2E7D32', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                  Số xu hiện tại
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: '#2E7D32', fontWeight: 'bold', mb: 1 }}>
                {userPackageStatus?.user?.coins || 0} 🪙
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Level {userPackageStatus?.user?.level || 1} - {userPackageStatus?.package?.name || 'Gói cơ bản'}
              </Typography>
            </CardContent>
          </Card>

          {/* Add Coins Form */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32', fontWeight: 'bold' }}>
                Nạp xu mới
              </Typography>
              
              <TextField
                fullWidth
                label="Số xu muốn nạp"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Nhập số xu (1 - 1,000,000)"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: <Typography sx={{ color: '#666' }}>xu</Typography>
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleAddCoins}
                disabled={loading || !amount || Number(amount) <= 0}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#2E7D32' },
                  mb: 2,
                  py: 1.5
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Tạo giao dịch nạp xu'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleViewHistory}
                sx={{
                  borderColor: '#4CAF50',
                  color: '#4CAF50',
                  '&:hover': {
                    borderColor: '#2E7D32',
                    backgroundColor: '#E8F5E9'
                  }
                }}
              >
                <History sx={{ mr: 1 }} />
                Xem lịch sử giao dịch
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {success}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* QR Code Section */}
        {success && transactionData && (
          <Card sx={{ mt: 4, backgroundColor: '#fff' }}>
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32', fontWeight: 'bold' }}>
                  <QrCode sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Quét QR Code để thanh toán
                </Typography>
                
                {/* Placeholder for QR Code - User will add actual QR image later */}
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    border: '2px dashed #4CAF50',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <img src={"../../public/QR.jpg"} width={200} height={200}  alt={"QR Code"}/>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Số tiền: {Number(amount).toLocaleString('vi-VN')} VNĐ
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  <strong>Mã giao dịch:</strong> {transactionData.transactionCode}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Tỷ lệ quy đổi: 1 VNĐ = 1 xu
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  <strong>Nội dung chuyển khoản:</strong> NAPHXU {transactionData.transactionCode}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Sau khi thanh toán, admin sẽ xác nhận và cộng xu vào tài khoản của bạn
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card sx={{ mt: 4, backgroundColor: '#E3F2FD' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', fontWeight: 'bold' }}>
              Hướng dẫn nạp xu
            </Typography>
            <Box component="ol" sx={{ pl: 2, m: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                Nhập số xu muốn nạp (tối đa 1,000,000 xu)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Nhấn "Tạo giao dịch nạp xu" để tạo giao dịch
              </li>
              <li style={{ marginBottom: '8px' }}>
                Quét QR Code để chuyển khoản
              </li>
              <li style={{ marginBottom: '8px' }}>
                Chuyển khoản với nội dung: "NAPHXU [Mã giao dịch]"
              </li>
              <li>
                Admin sẽ xác nhận và cộng xu vào tài khoản trong vòng 24h
              </li>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AddCoinsPage;
