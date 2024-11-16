import { SessionUtils } from 'utils'
import { ApiResponse, ErrorResponse, HTTPHeaders, Method } from 'types/api'

// common HTTP request headers
export const ACCEPT_HEADER_NAME = 'Accept';
export const ACCEPT_HEADER_VALUE = 'application/json';
export const CONTENT_TYPE_HEADER_NAME = 'Content-Type';
export const CONTENT_TYPE_HEADER_VALUE = 'application/json; charset=utf-8';
export const SESSION_TOKEN_HEADER = 'SessionToken';
export const AUTHORIZATION_HEADER = 'Authorization';

export const PARSING_ERROR = 'Unexpected error during executing or parsing api request response';
export const DEFAULT_ERROR_RESPONSE_CODE = 'ApiInternalError';

// Send request with common or custom HTTP-headers
export const fetchRequest = (
    path: string,
    method: Method,
    params: any = null,
    headers?: HTTPHeaders
): Promise<any> => {
  const isFormData = params instanceof FormData; // Check if params is FormData
  return fetch(path, {
    method,
    headers: {
      ...(isFormData ? getFormCommonHeaders2() : getCommonHeaders()), // Only include common headers if not FormData
      ...headers,
    },
    body: normalizeParams(params),
  });
};

// Send request
const callApi = async (
  path: string,
  method: Method,
  params: any = null,
  headers?: HTTPHeaders
): Promise<ApiResponse> => {
  try {
    const response = await fetchRequest(path, method, params, headers);
    return handleCallApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Can be used to check if the api endpoint is working
export const checkApi = async (
  path: string,
  method: Method,
  params: any = null,
  headers?: HTTPHeaders,
  errorMessage?: string
): Promise<ApiResponse> => {
  try {
    const response = await fetchRequest(path, method, params, headers)
    return handleCheckApiResponse(response, errorMessage)
  } catch (error) {
    return handleApiError(error)
  }
}

// Return a normalized error or a normalized successful response
export const handleCallApiResponse = async (response: Response): Promise<ApiResponse> => {
  const { ok, status } = response
  const responseError = getResponseError(response)
  if (responseError) {
    return createErrorResponse(responseError, status)
  }

  let answer: any = await response.text()
  try {
    answer = answer ? JSON.parse(answer) : null
  } catch (error) {
    console.warn('Error404Component during parse JSON response', error)
    answer = null
  }

  return createSuccessResponse(ok, status, answer)
}

// Just check if the request was successful and if so, return normalized response with null-content,
// otherwise return normalized response with an error
export const handleCheckApiResponse = async (
  response: Response,
  errorMessage?: string
): Promise<ApiResponse> => {
  const { ok, status, statusText } = response
  if (!ok) {
    // !ok - status not in (200-299) and we can't continue
    const responseErrorText = errorMessage || `Status: ${status}, StatusText: ${statusText}`
    const responseError = new Error(responseErrorText)
    return createErrorResponse(responseError, status)
  }
  // Return null-content in response
  return createSuccessResponse(ok, status, null)
}

export const handleApiError = (error: any): ApiResponse => {
  console.warn('Error404Component during API request', error)
  return createErrorResponse(error)
}

// Create common HTTP headers
export const getCommonHeaders = () => {
  const token = SessionUtils.getSessionToken()
  return {
    [CONTENT_TYPE_HEADER_NAME]: CONTENT_TYPE_HEADER_VALUE,
    [AUTHORIZATION_HEADER]: token ? `Bearer ${token}` : '',
  }
}

export const getFormCommonHeaders2 = () => {
  const token = SessionUtils.getSessionToken()
  return {
    [AUTHORIZATION_HEADER]: token ? `Bearer ${token}` : '',
  }
}

// Trimming spaces
export const trimParams = (params: any) =>
  Object.keys(params).reduce((result: any, key) => {
    let value = params[key]

    if (typeof value === 'string') {
      value = value.trim()
    }

    result[key] = value
    return result
  }, {})

// Trims whitespace around each string type request param
// export const normalizeParams = (params: any) => {
//   if (params instanceof FormData) return params
//   return params ? JSON.stringify(trimParams(params)) : null
// }

export const normalizeParams = (params: any) => {
  if (params instanceof FormData) return params
  if (params instanceof URLSearchParams) return params
  return params ? JSON.stringify(trimParams(params)) : null
}

export const getResponseError = (response: Response): Error | undefined => {
  const { ok, status, statusText } = response
  const contentType = response.headers.get('content-type')
  const isJsonResponse = contentType && contentType.includes('application/json')

  if (isJsonResponse) return // if JSON we can continue

  if (!ok) {
    // !ok - status not in (200-299) and we can't continue
    return new Error(`Status: ${status}, StatusText: ${statusText}`)
  }

  return new TypeError('No JSON in response')
}

export const createSuccessResponse = (ok: boolean, status: number, response: any): ApiResponse => ({
  success: ok,
  status,
  content: ok ? response : undefined,
  error: !ok ? normalizeError(status, response) : undefined,
})

export const normalizeError = (status: number, response: any): ErrorResponse => {
  let error: any = response
  const baseResponse = { status, code: `${status}` }
  if (typeof response === 'string') {
    error = { ...baseResponse, error: response }
  } else if (response?.message) {
    error = { ...baseResponse, error: response.message }
  } else if (response === null) {
    error = { ...baseResponse, error: PARSING_ERROR }
  }
  return error
}

export const createErrorResponse = (error: any, status?: number): ApiResponse => {
  let errorMessage = error instanceof Error ? error.message : null
  return {
    success: false,
    error: {
      code: DEFAULT_ERROR_RESPONSE_CODE,
      detail: errorMessage,
      error: errorMessage || PARSING_ERROR,
      status,
    },
  }
}

export default callApi
