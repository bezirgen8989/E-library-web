export const SESSION_TOKEN = 'SESSION_TOKEN'

// class SessionUtils {
//   storeSession(token: string) {
//     localStorage.setItem(SESSION_TOKEN, token)
//   }
//
//   getSessionToken() {
//     return localStorage.getItem(SESSION_TOKEN)
//   }
//
//   clearSession() {
//     localStorage.removeItem(SESSION_TOKEN)
//   }
// }

class SessionUtils {
  storeSession(token: string) {
    sessionStorage.setItem(SESSION_TOKEN, token)
  }

  getSessionToken() {
    return sessionStorage.getItem(SESSION_TOKEN)
  }

  clearSession() {
    sessionStorage.removeItem(SESSION_TOKEN)
  }
}

export default new SessionUtils()
