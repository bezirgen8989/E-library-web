import queryString from 'query-string'

class CommonUtils {
  encodeQueryParams(path: string) {
    const { url, query } = queryString.parseUrl(path)
    const queryParams = queryString.stringify(query) || ''
    return !queryParams ? url : `${url}?${queryParams}`
  }
}

export default new CommonUtils()
