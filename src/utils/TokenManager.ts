// This is bad AF
// currently we store refresh token in localStorage
// gotta store in http only cookie

export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const REFRESH_TOKEN = "REFRESH_TOKEN";

class TokenManager {
  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN) || "";
  }

  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN) || "";
  }

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
}

export default new TokenManager();
