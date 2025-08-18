import { apiFetcher } from '@/app/lib/fetcher';

// Type definitions for menu management
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: "available" | "unavailable";
  orders: number;
  menuType: string;
  mealTimes: string[];
  tags: string[];
  isActive: boolean;
  updatedAt: string;
  restaurantId: string;
}

export interface CreateMenuRequest {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  status?: "available" | "unavailable";
  menuType: string;
  mealTimes: string[];
  tags: string[];
  restaurantId: string;
}

export interface UpdateMenuRequest {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  status?: "available" | "unavailable";
  menuType?: string;
  mealTimes?: string[];
  tags?: string[];
  isActive?: boolean;
}

export interface MenuResponse {
  menus: MenuItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MenuFilters {
  restaurantId: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}

class MenuService {
  private baseUrl = '/api/restaurant/menu';

  /**
   * Get all menus for a restaurant
   */
  async getMenus(filters: MenuFilters): Promise<MenuResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await apiFetcher(`${this.baseUrl}?${params.toString()}`);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch menus');
    }
    
    return response || { menus: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
  }

  /**
   * Get specific menu by ID
   */
  async getMenuById(menuId: string): Promise<MenuItem> {
    const response = await apiFetcher(`${this.baseUrl}/${menuId}`);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch menu');
    }
    
    return response;
  }

  /**
   * Create new menu
   */
  async createMenu(menuData: CreateMenuRequest): Promise<MenuItem> {
    const response = await apiFetcher(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to create menu');
    }
    
    return response;
  }

  /**
   * Update existing menu
   */
  async updateMenu(menuId: string, menuData: UpdateMenuRequest): Promise<MenuItem> {
    const response = await apiFetcher(`${this.baseUrl}/${menuId}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to update menu');
    }
    
    return response;
  }

  /**
   * Delete menu
   */
  async deleteMenu(menuId: string): Promise<void> {
    const response = await apiFetcher(`${this.baseUrl}/${menuId}`, {
      method: 'DELETE',
    });
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to delete menu');
    }
  }

  /**
   * Get menu categories
   */
  async getCategories(restaurantId: string): Promise<string[]> {
    const response = await apiFetcher(`/api/restaurant/menu/categories?restaurantId=${restaurantId}`);
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch categories');
    }
    
    return response || [];
  }

  /**
   * Get menu types
   */
  async getMenuTypes(): Promise<string[]> {
    const response = await apiFetcher('/api/restaurant/menu/types');
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch menu types');
    }
    
    return response || ['A la Carte', 'Buffet', 'Set Menu', 'Tasting Menu'];
  }

  /**
   * Get meal times
   */
  async getMealTimes(): Promise<string[]> {
    const response = await apiFetcher('/api/restaurant/menu/meal-times');
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch meal times');
    }
    
    return response || ['Breakfast', 'Lunch', 'Dinner', 'All Day'];
  }

  /**
   * Get available tags
   */
  async getTags(): Promise<string[]> {
    const response = await apiFetcher('/api/restaurant/menu/tags');
    
    if (response?.isError) {
      throw new Error(response.error?.message || 'Failed to fetch tags');
    }
    
    return response || ['Popular', 'Spicy', 'Vegetarian', 'Vegan', 'Gluten-Free'];
  }
}

// Create singleton instance
const menuService = new MenuService();

export default menuService;
