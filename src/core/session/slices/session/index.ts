import { createSlice } from "@reduxjs/toolkit";
import { history, AppThunk } from "store";
import authRoutes from "modules/Auth/routing/routes";
import { SessionState } from "./types";
import TokenManager from "../../../../utils/TokenManager";

const initialState: SessionState = {};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    userLoggedOut() {
      return initialState;
    },
  },
});

const { userLoggedOut } = sessionSlice.actions;

export { userLoggedOut };
export default sessionSlice.reducer;

export const clearSessionInfo = (): AppThunk => (dispatch) => {
  TokenManager.clearTokens();
  dispatch(userLoggedOut());
  history.push(authRoutes.onboarding);
};

export const logoutUser = (): AppThunk => (dispatch) => {
  try {
    const sessionToken = TokenManager.getAccessToken();
    if (sessionToken) {
      // Call API logout request
    }
  } finally {
    dispatch(clearSessionInfo());
  }
};
