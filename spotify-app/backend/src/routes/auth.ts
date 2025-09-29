import { Router } from 'express'
import axios from 'axios'
import qs from 'qs'
import dotenv from "dotenv";

const router = Router()
dotenv.config();
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!

/*const CLIENT_ID = '400d55494693474a91babf6b1c7a02fe'
const CLIENT_SECRET = 'a6ac51d887a044a5a2bf34993bbfa657'
const REDIRECT_URI = 'http://localhost:4000/auth/callback'
const FRONTEND_URL = 'http://localhost:5173'*/


router.get('/login', (req, res) => {
  const scope = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'streaming',
    'user-modify-playback-state'
  ].join(' ')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI
  })

  const url = `https://accounts.spotify.com/authorize?${params.toString()}`
  res.redirect(url)
})

router.get('/callback', async (req, res) => {
  const code = req.query.code as string
  try {
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })

    const { access_token, refresh_token, expires_in } = tokenRes.data
    // Redirect to frontend with tokens as query params for demo purposes
    const params = new URLSearchParams({ access_token, refresh_token, expires_in: String(expires_in) })
    res.redirect(`${FRONTEND_URL}/?${params.toString()}`)
  } catch (err: any) {
    console.error(err.response?.data || err.message)
    res.status(500).send('Error during token exchange')
  }
})

router.get('/refresh', async (req, res) => {
  const refresh_token = req.query.refresh_token as string
  try {
    const tokenRes = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    const { access_token, refresh_token: refresh, expires_in } = tokenRes.data
    // Redirect to frontend with tokens as query params for demo purposes
    const params = new URLSearchParams({ access_token, refresh, expires_in: String(expires_in) })
    res.redirect(`${FRONTEND_URL}/?${params.toString()}`)
  } catch (err: any) {
    res.status(500).json(err.response?.data || { message: err.message })
  }
})


export default router
