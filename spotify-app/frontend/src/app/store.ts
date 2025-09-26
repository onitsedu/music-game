import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import playlistReducer from '../features/playlist/playlistSlice'
import { spotifyApi } from '../services/spotifyApi'

const store = configureStore({
  reducer: {
    auth: authReducer,
    playlist: playlistReducer,
    [spotifyApi.reducerPath]: spotifyApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(spotifyApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
