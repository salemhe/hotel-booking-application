/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/fetcher.ts
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

export type ApiSuccessResponse<T = any> = T;
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

const createApiError = (
  message: string,
  details?: any,
  status?: number,
  url?: string
): ApiErrorResponse => ({
  isError: true,
  error: {
    message: message || "Unknown error occurred",
    status,
    details,
    url,
    timestamp: new Date().toISOString(),
    code: "API_ERROR",
  },
});

export const apiFetcher = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return createApiError("API URL is not configured");
  }

  // Token (safe for SSR + client)
  let token: string | null = null;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      token = localStorage.getItem("auth_token");
    }
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Error accessing localStorage:", e);
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`Making request to: ${apiUrl}`);
  }

  try {
    // Timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(apiUrl, {
      ...options,
      headers,
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (process.env.NODE_ENV !== "production") {
      console.log(`Response status for ${url}: ${response.status}`);
    }

    if (!response.ok) {
      let errorData: any = {};
      try {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData.message = await response.text();
        }
      } catch {
        errorData.message = `Error ${response.status}`;
      }

      return createApiError(
        typeof errorData.message === "string"
          ? errorData.message
          : `Error ${response.status}`,
        errorData,
        response.status,
        url
      );
    }

    // If no body (204 No Content etc.)
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return (await response.json()) as T;
    }

    const text = await response.text();
    return { text } as T;
  } catch (error: any) {
    let message = "Network error while fetching data";
    if (error.name === "AbortError") message = "Request timed out";
    else if (error.message) message = error.message;

    return createApiError(message, error, undefined, url);
  }
};

// apiFetcher.ts
export const fetchForFormData = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // ✅ Only set Content-Type to application/json if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    if (typeof options.body !== "string") {
      options.body = JSON.stringify(options.body);
    }
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      ...options,
      headers,
    }
  );

  // Handle errors
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  // Try parsing JSON, fallback to text
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const text = await response.text();
    return { text } as T;
  }
};

