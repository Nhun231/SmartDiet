import React, { useEffect, useState } from 'react';
import {
    Typography, Button, Slider, Snackbar, Alert
} from '@mui/material';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import baseAxios from '../../api/axios';

const NutritionDashboard = () => {
    const [proteinPercent, setProteinPercent] = useState(0);
    const [fatPercent, setFatPercent] = useState(0);
    const [carbPercent, setCarbPercent] = useState(0);
    const [fiberPercent, setFiberPercent] = useState(0);
    const [error, setError] = useState('');
    const [nutritionData, setNutritionData] = useState({ tdee: 2000 });
    const [successOpen, setSuccessOpen] = useState(false);
    const COLORS = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'];

    const fetchData = async () => {
        try {
            const res = await baseAxios.get('customer/calculate/newest');
            const data = res.data;
            setNutritionData(data);
            // Auto set % từ backend
            if (data.nutrition) {
                setCarbPercent(data.nutrition.carbPercent);
                setProteinPercent(data.nutrition.proteinPercent);
                setFatPercent(data.nutrition.fatPercent);
                setFiberPercent(data.nutrition.fiberPercent);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        const total = proteinPercent + fatPercent + carbPercent + fiberPercent;
        if (total !== 100) {
            setError('Tổng % phải bằng 100%!');
            return;
        }
        try {
            await baseAxios.patch('customer/calculate/update-nutrition', {
                proteinPercent, fatPercent, carbPercent, fiberPercent
            });
            setError('');
            setSuccessOpen(true);
            await fetchData(); // Load lại dữ liệu sau khi cập nhật
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi cập nhật!');
        }
    };

    const chartData = [
        { name: 'Tinh bột', value: carbPercent },
        { name: 'Chất đạm', value: proteinPercent },
        { name: 'Chất béo', value: fatPercent },
        { name: 'Chất xơ', value: fiberPercent }
    ];

    const carbsGram = ((nutritionData.tdee * carbPercent) / 100 / 4).toFixed(1);
    const proteinGram = ((nutritionData.tdee * proteinPercent) / 100 / 4).toFixed(1);
    const fatGram = ((nutritionData.tdee * fatPercent) / 100 / 9).toFixed(1);
    const fiberGram = ((nutritionData.tdee * fiberPercent) / 100 / 2).toFixed(1);
    const carbsKcal = ((nutritionData.tdee * carbPercent) / 100).toFixed(0);
    const proteinKcal = ((nutritionData.tdee * proteinPercent) / 100).toFixed(0);
    const fatKcal = ((nutritionData.tdee * fatPercent) / 100).toFixed(0);
    const fiberKcal = ((nutritionData.tdee * fiberPercent) / 100).toFixed(0);
    const totalPercent = proteinPercent + fatPercent + carbPercent + fiberPercent;

    return (
        <>
            <Typography variant="h4" align="center" fontWeight="bold" mb={2} mt={5} sx={{ color: '#1B5E20' }}>
                Điều Chỉnh Dinh Dưỡng
            </Typography>
            <Typography align="center" color="text.secondary" mb={5}>
                Tùy chỉnh tỷ lệ chất dinh dưỡng phù hợp với mục tiêu của bạn
            </Typography>

            {/* Layout flexbox */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: '48px',
                maxWidth: '1600px',
                margin: '0 auto',
                flexWrap: 'wrap',
                marginLeft: 28
            }}>
                {/* Pie Chart */}
                <div style={{
                    flex: 1,
                    minWidth: '400px',
                    borderRadius: 12,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    background: 'white',
                    padding: 24,
                    boxSizing: 'border-box'
                }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                        Phân Bố Dinh Dưỡng
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <PieChart width={350} height={350}>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={130}
                                innerRadius={60}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                formatter={(value) => {
                                    const colorMap = {
                                        'Tinh bột': COLORS[0],
                                        'Chất đạm': COLORS[1],
                                        'Chất béo': COLORS[2],
                                        'Chất xơ': COLORS[3]
                                    };
                                    return <span style={{ color: colorMap[value], fontWeight: 'bold' }}>{value}</span>;
                                }}
                            />
                        </PieChart>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <Typography sx={{
                            backgroundColor: '#000',
                            color: '#fff',
                            padding: '4px 16px',
                            borderRadius: 20,
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            Tổng: {totalPercent}%
                        </Typography>
                    </div>

                    {/* Warning when over 100% */}
                    {totalPercent > 100 && (
                        <Typography align="center" color="error" mt={2}>
                            Tổng tỷ lệ vượt quá 100%! Vui lòng điều chỉnh lại.
                        </Typography>
                    )}
                </div>

                {/* Sliders */}
                <div style={{
                    flex: 1,
                    minWidth: '400px',
                    borderRadius: 12,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    background: 'white',
                    padding: 24,
                    boxSizing: 'border-box',
                    marginRight: 28
                }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom align='center'>
                        Điều Chỉnh Tỷ Lệ
                    </Typography>
                    {[{
                        label: 'Tinh bột', value: carbPercent, setter: setCarbPercent,
                        color: COLORS[0], gram: carbsGram, kcal: carbsKcal, bg: '#E3F2FD'
                    }, {
                        label: 'Chất đạm', value: proteinPercent, setter: setProteinPercent,
                        color: COLORS[1], gram: proteinGram, kcal: proteinKcal, bg: '#E8F5E9'
                    }, {
                        label: 'Chất béo', value: fatPercent, setter: setFatPercent,
                        color: COLORS[2], gram: fatGram, kcal: fatKcal, bg: '#FFF3E0'
                    }, {
                        label: 'Chất xơ', value: fiberPercent, setter: setFiberPercent,
                        color: COLORS[3], gram: fiberGram, kcal: fiberKcal, bg: '#F3E5F5'
                    }].map((item, idx) => (
                        <div key={idx} style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography fontWeight="bold">{item.label}</Typography>
                                <Typography sx={{ color: item.color, fontWeight: 'bold' }}>
                                    {item.value}%
                                </Typography>
                            </div>
                            <Slider
                                value={item.value}
                                onChange={(e, val) => item.setter(val)}
                                min={0}
                                max={100}
                                sx={{
                                    height: 8,
                                    '& .MuiSlider-thumb': { width: 24, height: 24 },
                                    color: 'black'
                                }}
                            />
                            <div style={{
                                backgroundColor: item.bg, borderRadius: 8, padding: 8,
                                display: 'flex', justifyContent: 'space-between'
                            }}>
                                <Typography>{item.gram}g</Typography>
                                <Typography>{item.kcal} Kcal</Typography>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
                <Button
                    sx={{
                        background: 'linear-gradient(to right,rgb(106, 240, 142), #4CAF50)',
                        color: 'white',
                        marginBottom: 8,
                        padding: '12px 40px',
                        borderRadius: 5,
                        fontWeight: 'bold',
                        fontSize: '16px',
                        '&:hover': { background: 'linear-gradient(to right,rgb(21, 22, 23), #43A047)' }
                    }}
                    onClick={handleSave}
                    disabled={totalPercent !== 100}
                >
                    Lưu Cập Nhật
                </Button>
            </div>

            {/* Alerts */}
            <Snackbar open={successOpen} autoHideDuration={3000} onClose={() => setSuccessOpen(false)}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    Cập nhật thành công!
                </Alert>
            </Snackbar>
            {error && (
                <Typography color="error" align="center" mt={2}>
                    {error}
                </Typography>
            )}
        </>
    );
};

export default NutritionDashboard;
