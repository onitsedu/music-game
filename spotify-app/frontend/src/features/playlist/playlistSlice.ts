import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { RootState } from '../../app/store'

interface Track {
  id: string
  name: string
  artists: string
  author: string | null
  duration_ms: number
  duration: string
  image?: string | null
  external_url?: string | null
  track_number?: number | null
}

interface PlaylistState {
  loading: boolean
  tracks: Track[]
  error: string | null
  next: string | null
  previous: string | null
  total: number
  limit: number
  offset: number
}

const initialState: PlaylistState = {
  loading: false,
  tracks: [],
  error: null,
  next: null,
  previous: null,
  total: 0,
  limit: 100,
  offset: 0
}

export const fetchPlaylist = createAsyncThunk(
  'playlist/fetch',
  async ({ playlistId, limit, offset }: { playlistId: string, limit?: number, offset?: number }, { getState, rejectWithValue }) => {
    const state = getState() as RootState
    const token = state.auth.accessToken
    if (!token) return rejectWithValue('No access token')

    try {
      const res = await axios.get(`http://localhost:4000/api/playlists/${encodeURIComponent(playlistId)}?limit=${limit||100}&offset=${offset||0}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return { data: res.data, limit: limit||100, offset: offset||0 }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const msToTime = (ms: number) => {
  const s = Math.floor(ms/1000);
  const m = Math.floor(s/60);
  const sec = s%60;
  return `${m}:${sec.toString().padStart(2,'0')}`
}

const slice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPlaylist.pending, state => { state.loading = true; state.error = null; state.tracks = [] })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload as any
        const items = payload.data.tracks.items || payload.data.tracks
        state.tracks = items.map((it: any) => ({
          id: it.track.id,
          name: it.track.name,
          artists: it.track.artists.map((a:any)=>a.name).join(', '),
          author: it.track.album?.artists?.[0]?.name ?? null,
          duration_ms: it.track.duration_ms,
          duration: msToTime(it.track.duration_ms),
          image: it.track.album?.images?.[0]?.url ?? null,
          external_url: it.track.external_urls?.spotify ?? null,
          track_number: it.track.track_number ?? null
        }))
        state.next = payload.data.tracks.next
        state.previous = payload.data.tracks.previous
        state.total = payload.data.tracks.total
        state.limit = payload.limit
        state.offset = payload.offset
      })
      .addCase(fetchPlaylist.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })
  }
})

export default slice.reducer
