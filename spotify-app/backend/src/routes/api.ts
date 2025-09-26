import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/playlists/:id", async (req, res) => {
  const token = (req.headers as any).authorization;
  console.log('playlist token '+token)
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${req.params.id}`,
      {
        headers: { Authorization: token },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error al obtener playlist:", err);
    res.status(500).json({ error: "Spotify API error" });
  }
});

router.get("/playlists/:id/tracks", async (req, res) => {
  const token = (req.headers as any).authorization;
  console.log('tracks token: '+token)
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
      {
        headers: { Authorization: token },
        params: { limit, offset },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error al obtener tracks:", err);
    res.status(500).json({ error: "Spotify API error" });
  }
});

export default router;
