// app/lib/fetcher-improved.ts
// Enhanced version of the fetcher with better error handling and timeout configuration

// Define type for API error responses
export interface ApiErrorDetails {
  message: string;
  status?: number;
  details?: unknown;
  url?: string;
  timestamp: string;
  code?: string;
}

export interface ApiErrorResponse {
  isError: true;
  error: ApiErrorDetails;
}

// Define type for successful responses with various potential formats
export type ApiSuccessResponse<T = any> = T;

// Combined response type
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Helper function to create consistent error objects
const createApiError = (message: string, details?: any, status?: number, url?: string): ApiErrorResponse => {
  return {
    isError: true,
    error: {
      message: message || 'Unknown error occurred',
      status,
      details,
      url,
      timestamp: new Date().toISOString(),
      code: 'API_ERROR'
    }
  };
};

// Main fetcher function with improved error handling
export const apiFetcher = async <T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  // Check if API URL is properly defined
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (!baseUrl && process.env.NODE_ENV === 'development') {
    console.warn('NEXT_PUBLIC_API_URL is not configured, using relative URLs');
  }

  // Get auth token with safeguards against undefined localStorage
  let token = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('auth_token');
    }
  } catch (e) {
    console.warn('Error accessing localStorage:', e);
  }
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  
  const apiUrl = `${baseUrl}${url}`;
  console.log(`Making request to: ${apiUrl}`);
  
  try {
    // Add timeout to prevent hanging requests - increased to 30 seconds for complex operations
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn(`Request timeout for: ${url}`);
    }, 30000); // 30 second timeout
    
    const response = await fetch(apiUrl, {
      ...options,
      headers,
      credentials: "include",
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
    
    console.log(`Response status for ${url}: ${response.status}`);
    
    if (!response.ok) {
      // Try to get error details if available
      let errorData: any = { message: `Error ${response.status}` };
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorText = await response.text();
          if (errorText) {
            errorData = JSON.parse(errorText);
          }
        } else {
          errorData.message = await response.text() || `Error ${response.status}`;
        }
      } catch (parseError) {
        errorData.parseError = true;
      }
      
      // Use the helper function to ensure the error has the correct type
      const formattedError = createApiError(
        typeof errorData.message === 'string' ? errorData.message : `Error ${response.status}`,
        errorData,
        response.status,
        url
      );
      
      console.error('API Error:', { 
        status: response.status, 
        url, 
        message: formattedError.error.message,
        timestamp: formattedError.error.timestamp
      });
      
      return formattedError;
    }
    
    // Handle empty responses gracefully
    if (response.headers.get('content-length') === '0') {
      console.log('Empty response received for', url);
      return {} as T;
    }
    
    // Handle different content types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        // Don't log full response data to avoid console clutter
        console.log(`JSON response received for ${url}:`, 
          Array.isArray(data) ? `Array with ${data.length} items` : 'Object');
        return data as T;
      } catch (jsonError) {
        return createApiError('Invalid JSON response', jsonError, undefined, url);
      }
    } else {
      const text = await response.text();
      console.log(`Text response received for ${url}:`, 
        text.length > 50 ? `${text.substring(0, 50)}...` : text);
      return { text } as T;
    }
  } catch (error) {
    // Handle network errors, timeouts, and aborts
    let errorMessage = 'Network error while fetching data';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out';
      } else {
        errorMessage = error.message;
      }
    }
    
    console.error('Fetch error for', url, ':', errorMessage);
    
    // Return structured error object using helper function
    return createApiError(errorMessage, error, undefined, url);
  }
};

// Enhanced fetcher with retry logic
export const apiFetcherWithRetry = async <T = any>(
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3,
  delay = 1000
): Promise<ApiResponse<T>> => {
  let lastError: ApiErrorResponse | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await apiFetcher<T>(url, options);
    
    if (!result || typeof result === 'object' && 'isError' in result && result.isError) {
      lastError = result as ApiErrorResponse;
      
      // Don't retry on 4xx errors (client errors)
      if (lastError.error.status && lastError.error.status >= 400 && lastError.error.status < 500) {
        return lastError;
      }
      
      if (attempt < maxRetries) {
        console.log(`Retrying ${url} (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt))); // Exponential backoff
        continue;
      }
    } else {
      return result;
    }
  }
  
  return lastError!;
};

// Utility function to check if response is an error
export const isApiError = (response: any): response is ApiErrorResponse => {
  return response && typeof response === 'object' && 'isError' in response && response.isError;
};

// Utility function to extract error message
export const getApiErrorMessage = (response: any): string => {
  if (isApiError(response)) {
    return response.error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

// Backward compatibility - export the improved version as the default
export { apiFetcher as default };
