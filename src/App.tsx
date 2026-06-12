import React, { useState, useEffect, useRef } from 'react';
import { TRACKS, PLAYLISTS } from './data';
import { Track, Podcast, Playlist } from './types';
import { audioSynth } from './utils/audio';
import { HomeTab } from './components/HomeTab';
import { SearchTab } from './components/SearchTab';
import { LibraryTab } from './components/LibraryTab';
import { MiniPlayer } from './components/MiniPlayer';
import { NowPlayingOverlay } from './components/NowPlayingOverlay';
import { PodcastDetailsOverlay } from './components/PodcastDetailsOverlay';
import { Home, Search, Library, Settings, Sparkles, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const THEME_PIGMENTS: Record<string, string> = {
  orange: '#ff6b00',
  cyan: '#00f0ff',
  pink: '#ff007f',
  green: '#39ff14'
};

export default function App() {
  // Navigation & Screen States
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library'>('home');
  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  // Dynamic Theme State ('orange' | 'cyan' | 'pink' | 'green')
  const [themeColor, setThemeColor] = useState<string>('orange');

  // Active database tracks & Playlists state
  const [tracks, setTracks] = useState<Track[]>(TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>(PLAYLISTS);

  // Playback Engines State
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Queue State
  const [playbackQueue, setPlaybackQueue] = useState<Track[]>(TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);

  // Active Playlist tracking
  const [currentPlaylistName, setCurrentPlaylistName] = useState<string>('Techno Bunker');

  const playbackStateRef = useRef({ shuffle, repeat, queueIndex, playbackQueue, currentTrack });

  // Keep ref up to date so event listeners can read fresh state values without rebinding
  useEffect(() => {
    playbackStateRef.current = { shuffle, repeat, queueIndex, playbackQueue, currentTrack };
  }, [shuffle, repeat, queueIndex, playbackQueue, currentTrack]);

  // Fetch tracks from local backend server on startup
  useEffect(() => {
    fetch('/api/tracks')
      .then(res => res.json())
      .then((data: Track[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
          setCurrentTrack(data[0]);
          setPlaybackQueue(data);

          // Map playlists tracks to live streams from the server array
          const updatedPlaylists = PLAYLISTS.map(pl => {
            const mappedTracks = pl.tracks.map(staticT => {
              const matched = data.find(t => t.id === staticT.id);
              return matched ? matched : staticT;
            });
            return {
              ...pl,
              tracks: mappedTracks
            };
          });
          setPlaylists(updatedPlaylists);
        }
      })
      .catch((err) => {
        console.warn("Failed to retrieve tracks from live server, using local defaults:", err);
      });
  }, []);

  // Sync state values directly via physical HTML5 audio events for perfect accuracy
  useEffect(() => {
    const audio = audioSynth.getAudioElement();
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      const state = playbackStateRef.current;
      if (state.repeat) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn(e));
      } else {
        handleNextTrack();
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Play individual track
  const handlePlayTrack = (track: Track, customQueue?: Track[], playlistTitle?: string) => {
    const queueToLoad = customQueue || tracks;
    const targetIdx = queueToLoad.findIndex((t) => t.id === track.id);

    setCurrentTrack(track);
    setPlaybackQueue(queueToLoad);
    setQueueIndex(targetIdx >= 0 ? targetIdx : 0);
    setCurrentTime(0);

    if (playlistTitle) {
      setCurrentPlaylistName(playlistTitle);
    }

    // Set audio and trigger play
    audioSynth.play(track);
  };

  // Toggle active Play/Pause
  const handlePlayPauseToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isPlaying) {
      audioSynth.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioSynth.play(currentTrack);
    }
  };

  // Forward transition
  const handleNextTrack = () => {
    const state = playbackStateRef.current;
    let nextIdx = state.queueIndex + 1;
    
    if (state.shuffle) {
      nextIdx = Math.floor(Math.random() * state.playbackQueue.length);
    } else if (nextIdx >= state.playbackQueue.length) {
      nextIdx = 0; // loop back to first
    }

    const nextTrack = state.playbackQueue[nextIdx] || state.playbackQueue[0];
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setQueueIndex(nextIdx);
      setCurrentTime(0);
      audioSynth.play(nextTrack);
    }
  };

  // Backward transition
  const handlePrevTrack = () => {
    const state = playbackStateRef.current;
    let prevIdx = state.queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = state.playbackQueue.length - 1;
    }

    const prevTrack = state.playbackQueue[prevIdx];
    if (prevTrack) {
      setCurrentTrack(prevTrack);
      setQueueIndex(prevIdx);
      setCurrentTime(0);
      audioSynth.play(prevTrack);
    }
  };

  // Timeline scrub adjustment
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    audioSynth.seek(seconds);
  };

  // Quick play playlist loader
  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      handlePlayTrack(playlist.tracks[0], playlist.tracks, playlist.name);
    } else {
      alert(`The playlist "${playlist.name}" is currently a custom empty channel. Go to search to add tracks!`);
    }
  };

  // Play podcast episode simulator
  const handlePlayPodcastEpisode = (podcast: Podcast) => {
    const virtualTrack: Track = {
      id: podcast.id,
      title: podcast.title,
      artist: podcast.publisher,
      album: 'FinFy Podcast Feed',
      imageUrl: podcast.imageUrl,
      duration: podcast.durationMinutes * 60,
      category: 'all',
      audioUrl: `/api/stream/${podcast.id}` // Podcast streams dynamically as well!
    };

    handlePlayTrack(virtualTrack, [virtualTrack], 'Trending Podcasts');
    setSelectedPodcast(null);
    setIsExpandedPlayerOpen(true);
  };

  return (
    <div className="relative min-h-screen text-on-surface bg-black pb-12 font-sans overflow-x-hidden">
      {/* Inject dynamic pigment styles matching standard presets */}
      <style>{`
        :root {
          --color-primary-neon: ${THEME_PIGMENTS[themeColor]};
          --color-primary: ${THEME_PIGMENTS[themeColor]};
        }
        .text-primary-neon {
          color: var(--color-primary-neon) !important;
        }
        .bg-primary-neon {
          background-color: var(--color-primary-neon) !important;
        }
        .border-primary-neon {
          border-color: var(--color-primary-neon) !important;
        }
        /* Overwrite standard Tailwind primary styles dynamically */
        .text-primary {
          color: var(--color-primary-neon) !important;
        }
        .bg-primary {
          background-color: var(--color-primary-neon) !important;
        }
        .border-primary {
          border-color: var(--color-primary-neon) !important;
        }
        .bg-primary-container {
          background-color: var(--color-primary-neon) !important;
        }
        .text-primary-container {
          color: var(--color-primary-neon) !important;
        }
      `}</style>

      {/* Persistent App Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md h-16 px-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            alt="Jerfin Profile"
            className="w-10 h-10 rounded-full border-2 border-primary-neon object-cover cursor-pointer hover:opacity-90 active:scale-95 transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj5Um8wlRj6Wkyj9S8KL7dZ92txitEgJcc_qdNmuQSHI6md22H3U9VMcFZAa6iAtXISFL7FubeSWRIi7leKNbfb9GqBKgUPQnuhc3jngQkVV7UUCrGWFG0EckiABu5dRcWWBFGxCveMlEviUCvIC1eimhL0sdG7ddTWyOKXn-OJaVbqel6W8Hp3aIw0tvcmn_0blDzmPAz686TZt4TWoPhGDzN30CWHv8ZAtJEEPexsBnbKdpxhPQhmCdjGFJZNn8y3XKBvFjrpQ"
            referrerPolicy="no-referrer"
            onClick={() => {
              setActiveTab('library');
            }}
          />
          <div>
            <h1 className="font-sans font-bold text-sm tracking-tight text-white leading-none">
              Good evening, Jerfin
            </h1>
            <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">
              Hi-Fi System Synced
            </span>
          </div>
        </div>

        {/* Dynamic streaming monitor */}
        <div className="flex items-center gap-4">
          {isPlaying && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary-neon/10 border border-primary-neon/15 rounded-full text-primary-neon text-[10px] font-mono font-medium tracking-wide">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>SYNTHESIS PRODUCING</span>
            </div>
          )}

          <button
            onClick={() => {
              setActiveTab('library');
            }}
            className="text-zinc-400 hover:text-white transition-colors active:scale-95"
            title="Calibrators & Settings"
          >
            <Settings className="w-5.5 h-5.5" />
          </button>
        </div>
      </header>

      {/* Main content slot */}
      <main className="max-w-md mx-auto px-4 pt-20 pb-44">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <HomeTab
                tracks={tracks}
                onPlayTrack={(track) => handlePlayTrack(track, tracks, 'Recently Played')}
                onPlayPlaylist={handlePlayPlaylist}
                onSelectPodcast={setSelectedPodcast}
                currentTrackId={currentTrack?.id}
                isPlaying={isPlaying}
              />
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <SearchTab
                tracks={tracks}
                onPlayTrack={(track) => handlePlayTrack(track, tracks, 'Search Matches')}
                currentTrackId={currentTrack?.id}
                isPlaying={isPlaying}
              />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <LibraryTab
                onPlayPlaylist={handlePlayPlaylist}
                onPlayTrack={(track) => handlePlayTrack(track, tracks, 'Your Library')}
                themeColor={themeColor}
                setThemeColor={setThemeColor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Mini elements */}
      <AnimatePresence>
        {currentTrack && !isExpandedPlayerOpen && (
          <MiniPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onPlayPauseToggle={handlePlayPauseToggle}
            onOpenExpandedPlayer={() => setIsExpandedPlayerOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Persistent bottom glass-bar navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-[84px] bg-[#121212]/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-50 px-6">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all py-2 ${
            activeTab === 'home'
              ? 'text-primary-neon font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="w-5.5 h-5.5" />
          <span className="text-[10px] font-medium font-sans">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all py-2 ${
            activeTab === 'search'
              ? 'text-primary-neon font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Search className="w-5.5 h-5.5" />
          <span className="text-[10px] font-medium font-sans">Search</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 flex-1 transition-all py-2 ${
            activeTab === 'library'
              ? 'text-primary-neon font-semibold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Library className="w-5.5 h-5.5" />
          <span className="text-[10px] font-medium font-sans">Library</span>
        </button>
      </nav>

      {/* Sliding full height bottom sheet Expanded player */}
      <AnimatePresence>
        {isExpandedPlayerOpen && currentTrack && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="fixed inset-0 z-50"
          >
            <NowPlayingOverlay
              track={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              onPlayPauseToggle={handlePlayPauseToggle}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
              onSeek={handleSeek}
              onClose={() => setIsExpandedPlayerOpen(false)}
              playlistName={currentPlaylistName}
              shuffle={shuffle}
              repeat={repeat}
              onToggleShuffle={() => setShuffle(!shuffle)}
              onToggleRepeat={() => setRepeat(!repeat)}
              queue={playbackQueue}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Slide up Podcast Detailed Sheet */}
      <AnimatePresence>
        {selectedPodcast && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 190 }}
            className="fixed inset-0 z-50"
          >
            <PodcastDetailsOverlay
              podcast={selectedPodcast}
              onClose={() => setSelectedPodcast(null)}
              onPlayEpisode={() => handlePlayPodcastEpisode(selectedPodcast)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
