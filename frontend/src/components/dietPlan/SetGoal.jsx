import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const goals = [
    {
        value: 'lose',
        label: 'Giảm cân',
        description: 'Quản lý cân nặng của bạn bằng cách ăn uống thông minh hơn',
    },
    {
        value: 'maintain',
        label: 'Giữ nguyên cân nặng',
        description: 'Tối ưu cho sức khoẻ của bạn',
    },
    {
        value: 'gain',
        label: 'Tăng cân',
        description: 'Tăng cân với eat clean để luôn khỏe mạnh',
    },
];

const DietPlanGoal = () => {
    const [selectedGoal, setSelectedGoal] = useState('');
    const navigate = useNavigate();

    const handleSelect = (goal) => {
        setSelectedGoal(goal);
    };

    const handleNext = () => {
        navigate('/dietplan/create', { state: { goal: selectedGoal } });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
            <Typography variant="h4" color="#2e7d32" mb={4} fontWeight="bold">
                Mục tiêu của bạn là gì?
            </Typography>

            {goals.map((goal) => (
                <Box
                    key={goal.value}
                    onClick={() => handleSelect(goal.value)}
                    sx={{
                        border: selectedGoal === goal.value ? '2px solid #4CAF50' : '1px solid #ccc',
                        borderRadius: 10,
                        py: 3,
                        px: 2,
                        mb: 2,
                        cursor: 'pointer',
                        boxShadow: selectedGoal === goal.value ? '0 4px 12px rgba(76, 175, 80, 0.4)' : 'none',
                        backgroundColor: selectedGoal === goal.value ? '#e8f5e9' : '#ffffff',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            color: selectedGoal === goal.value ? '#4CAF50' : '#4CAF50',
                            fontSize: '20px',
                        }}
                    >
                        {goal.label}
                    </Typography>
                    <Typography
                        variant="body2"
                        mt={1}
                        sx={{
                            color: '#555',
                            fontStyle: 'italic',
                        }}
                    >
                        {goal.description}
                    </Typography>
                </Box>
            ))}

            <Button
                variant="contained"
                fullWidth
                onClick={handleNext}
                disabled={!selectedGoal}
                sx={{
                    mt: 4,
                    mb: 5,
                    py: 1.8,
                    borderRadius: '30px',
                    backgroundColor: '#4CAF50',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                    '&:hover': {
                        backgroundColor: '#45a049',
                        boxShadow: '0 6px 15px rgba(76, 175, 80, 0.4)',
                    },
                }}
            >
                Tiếp tục
            </Button>
        </Container>
    );
};

export default DietPlanGoal;
