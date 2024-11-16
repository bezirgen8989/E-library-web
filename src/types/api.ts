export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATH' | 'PATCH'

export type HTTPHeaders = {
  [key: string]: string
}

export type ErrorResponse = {
  code: string
  error: string
  detail?: any
  status?: number
  errors?: {
    email?: string;
  };
}

// Normalized api response
export type ApiResponse<T = any> = {
  status?: number
  success: boolean
  content?: T
  error?: ErrorResponse
}

export type ApiPayload<T = any> = {
  // Indicates request loading state
  isLoading?: boolean
  // Normalized error
  error?: any // ErrorResponse
  // Response data
  result?: T
}
