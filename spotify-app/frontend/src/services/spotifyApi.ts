// src/services/spotifyApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export interface Track {
    id: string
    name: string
    duration_ms: number
    external_urls: { spotify: string }
    album: {
        images: { url: string }[]
        release_date: string
    }
    artists: { name: string }[]
}


export interface PlaylistResponse {
    tracks: {
        items: {
            track: Track
        }[]
    }
    total: number
    limit: number
    offset: number
}


export const spotifyApi = createApi({
    reducerPath: 'spotifyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        credentials: 'include', // para cookies/sesión
    }),
    endpoints: (builder) => ({
        getPlaylistTracks: builder.query<PlaylistResponse, any>({
            query: ({ id, limit = 20, offset = 0, token }) => ({
                url: `/api/playlists/${id}?limit=${limit}&offset=${offset}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }),
        }),
    }),
})


export const { useGetPlaylistTracksQuery } = spotifyApi