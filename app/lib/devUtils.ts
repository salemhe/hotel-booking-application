export const isDevelopment = process.env.NODE_ENV === "development";

export const devLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log("[DEV]", ...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn("[DEV]", ...args);
  }
};

export const devError = (...args: any[]) => {
  if (isDevelopment) {
    console.error("[DEV]", ...args);
  }
};

export const handleApiError = (error: any, context: string) => {
  devError(`API Error in ${context}:`, error);

  if (error?.response?.status === 401) {
    devWarn("Unauthorized request - user may need to login");
  } else if (error?.response?.status === 403) {
    devWarn("Forbidden request - user may not have permission");
  } else if (error?.response?.status >= 500) {
    devWarn("Server error - backend may be down");
  } else if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Failed to fetch")
  ) {
    devWarn("Network error - check connection or CORS settings");
  }

  // Return a user-friendly error message
  return "Unable to load content. Please try again.";
};
