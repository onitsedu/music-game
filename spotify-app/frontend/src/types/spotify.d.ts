declare namespace Spotify {
  interface PlayerInit {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }

  interface Error {
    message: string;
  }

  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: {
      current_track: {
        name: string;
        uri: string;
        artists: { name: string }[];
      };
    };
  }

  interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;

    addListener(
      event: "ready" | "not_ready",
      cb: (args: { device_id: string }) => void
    ): boolean;

    addListener(
      event: "player_state_changed",
      cb: (state: PlaybackState) => void
    ): boolean;

    addListener(event: "initialization_error" | "authentication_error" | "account_error" | "playback_error", cb: (err: Error) => void): boolean;

    removeListener(event: string): void;
  }

  var Player: {
    new (options: PlayerInit): Player;
  };
}

interface Window {
  Spotify: typeof Spotify;
  onSpotifyWebPlaybackSDKReady: () => void;
}
