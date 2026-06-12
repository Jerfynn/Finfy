import React, { useState, useMemo } from 'react';
import { TRACKS } from '../data';
import { Track } from '../types';
import { Search as SearchIcon, Volume2, Play, Music, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchTabProps {
  onPlayTrack: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  tracks?: Track[];
}

const GENRES = [
  { id: 'all', label: 'All Beats' },
  { id: 'synthwave', label: 'Synth Waves', notes: ['1', '5'] },
  { id: 'cyberpunk', label: 'Midnight Beats', notes: ['2', '4'] },
  { id: 'techno', label: 'Techno Bunker', notes: ['active'] },
  { id: 'jazz', label: 'Urban Jazz', notes: ['3'] },
  { id: 'ambient', label: 'Golden Chill', notes: ['6'] }
];

export function SearchTab({ onPlayTrack, currentTrackId, isPlaying, tracks = TRACKS }: SearchTabProps) {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      // Filter by genre mapping
      if (selectedGenre !== 'all') {
        const genreObj = GENRES.find(g => g.id === selectedGenre);
        if (genreObj && !genreObj.notes.includes(track.id)) {
          return false;
        }
      }

      // Filter by query
      if (query.trim() === '') return true;
      const lower = query.toLowerCase();
      return (
        track.title.toLowerCase().includes(lower) ||
        track.artist.toLowerCase().includes(lower) ||
        track.album.toLowerCase().includes(lower)
      );
    });
  }, [query, selectedGenre]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1">
          Search
        </h2>
        <p className="text-xs text-zinc-400">Discover custom synth waves or podcasts</p>
      </div>

      {/* Styled Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400">
          <SearchIcon className="w-5 h-5" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artists, tracks, or ambient channels..."
          className="w-full bg-surface-container border border-white/5 focus:border-primary-neon/30 hover:bg-surface-container-high transition-colors rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-500 outline-none focus:ring-0"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 inset-y-0 flex items-center text-xs text-zinc-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Aesthetic Filters */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 py-2">
        <div className="flex gap-2">
          {GENRES.map((g) => {
            const isSelected = selectedGenre === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={`py-2 px-4 rounded-full text-xs font-medium border whitespace-nowrap transition-all duration-300 ${
                  isSelected
                    ? 'bg-primary-neon text-black border-transparent shadow-[0_0_12px_rgba(255,107,0,0.25)] scale-102 font-semibold'
                    : 'bg-surface-container text-zinc-300 border-white/5 hover:bg-surface-container-high hover:border-white/10'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Output */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pr-2">
          <span>RESULTS ({filteredTracks.length})</span>
          <span>SPEED: 4ms</span>
        </div>

        {filteredTracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-surface-container-low border border-white/3 border-dashed rounded-2xl text-center"
          >
            <Sparkles className="w-8 h-8 text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-sm font-semibold">No sound waves matched</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-[220px]">
              Try searching "Synth", "Jazz", or clear active filters for all beats
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTracks.map((track) => {
              const isActive = currentTrackId === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-surface-container-high border-primary-neon/20'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0 relative group">
                      <img
                        src={track.imageUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isActive && isPlaying ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Volume2 className="w-4 h-4 text-primary-neon animate-pulse" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-zinc-100'}`}>
                          {track.title}
                        </span>
                        {track.id === 'active' && (
                          <span className="text-[8px] tracking-wider px-1 py-0.2 bg-primary-neon/15 text-primary-neon uppercase font-bold border border-primary-neon/10 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-zinc-400 mt-0.5">
                        {track.artist} • {track.album}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                    <span>
                      {Math.floor(track.duration / 60)}:
                      {String(track.duration % 60).padStart(2, '0')}
                    </span>
                    <button
                      className={`w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack(track);
                      }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
