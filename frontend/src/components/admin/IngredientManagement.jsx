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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Search,
  FilterList
} from '@mui/icons-material';
import { ingredientService } from '../../services/ingredientService';

const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    caloriesPer100g: '',
    proteinPer100g: '',
    carbsPer100g: '',
    fatPer100g: '',
    fiberPer100g: '',
    category: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    filterIngredients();
  }, [searchTerm, ingredients, itemsPerPage]);

  // Get current page ingredients
  const getCurrentPageIngredients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredIngredients.slice(startIndex, endIndex);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await ingredientService.getAllIngredients();
      setIngredients(response.data || []);
    } catch (error) {
      setError('Lỗi khi tải danh sách nguyên liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterIngredients = () => {
    let filtered = ingredients;
    
    if (searchTerm) {
      filtered = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ingredient.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIngredients(filtered);
    
    // Calculate total pages based on filtered results
    const totalFiltered = filtered.length;
    const pages = Math.ceil(totalFiltered / itemsPerPage);
    setTotalPages(pages);
    
    // Reset to page 1 if current page is beyond available pages
    if (currentPage > pages && pages > 0) {
      setCurrentPage(1);
    }
  };

  const handleOpenDialog = (ingredient = null) => {
    if (ingredient) {
      setEditingIngredient(ingredient);
      setFormData({
        name: ingredient.name || '',
        caloriesPer100g: ingredient.caloriesPer100g || '',
        proteinPer100g: ingredient.proteinPer100g || '',
        carbsPer100g: ingredient.carbsPer100g || '',
        fatPer100g: ingredient.fatPer100g || '',
        fiberPer100g: ingredient.fiberPer100g || '',
        category: ingredient.category || '',
        description: ingredient.description || '',
        imageUrl: ingredient.imageUrl || ''
      });
    } else {
      setEditingIngredient(null);
      setFormData({
        name: '',
        caloriesPer100g: '',
        proteinPer100g: '',
        carbsPer100g: '',
        fatPer100g: '',
        fiberPer100g: '',
        category: '',
        description: '',
        imageUrl: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingIngredient(null);
    setFormData({
      name: '',
      caloriesPer100g: '',
      proteinPer100g: '',
      carbsPer100g: '',
      fatPer100g: '',
      fiberPer100g: '',
      category: '',
      description: '',
      imageUrl: ''
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      if (editingIngredient) {
        // Update existing ingredient
        await ingredientService.updateIngredient(editingIngredient._id, formData);
        setSuccess('Cập nhật nguyên liệu thành công!');
      } else {
        // Create new ingredient
        await ingredientService.createIngredient(formData);
        setSuccess('Tạo nguyên liệu mới thành công!');
      }

      handleCloseDialog();
      fetchIngredients();
    } catch (error) {
      setError('Lỗi khi lưu nguyên liệu: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (ingredientId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
      try {
        await ingredientService.deleteIngredient(ingredientId);
        setSuccess('Xóa nguyên liệu thành công!');
        fetchIngredients();
      } catch (error) {
        setError('Lỗi khi xóa nguyên liệu: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleMenuClick = (event, ingredient) => {
    setMenuAnchor(event.currentTarget);
    setSelectedIngredient(ingredient);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedIngredient(null);
  };

  const formatNutrition = (value) => {
    return value ? `${value}g` : '--';
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
          Quản lý nguyên liệu
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': { backgroundColor: '#2E7D32' }
          }}
        >
          Thêm nguyên liệu
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Tìm kiếm nguyên liệu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: '#666' }} />
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setSearchTerm('')}
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

      {/* Ingredients Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#E8F5E9' }}>
              <TableCell><strong>Tên nguyên liệu</strong></TableCell>
              <TableCell><strong>Danh mục</strong></TableCell>
              <TableCell><strong>Calories</strong></TableCell>
              <TableCell><strong>Protein</strong></TableCell>
              <TableCell><strong>Carbs</strong></TableCell>
              <TableCell><strong>Fat</strong></TableCell>
              <TableCell><strong>Fiber</strong></TableCell>
              <TableCell><strong>Hành động</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageIngredients().map((ingredient) => (
              <TableRow key={ingredient._id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {ingredient.name}
                  </Typography>
                  {ingredient.description && (
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {ingredient.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ingredient.category || 'Chưa phân loại'} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatNutrition(ingredient.caloriesPer100g)}</TableCell>
                <TableCell>{formatNutrition(ingredient.proteinPer100g)}</TableCell>
                <TableCell>{formatNutrition(ingredient.carbsPer100g)}</TableCell>
                <TableCell>{formatNutrition(ingredient.fatPer100g)}</TableCell>
                <TableCell>{formatNutrition(ingredient.fiberPer100g)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, ingredient)}
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

      {filteredIngredients.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            {searchTerm ? 'Không tìm thấy nguyên liệu nào' : 'Chưa có nguyên liệu nào'}
          </Typography>
        </Box>
      )}

      {/* Pagination Controls */}
      {filteredIngredients.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredIngredients.length)} trong tổng số {filteredIngredients.length} nguyên liệu
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <InputLabel>Hiển thị</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Hiển thị"
              >
                <SelectMenuItem value={5}>5</SelectMenuItem>
                <SelectMenuItem value={10}>10</SelectMenuItem>
                <SelectMenuItem value={20}>20</SelectMenuItem>
                <SelectMenuItem value={50}>50</SelectMenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleOpenDialog(selectedIngredient);
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem 
          onClick={() => {
            handleDelete(selectedIngredient?._id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingIngredient ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextField
              label="Tên nguyên liệu"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Danh mục"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Calories (kcal)"
              type="number"
              value={formData.caloriesPer100g}
              onChange={(e) => setFormData({ ...formData, caloriesPer100g: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Protein (g)"
              type="number"
              value={formData.proteinPer100g}
              onChange={(e) => setFormData({ ...formData, proteinPer100g: e.target.value })}
              fullWidth
            />
            <TextField
              label="Carbs (g)"
              type="number"
              value={formData.carbsPer100g}
              onChange={(e) => setFormData({ ...formData, carbsPer100g: e.target.value })}
              fullWidth
            />
            <TextField
              label="Fat (g)"
              type="number"
              value={formData.fatPer100g}
              onChange={(e) => setFormData({ ...formData, fatPer100g: e.target.value })}
              fullWidth
            />
            <TextField
              label="Fiber (g)"
              type="number"
              value={formData.fiberPer100g}
              onChange={(e) => setFormData({ ...formData, fiberPer100g: e.target.value })}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              fullWidth
            />
            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#2E7D32' } }}
          >
            {editingIngredient ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IngredientManagement;
