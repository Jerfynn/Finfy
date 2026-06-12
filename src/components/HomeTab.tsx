import React from 'react';
import { TRACKS, PODCASTS, PLAYLISTS } from '../data';
import { Track, Podcast, Playlist } from '../types';
import { Play, Heart, Headphones, Sparkles, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeTabProps {
  onPlayTrack: (track: Track) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  onSelectPodcast: (podcast: Podcast) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  tracks?: Track[];
}

export function HomeTab({
  onPlayTrack,
  onPlayPlaylist,
  onSelectPodcast,
  currentTrackId,
  isPlaying,
  tracks = TRACKS,
}: HomeTabProps) {
  // We want to skip the "active" techno track from standard list if needed, or include it
  const recentlyPlayedTracks = tracks.filter((t) => t.id !== 'active');
  const activeTechnoTrack = tracks.find((t) => t.id === 'active');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
            Recently Played
          </h2>
          <span className="text-[11px] font-mono tracking-wider text-primary-neon uppercase">
            6 tracks
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {recentlyPlayedTracks.map((track) => {
            const isActive = currentTrackId === track.id;
            return (
              <motion.div
                key={track.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPlayTrack(track)}
                className={`relative group flex items-center gap-3 p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border ${
                  isActive ? 'border-primary-neon/40' : 'border-white/5'
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-container-highest flex-shrink-0">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={track.imageUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                  />
                  {isActive && isPlaying && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="flex items-end gap-0.5 h-4">
                        <span className="w-1 bg-primary-neon rounded-full animate-bounce h-full" style={{ animationDelay: '0s' }} />
                        <span className="w-1 bg-primary-neon rounded-full animate-bounce h-2" style={{ animationDelay: '0.15s' }} />
                        <span className="w-1 bg-primary-neon rounded-full animate-bounce h-3" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <span className={`block text-[13px] font-semibold truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                    {track.title}
                  </span>
                  <span className="block text-[11px] text-zinc-400 truncate mt-0.5">
                    {track.artist}
                  </span>
                </div>
                <button 
                  className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm hover:text-primary-neon text-white p-1 rounded-full border border-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayTrack(track);
                  }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Made for You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Made for You
          </h2>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
            Personalized
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {/* Liked Songs item */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const likedPlaylist = PLAYLISTS.find(p => p.type === 'liked');
              if (likedPlaylist) onPlayPlaylist(likedPlaylist);
            }}
            className="flex items-center gap-4 bg-surface-container-low hover:bg-surface-container p-4 rounded-2xl group transition-all cursor-pointer border border-white/5 shadow-md"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-neon to-amber-600 flex items-center justify-center text-black flex-shrink-0 shadow-lg">
              <Heart className="w-6 h-6 fill-black stroke-black" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[15px] text-white">Liked Songs</h3>
              <p className="text-xs text-zinc-400 mt-1">428 tracks synced offline</p>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-primary group-hover:bg-primary-neon group-hover:text-black transition-all">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </motion.div>

          {/* Daily Mix 1 and Discover Weekly */}
          {PLAYLISTS.filter(p => p.type !== 'liked').map((playlist) => (
            <motion.div
              key={playlist.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onPlayPlaylist(playlist)}
              className="flex items-center gap-4 bg-surface-container-low hover:bg-surface-container p-4 rounded-2xl group transition-all cursor-pointer border border-white/5"
            >
              <div className="w-14 h-14 rounded-xl bg-surface-container-high overflow-hidden flex-shrink-0 shadow-md">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={playlist.imageUrl}
                  alt={playlist.name}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[15px] text-white">{playlist.name}</h3>
                <p className="text-xs text-zinc-400 mt-1">{playlist.description}</p>
              </div>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-primary group-hover:bg-primary-neon group-hover:text-black transition-all">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Podcasts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Trending Podcasts
          </h2>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
            2 new episodes
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PODCASTS.map((pod) => (
            <motion.div
              key={pod.id}
              variants={itemVariants}
              whileHover={{ scale: 1.015 }}
              onClick={() => onSelectPodcast(pod)}
              className="flex gap-4 p-3 bg-surface-container rounded-2xl cursor-pointer border border-white/5 hover:border-primary-neon/20 transition-all items-start group"
            >
              <div className="w-20 h-20 rounded-xl flex-shrink-0 bg-surface-container-high overflow-hidden shadow-inner relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={pod.imageUrl}
                  alt={pod.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-primary-neon" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`inline-block px-2 py-0.5 text-[9px] font-semibold font-mono rounded uppercase tracking-wider ${
                  pod.category === 'Technology' 
                    ? 'text-primary-neon bg-primary-neon/10 border border-primary-neon/10' 
                    : 'text-tertiary bg-tertiary/10 border border-tertiary/10'
                }`}>
                  {pod.category}
                </span>
                <h3 className="font-bold text-sm text-white leading-tight mt-1 truncate group-hover:text-primary transition-colors">
                  {pod.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {pod.description}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 font-mono">
                  <span>{pod.publisher}</span>
                  <span>•</span>
                  <span>{pod.durationMinutes} min</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
