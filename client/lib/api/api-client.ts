import { toast } from "sonner";
import { 
  InterceptorManager, 
  ToastConfig,
  createDefaultErrorInterceptor,
  createDefaultSuccessInterceptor
} from "./api-interceptors";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestConfig<T = unknown> extends ToastConfig {
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
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

  private interceptors = new InterceptorManager();

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

    const toastConfig: ToastConfig = {
      showSuccessToast,
      successMessage,
      showErrorToast,
      errorMessage,
      errorDescription,
    };

    const errorInterceptor = createDefaultErrorInterceptor(toastConfig);
    const successInterceptor = createDefaultSuccessInterceptor(toastConfig);

    try {
      let requestConfig: RequestInit = {
        method,
        headers: { ...this.baseHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
      };

      requestConfig = await this.interceptors.applyRequestInterceptors(requestConfig, endpoint);

      let response = await fetch(endpoint, requestConfig);
      
      response = await this.interceptors.applyResponseInterceptors(response, endpoint);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      const data = await response.json().catch(() => null);

      if (toastConfig.showSuccessToast && toastConfig.successMessage) {
        toast.success(toastConfig.successMessage);
      }

      return data as TResponse;
    } catch (error) {
      await errorInterceptor(error as Error, endpoint, method);
      await this.interceptors.applyErrorInterceptors(error as Error, endpoint, method);
      throw error;
    }
  }

  getInterceptors(): InterceptorManager {
    return this.interceptors;
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
