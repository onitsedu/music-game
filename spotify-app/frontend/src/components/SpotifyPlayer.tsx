import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";

type SpotifyPlayerProps = {
    token: string; // access_token de Spotify
    trackId: string;
};

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ token, trackId }) => {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);

    // Inicializar Web Playback SDK y obtener deviceId
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: "Mi Web Player",
                getOAuthToken: (cb) => cb(token),
                volume: 0.5,
            });

            setPlayer(spotifyPlayer);

            spotifyPlayer.addListener("ready", ({ device_id }) => {
                console.log("Device ready:", device_id);
                setDeviceId(device_id);
            });

            spotifyPlayer.addListener("not_ready", ({ device_id }) => {
                console.log("Device not ready:", device_id);
            });

            spotifyPlayer.addListener("player_state_changed", (state) => {
                if (!state) return;
                setPlaying(!state.paused);
            });

            spotifyPlayer.connect();
        };
    }, [token]);

    // ▶️ Reproducir desde el principio
    const playTrack = async () => {
        if (!deviceId) {
            console.warn("DeviceId no disponible todavía");
            return;
        }

        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: "PUT",
                body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setPlaying(true);
        } catch (err) {
            console.error("Error al reproducir:", err);
        }
    };

    // ⏸️ Pausar
    const pauseTrack = async () => {
        if (!deviceId) return;
        try {
            /*        await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });*/
            player?.pause();
            setPlaying(false);
        } catch (err) {
            console.error("Error al pausar:", err);
        }
    };

    // 🔄 Reanudar desde donde se quedó
    const resumeTrack = async () => {
        if (!deviceId) return;
        try {
            /*      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });*/
            player?.resume();
            setPlaying(true);
        } catch (err) {
            console.error("Error al reanudar:", err);
        }
    };

    return (
        <Box textAlign="center" mt={3}>

            {playing && (
                <Box display="flex" gap={2} justifyContent="center" mb={2} alignItems="flex-end" height="40px">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </Box>
            )}

            {!playing ? (
                <Box display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#1DB954",
                            color: "black",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#1ed760" },
                        }}
                        onClick={playTrack}
                    >
                        ▶️ Reproducir
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: "#1DB954",
                            color: "#1DB954",
                            fontWeight: "bold",
                            "&:hover": { borderColor: "#1ed760", color: "#1ed760" },
                        }}
                        onClick={resumeTrack}
                    >
                        🔄 Reanudar
                    </Button>
                </Box>
            ) : (
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#1DB954",
                        color: "black",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#1ed760" },
                    }}
                    onClick={pauseTrack}
                >
                    ⏸️ Pausar
                </Button>
            )}
        </Box>
    );
};

export default SpotifyPlayer;
