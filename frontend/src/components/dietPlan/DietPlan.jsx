import React, { useState } from 'react';
import { Container, Typography, TextField, MenuItem, Button, Paper, Box, Divider } from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import baseAxios from '../../api/axios';

const DietPlan = () => {
    const location = useLocation();
    const [goal, setGoal] = useState(location.state?.goal || '');
    const [weightChange, setWeightChange] = useState('');
    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/dashboard');
    }
    const handleSubmit = async () => {
        try {
            const response = await baseAxios.post('/customer/dietplan/create', {
                goal: goal,
                targetWeightChange: weightChange
            })
            const target = response.data.dailyCalories;
            console.log("target", target)
            setResult({
                calories: target,
                message: `Để đạt mục tiêu an toàn và hiệu quả, hãy kiên trì trong ít nhất 30 ngày.

Mức thay đổi calo mỗi ngày không nên vượt quá 500 calo/ngày.

Hãy đồng hành cùng SmartDiet để đạt mục tiêu một cách bền vững!`,
            });
        } catch (error) {
            console.log(error)
        }


    };

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={6} sx={{ borderRadius: 4, p: 5, bgcolor: '#fafafa', mb: 7 }}>
                <Typography variant="h4" align="center" fontWeight="bold" color="#4CAF50" mb={3}>
                    Kế Hoạch Dinh Dưỡng Cá Nhân
                </Typography>

                <Typography align="center" mb={4} sx={{ color: '#666' }}>
                    Hãy chọn mục tiêu và cân nặng mong muốn để SmartDiet gợi ý kế hoạch phù hợp cho bạn nhé!
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                    <TextField
                        select
                        label="Mục tiêu"
                        fullWidth
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    >
                        <MenuItem value="lose">Giảm cân</MenuItem>
                        <MenuItem value="keep">Giữ nguyên cân nặng</MenuItem>
                        <MenuItem value="gain">Tăng cân</MenuItem>
                    </TextField>

                    {goal !== 'keep' && (
                        <TextField
                            label="Số cân nặng cần thay đổi (kg)"
                            type="number"
                            fullWidth
                            value={weightChange}
                            onChange={(e) => setWeightChange(e.target.value)}
                        />
                    )}

                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                            borderRadius: 50,
                            py: 1.5,
                            fontWeight: 'bold',
                            fontSize: 16,
                            backgroundColor: '#4CAF50',
                            '&:hover': { backgroundColor: '#388E3C' },
                        }}
                        disabled={!goal || (goal !== 'keep' && !weightChange)}
                    >
                        Tạo kế hoạch
                    </Button>
                </Box>

                {result && (
                    <>
                        <Divider sx={{ my: 4 }} />
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                bgcolor: '#e8f5e9',
                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                            }}
                        >
                            <Typography variant="h5" align="center" fontWeight="bold" color="#2e7d32" mb={2}>
                                Kế hoạch dinh dưỡng của bạn:
                            </Typography>

                            <Typography align="center" fontSize={36} fontWeight="bold" color="#FF5722" mb={3}>
                                {result.calories} calo/ngày
                            </Typography>

                            <Typography
                                sx={{
                                    whiteSpace: 'pre-line',
                                    color: '#555',
                                    lineHeight: 1.8,
                                    fontSize: 16,
                                    fontWeight: 500,
                                    textAlign: 'left',
                                    padding: '16px',
                                    background: '#f0fff0',
                                    borderRadius: '12px',
                                    border: '1px dashed #4CAF50',
                                }}
                            >



                                Dựa trên mục tiêu bạn chọn, chúng tôi đã tính toán lượng calo phù hợp mỗi ngày.

                                {'\n\n'}
                                <span style={{ fontWeight: 'bold', color: '#FF5722' }}>Lưu ý quan trọng:</span> Để đảm bảo an toàn và hiệu quả bạn nên áp dụng kế hoạch này trong ít nhất <span style={{ fontWeight: 'bold', color: '#D32F2F' }}>30 ngày</span>.
                                Nếu muốn giảm hoặc tăng cân, mức thay đổi calo <span style={{ fontWeight: 'bold', color: '#D32F2F' }}>không nên vượt quá 500 calo/ngày</span> so với TDEE hiện tại.

                                {'\n\n'}
                                Hãy <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>kiên trì</span>, đồng hành cùng <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>SmartDiet</span> để đạt mục tiêu cân nặng một cách <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>khoa học và bền vững!</span>
                            </Typography>
                        </Box>
                    </>
                )}
                <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={handleNavigate}
                    sx={{
                        borderRadius: 50,
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: 16,
                        backgroundColor: '#4CAF50',
                        '&:hover': { backgroundColor: '#388E3C' },
                    }}
                    disabled={!goal || (goal !== 'keep' && !weightChange)}
                >
                    Xem nhật ký hôm nay
                </Button>
            </Paper>
        </Container>
    );
};

export default DietPlan;
