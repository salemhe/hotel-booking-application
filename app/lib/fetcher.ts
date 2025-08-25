// app/lib/fetcher.ts
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
  let detailObject: any;
  if (details instanceof Error) {
    detailObject = { name: details.name, message: details.message, stack: details.stack };
  } else if (typeof details === 'object' && details !== null) {
    detailObject = details;
  } else if (details !== undefined) {
    detailObject = { value: details };
  }

  return {
    isError: true,
    error: {
      message: message || 'Unknown error occurred',
      status,
      details: detailObject,
      url,
      timestamp: new Date().toISOString(),
      code: 'API_ERROR'
    }
  };
};

export const apiFetcher = async <T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  // Check if API URL is properly defined
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return createApiError('API URL is not configured');
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
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  console.log(`Making request to: ${apiUrl}`);
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      ...options,
      headers,
      credentials: "include",
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
    
    console.log(`Response status for ${url}: ${response.status}`);
    
    if (!response.ok) {
      let errorData: any = {};
      let message = `Request failed with status ${response.status}`;

      try {
        const errorText = await response.text();
        if (errorText) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            try {
              errorData = JSON.parse(errorText);
              if (typeof errorData.message === 'string') {
                message = errorData.message;
              }
            } catch (e) {
              message = "Failed to parse JSON error response.";
              errorData.rawResponse = errorText;
            }
          } else {
            message = errorText;
          }
        }
      } catch (e) {
        // Failed to read response body
        message = `Request failed with status ${response.status} and failed to read response body.`;
      }
      
      const formattedError = createApiError(
        message,
        errorData,
        response.status,
        url
      );
      
      console.error('API Error:', JSON.stringify(formattedError, null, 2));
      
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
    
    console.error('Fetch error for', url, ':', error);
    
    // Return structured error object using helper function
    return createApiError(errorMessage, error, undefined, url);
  }
};
