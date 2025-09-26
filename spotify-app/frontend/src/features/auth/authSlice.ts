import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<Partial<AuthState>>) {
      Object.assign(state, action.payload)
    },
    clearAuth(state) {
      state.accessToken = null
      state.refreshToken = null
      state.expiresAt = null
    }
  }
})

export const { setTokens, clearAuth } = authSlice.actions
export default authSlice.reducer
