export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  albumArtUrl?: string;
  audioUrl?: string;
  duration: number; // in seconds
  category: 'recently' | 'liked' | 'mix' | 'weekly' | 'all';
  synthConfig?: {
    baseFreq: number;
    type: OscillatorType;
    tempo: number;
    notes: number[];
  };
}

export interface Podcast {
  id: string;
  title: string;
  publisher: string;
  category: 'Technology' | 'Culture' | 'Science' | 'Leisure';
  imageUrl: string;
  description: string;
  durationMinutes: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type: 'liked' | 'mix' | 'weekly' | 'custom';
  tracksCount?: number;
  tracks: Track[];
}

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: boolean;
  queue: Track[];
  queueIndex: number;
}
