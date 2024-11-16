import { CommonUtils } from 'utils'
import { ApiResponse, HTTPHeaders, Method } from 'types/api'
import callApi from './api'

export const EMPTY_SUCCESS_RESPONSE: Promise<ApiResponse> = Promise.resolve({ success: true })

export const API_PREFIX = 'https://elib.plavno.io:8080'

const call = (path: string, method: Method, params: any = null, headers?: HTTPHeaders) => {
  return callApi(createApiEndpoint(path), method, params, headers)
}

export const usingGet = (path: string) => {
  return call(path, 'GET', null)
}

export const usingPost = (path: string, params: any, headers?: any) => {
  return call(path, 'POST', params, headers)
}

export const usingPut = (path: string, params?: any, headers?: any) => {
  return call(path, 'PUT', params, headers)
}

export const usingDelete = (path: string, params?: any, headers?: any) => {
  return call(path, 'DELETE', params, headers)
}

export const usingPatch = (path: string, params?: any, headers?: any) => {
  return call(path, 'PATCH', params, headers)
}

export const createApiEndpoint = (path: string) => {
  const encodedPath = CommonUtils.encodeQueryParams(path)
  return `${API_PREFIX}${encodedPath}`
}