import baseAxios from '../api/axios';

export const ingredientService = {
  // Get all ingredients
  getAllIngredients: async () => {
    try {
      const response = await baseAxios.get('/ingredients');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get ingredient by ID
  getIngredientById: async (id) => {
    try {
      const response = await baseAxios.get(`/ingredients/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new ingredient
  createIngredient: async (ingredientData) => {
    try {
      const response = await baseAxios.post('/ingredients', ingredientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update ingredient
  updateIngredient: async (id, ingredientData) => {
    try {
      const response = await baseAxios.put(`/ingredients/${id}`, ingredientData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete ingredient
  deleteIngredient: async (id) => {
    try {
      const response = await baseAxios.delete(`/ingredients/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Search ingredients
  searchIngredients: async (query) => {
    try {
      const response = await baseAxios.get(`/ingredients/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
