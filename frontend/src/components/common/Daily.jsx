import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseAxios from '../../api/axios';
import { Typography, CircularProgress, Box } from '@mui/material';

const Daily = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [calculationData, setCalculationData] = useState(null);

    useEffect(() => {
        const checkCalculateData = async () => {
            try {
                const res = await baseAxios.get('/customer/calculate/newest');
                console.log(res.data)
                if (res.data && res.data.tdee) {
                    setCalculationData(res.data);
                } else {
                    navigate('/calculate');
                }
            } catch (err) {
                console.error('Lỗi khi kiểm tra dữ liệu:', err);
                navigate('/calculate');
            } finally {
                setLoading(false);
            }
        };

        checkCalculateData();
    }, [navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" align="center">
                Daily Report
            </Typography>
            <Typography align="center" color="text.secondary" mt={2}>
                Dữ liệu TDEE của bạn: {calculationData.tdee} Kcal/ngày
            </Typography>

        </Box>
    );
};

export default Daily;
