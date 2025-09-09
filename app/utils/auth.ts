// Authentication utility functions for the hotel booking application

/**
 * Get authentication token from localStorage
 * Searches for tokens in multiple possible keys
 */
export const getAuthToken = (): string | null => {
  const tokenKeys = ["auth_token", "token", "vendor-token"];
  
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`Found token in ${key}:`, token.substring(0, 20) + "...");
      return token;
    }
  }
  
  console.log("No authentication token found in localStorage");
  return null;
};

/**
 * Get user data from localStorage
 */
export interface AuthUser {
  role?: string;
  [key: string]: unknown;
}

export const getAuthUser = (): AuthUser | null => {
  const userKeys = ["auth_user", "user"];
  
  for (const key of userKeys) {
    const user = localStorage.getItem(key);
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log(`Found user data in ${key}:`, userData);
        return userData as AuthUser;
      } catch (error) {
        console.error(`Invalid user data in ${key}:`, error);
      }
    }
  }
  
  console.log("No user data found in localStorage");
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getAuthUser();
  
  if (!token) {
    console.error("Authentication token missing");
    return false;
  }
  
  if (!user) {
    console.error("User data missing");
    return false;
  }
  return true;
}
export const getUserRole = (): string | null => {
  const user = getAuthUser();
  return user && user.role ? user.role : null;
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (): boolean => {
  return hasRole("super-admin");
};

/**
 * Check if user is branch admin
 */
export const isBranchAdmin = (): boolean => {
  return hasRole("branch_admin") || hasRole("branch-admin");
};

/**
 * Check if user is vendor
 */
export const isVendor = (): boolean => {
  return hasRole("vendor");
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  const keysToRemove = [
    "auth_token", "token", "vendor-token",
    "auth_user", "user"
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log("Cleared all authentication data");
};

/**
 * Set authentication data
 */
export const setAuthData = (token: string, user: string): void => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
  console.log("Authentication data set successfully");
};