import API from "../lib/api";
import SocketService from "../lib/socket";

export interface MenuItemData {
  dishName: string;
  description: string;
  category: string;
  cuisineType: string;
  price: number;
  discountPrice?: number;
  preparationTime: string;
  spiceLevel: string;
  portionSize: string;
  stockQuantity: number;
  maxOrderPerCustomer: number;
  isAvailable: boolean;
  isSpecial: boolean;
  dietaryInfo: string[];
  addOns: string[];
  tags: string[];
  allergens: string[];
  visible?: boolean;
}

export interface MenuItem extends MenuItemData {
  _id: string;
  vendor: string;
  itemImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuResponse {
  success: boolean;
  message: string;
  menu: MenuItem;
}

export interface MenuResponse {
  success: boolean;
  message: string;
  menus: MenuItem[];
}

export class MenuService {
  /**
   * Create a new menu item
   * @param menuData - Menu item data
   * @param imageFile - Optional image file
   * @returns Promise with created menu item
   */
  static async createMenuItem(menuData: MenuItemData, imageFile?: File): Promise<MenuItem> {
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(menuData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Add image if provided
      if (imageFile) {
        formData.append("itemImage", imageFile);
      }

      console.log("Creating menu item with data:", menuData);

      const response = await API.post("/vendors/create-menu", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const createdMenuItem = response.data.menu || response.data;

      // Emit real-time socket event for menu creation
      if (createdMenuItem.vendor) {
        SocketService.safeEmit('menu_updated', {
          vendorId: createdMenuItem.vendor,
          action: 'create',
          newItem: createdMenuItem
        });
      }

      return createdMenuItem;
    } catch (error: unknown) {
      console.error("Error creating menu item:", error);
      throw error;
    }
  }

  /**
   * Get all menu items for a vendor
   * @param vendorId - Vendor ID
   * @returns Promise with menu items array
   */
  static async getVendorMenuItems(vendorId: string): Promise<MenuItem[]> {
    try {
      const response = await API.get(`/vendors/menus?vendorId=${vendorId}`);
      return response.data.menus || response.data || [];
    } catch (error: unknown) {
      console.error("Error fetching menu items:", error);
      return [];
    }
  }

  /**
   * Get a specific menu item by ID
   * @param menuId - Menu item ID
   * @returns Promise with menu item details
   */
  static async getMenuItemById(menuId: string): Promise<MenuItem> {
    try {
      const response = await API.get(`/vendors/menus/${menuId}`);
      return response.data.menu || response.data;
    } catch (error: unknown) {
      console.error("Error fetching menu item:", error);
      throw error;
    }
  }

  /**
   * Update a menu item
   * @param menuId - Menu item ID
   * @param updateData - Data to update
   * @param imageFile - Optional new image file
   * @returns Promise with updated menu item
   */
  static async updateMenuItem(menuId: string, updateData: Partial<MenuItemData>, imageFile?: File): Promise<MenuItem> {
    try {
      const formData = new FormData();
      
      // Add update fields
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add image if provided
      if (imageFile) {
        formData.append("itemImage", imageFile);
      }

      const response = await API.patch(`/vendors/menus/${menuId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const updatedMenuItem = response.data.menu || response.data;

      // Emit real-time socket event for menu update
      if (updatedMenuItem.vendor) {
        SocketService.safeEmit('menu_updated', {
          vendorId: updatedMenuItem.vendor,
          action: 'update',
          itemId: menuId,
          updatedItem: updatedMenuItem
        });
      }

      return updatedMenuItem;
    } catch (error: unknown) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }

  /**
   * Delete a menu item
   * @param menuId - Menu item ID
   * @returns Promise with deletion result
   */
  static async deleteMenuItem(menuId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await API.delete(`/vendors/menus/${menuId}`);

      // Emit real-time socket event for menu deletion
      const vendorId = localStorage.getItem('vendorId'); // Fallback to get vendorId
      if (vendorId) {
        SocketService.safeEmit('menu_updated', {
          vendorId,
          action: 'delete',
          itemId: menuId
        });
      }

      return {
        success: true,
        message: response.data.message || "Menu item deleted successfully"
      };
    } catch (error: unknown) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }

  /**
   * Toggle menu item visibility
   * @param menuId - Menu item ID
   * @param visible - Visibility status
   * @returns Promise with updated menu item
   */
  static async toggleVisibility(menuId: string, visible: boolean): Promise<MenuItem> {
    try {
      const response = await API.patch(`/vendors/menus/${menuId}/visibility`, { visible });

      const updatedMenuItem = response.data.menu || response.data;

      // Emit real-time socket event for visibility toggle
      if (updatedMenuItem.vendor) {
        SocketService.safeEmit('menu_updated', {
          vendorId: updatedMenuItem.vendor,
          action: 'visibility_toggle',
          itemId: menuId,
          visible,
          updatedItem: updatedMenuItem
        });
      }

      return updatedMenuItem;
    } catch (error: unknown) {
      console.error("Error toggling menu item visibility:", error);
      throw error;
    }
  }

  /**
   * Bulk update menu items
   * @param menuIds - Array of menu item IDs
   * @param updateData - Data to update for all items
   * @returns Promise with update results
   */
  static async bulkUpdateMenuItems(menuIds: string[], updateData: Partial<MenuItemData>): Promise<{ success: boolean; updatedCount: number }> {
    try {
      const response = await API.patch('/vendors/menus/bulk-update', {
        menuIds,
        updateData
      });

      // Emit real-time socket event for bulk update
      const vendorId = localStorage.getItem('vendorId'); // Fallback to get vendorId
      if (vendorId) {
        SocketService.safeEmit('menu_updated', {
          vendorId,
          action: 'bulk_update',
          menuIds,
          updateData
        });
      }

      return {
        success: true,
        updatedCount: response.data.updatedCount || menuIds.length
      };
    } catch (error: unknown) {
      console.error("Error bulk updating menu items:", error);
      throw error;
    }
  }

  /**
   * Upload menu item image
   * @param menuId - Menu item ID
   * @param imageFile - Image file to upload
   * @returns Promise with updated menu item
   */
  static async uploadMenuImage(menuId: string, imageFile: File): Promise<MenuItem> {
    try {
      const formData = new FormData();
      formData.append("itemImage", imageFile);

      const response = await API.patch(`/vendors/menus/${menuId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const updatedMenuItem = response.data.menu || response.data;

      // Emit real-time socket event for image update
      if (updatedMenuItem.vendor) {
        SocketService.safeEmit('menu_updated', {
          vendorId: updatedMenuItem.vendor,
          action: 'image_update',
          itemId: menuId,
          updatedItem: updatedMenuItem
        });
      }

      return updatedMenuItem;
    } catch (error: unknown) {
      console.error("Error uploading menu image:", error);
      throw error;
    }
  }

  /**
   * Search menu items
   * @param vendorId - Vendor ID
   * @param searchQuery - Search query
   * @param filters - Optional filters
   * @returns Promise with filtered menu items
   */
  static async searchMenuItems(
    vendorId: string, 
    searchQuery?: string, 
    filters?: {
      category?: string;
      cuisineType?: string;
      isAvailable?: boolean;
      priceRange?: { min: number; max: number };
    }
  ): Promise<MenuItem[]> {
    try {
      const params = new URLSearchParams();
      params.append('vendorId', vendorId);
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (typeof value === 'object' && 'min' in value) {
              params.append(`${key}Min`, String(value.min));
              params.append(`${key}Max`, String(value.max));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      const response = await API.get(`/vendors/menus/search?${params.toString()}`);
      return response.data.menus || response.data || [];
    } catch (error: unknown) {
      console.error("Error searching menu items:", error);
      // Fallback to getting all items and filtering client-side
      const allItems = await this.getVendorMenuItems(vendorId);
      
      if (!searchQuery && !filters) return allItems;
      
      return allItems.filter(item => {
        let matches = true;
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          matches = matches && (
            item.dishName.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        if (filters?.category) {
          matches = matches && item.category === filters.category;
        }
        
        if (filters?.cuisineType) {
          matches = matches && item.cuisineType === filters.cuisineType;
        }
        
        if (filters?.isAvailable !== undefined) {
          matches = matches && item.isAvailable === filters.isAvailable;
        }
        
        if (filters?.priceRange) {
          matches = matches && (
            item.price >= filters.priceRange.min &&
            item.price <= filters.priceRange.max
          );
        }
        
        return matches;
      });
    }
  }
}
