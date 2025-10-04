import { toast } from "sonner";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestConfig<T = unknown> {
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
  errorDescription?: string;
}

export interface ApiResponse<T> {
  data: T;
  ok: boolean;
  status: number;
}

class ApiClient {
  private baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  async request<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    config: ApiRequestConfig<TBody> = {}
  ): Promise<TResponse> {
    const {
      method = 'GET',
      body,
      headers = {},
      showSuccessToast = false,
      successMessage,
      showErrorToast = true,
      errorMessage,
      errorDescription,
    } = config;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { ...this.baseHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      const data = await response.json().catch(() => null);

      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      return data as TResponse;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);

      if (showErrorToast) {
        const errMsg = errorMessage || 'İşlem sırasında bir hata oluştu';
        toast.error(errMsg, errorDescription ? { description: errorDescription } : undefined);
      }

      throw error;
    }
  }

  async get<TResponse = unknown>(
    endpoint: string,
    config: Omit<ApiRequestConfig, 'method' | 'body'> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...config, method: 'GET' });
  }

  async post<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config: Omit<ApiRequestConfig<TBody>, 'method' | 'body'> = {}
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'POST', body });
  }

  async put<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config: Omit<ApiRequestConfig<TBody>, 'method' | 'body'> = {}
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<TResponse = unknown>(
    endpoint: string,
    config: Omit<ApiRequestConfig, 'method' | 'body'> = {}
  ): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config: Omit<ApiRequestConfig<TBody>, 'method' | 'body'> = {}
  ): Promise<TResponse> {
    return this.request<TResponse, TBody>(endpoint, { ...config, method: 'PATCH', body });
  }
}

export const apiClient = new ApiClient();

export function createApiHandler<TResponse>(
  fetcher: () => Promise<TResponse>,
  fallback: TResponse,
  errorMessage?: string
): () => Promise<TResponse> {
  return async () => {
    try {
      return await fetcher();
    } catch (error) {
      console.error(errorMessage || 'API error:', error);
      if (errorMessage) {
        toast.error(errorMessage);
      }
      return fallback;
    }
  };
}
