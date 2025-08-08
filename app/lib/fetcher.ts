// app/lib/fetcher.ts
export const apiFetcher = async (url: string, options: RequestInit = {}) => {
  // Check if API URL is properly defined
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('NEXT_PUBLIC_API_URL environment variable is not defined');
    throw new Error('API URL is not configured');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  
  console.log(`Making request to: ${process.env.NEXT_PUBLIC_API_URL}${url}`);
  console.log('Request options:', { ...options, headers, credentials: "include" });
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers,
      credentials: "include",
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      // Try to get error details if available
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error('API Error:', { status: response.status, data: errorData });
      throw { 
        isAxiosError: true, 
        response: { 
          status: response.status, 
          data: errorData 
        },
        message: errorData.message || `Error ${response.status}` 
      };
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    // Add more context to the error
    const enhancedError = {
      message: 'Failed to fetch data from API',
      originalError: error,
      url: `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      timestamp: new Date().toISOString()
    };
    throw enhancedError;
  }
};
