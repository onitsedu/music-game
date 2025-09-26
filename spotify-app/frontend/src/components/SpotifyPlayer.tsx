import React, { useEffect, useState } from "react";

type SpotifyPlayerProps = {
    token: string; // access_token de Spotify
    trackId: string;
};

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ token, trackId }) => {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);

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
                console.log("Estado de reproducción:", state);
            });

            spotifyPlayer.connect();
        };
    }, [token]);

    const playTrack = async (spotifyUri: string) => {
        if (!deviceId) return;
        setPlaying(true);
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify({ uris: [spotifyUri] }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const pauseTrack = async () => {
        if (!deviceId) return;
        setPlaying(false);
        await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    return (
        <div>
            <h2>Spotify Web Player</h2>
            {!playing && <button onClick={() => playTrack(`spotify:track:${trackId}`)}>       ▶️ Reproducir       </button>}
            {playing && <button onClick={pauseTrack}>      ⏸️ Pausar       </button>}
        </div>
    );
};

export default SpotifyPlayer;
