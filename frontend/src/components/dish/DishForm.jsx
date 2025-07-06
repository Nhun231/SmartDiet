import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper,
    Divider,
    Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const DishForm = ({ onSubmit, ingredients, initialData = null }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    useEffect(() => {
        if (initialData) {
            setSelectedIngredients(
                initialData.ingredients.map(item => ({
                    ingredientId: item.ingredientId._id || item.ingredientId,
                    quantity: item.quantity,
                }))
            );
        }
    }, [initialData]);

    const handleAddIngredient = () => {
        setSelectedIngredients(prev => [...prev, { ingredientId: '', quantity: 100 }]);
    };

    const handleRemoveIngredient = (index) => {
        const updated = [...selectedIngredients];
        updated.splice(index, 1);
        setSelectedIngredients(updated);
    };

    const handleIngredientChange = (index, field, value) => {
        const updated = [...selectedIngredients];
        updated[index][field] = value;
        setSelectedIngredients(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");

        const mappedIngredients = selectedIngredients.map(item => ({
            ingredientId: item.ingredientId,
            quantity: parseFloat(item.quantity),
        }));

        const dishPayload = {
            name,
            description,
            ingredients: mappedIngredients,
            userId,
        };

        if (initialData?._id) {
            dishPayload._id = initialData._id;
        }

        onSubmit(dishPayload);

        // Reset form only when creating new dish
        if (!initialData) {
            setName('');
            setDescription('');
            setSelectedIngredients([]);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ px: 3, py: 2, bgcolor: '#fff' }}>
            <Typography variant="h6" fontWeight="bold" color="green" mb={2}>
                {initialData ? 'Cập nhật món ăn' : 'Tạo món ăn mới'}
            </Typography>

            <TextField
                label="Tên món"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Nguyên liệu
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedIngredients.map((item, index) => (
                    <Paper
                        key={index}
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Autocomplete
                                options={ingredients}
                                getOptionLabel={(option) => option.name || ''}
                                value={ingredients.find(i => i._id === item.ingredientId) || null}
                                onChange={(e, newValue) =>
                                    handleIngredientChange(index, 'ingredientId', newValue?._id || '')
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Nguyên liệu" size="small" />
                                )}
                                sx={{ flex: 2 }}
                            />

                            <TextField
                                label="Gram"
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleIngredientChange(index, 'quantity', e.target.value)
                                }
                                sx={{ flex: 1 }}
                            />

                            <IconButton onClick={() => handleRemoveIngredient(index)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                ))}
            </Box>

            <Button
                startIcon={<AddIcon />}
                onClick={handleAddIngredient}
                variant="outlined"
                sx={{ mt: 2 }}
            >
                Thêm nguyên liệu
            </Button>

            <Divider sx={{ my: 3 }} />

            <Button type="submit" variant="contained" color="success" fullWidth>
                {initialData ? 'Cập nhật món' : 'Tạo món'}
            </Button>
        </Box>
    );
};

export default DishForm;
