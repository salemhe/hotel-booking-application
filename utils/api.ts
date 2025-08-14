export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
   // Use the actual URL instead of the hardcoded "url" string
   const res = await fetch(url, {
     ...options,
     headers: {
       'Content-Type': 'application/json',
       ...(options?.headers || {})
     },
     // Add cache: 'no-store' to avoid caching and always get fresh data
     cache: 'no-store'
   });
   
   if (!res.ok) throw new Error(await res.text());
   return res.json();
 };