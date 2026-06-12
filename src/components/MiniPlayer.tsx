import React from 'react';
import { Track } from '../types';
import { Play, Pause, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

interface MiniPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  onPlayPauseToggle: (e: React.MouseEvent) => void;
  onOpenExpandedPlayer: () => void;
}

export function MiniPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  onPlayPauseToggle,
  onOpenExpandedPlayer,
}: MiniPlayerProps) {
  const duration = currentTrack.duration;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      onClick={onOpenExpandedPlayer}
      className="fixed bottom-[84px] left-4 right-4 z-40 bg-[#121212]/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-14 border border-white/5 flex items-center px-4 cursor-pointer hover:border-white/10 active:scale-[0.99] transition-all group"
    >
      {/* 2px thin Neon Orange progress bar spanning the full width at the very top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 w-full">
        <div
          className="h-full bg-primary-neon shadow-[0_0_8px_#ff6b00]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Small 40x40px album art (4px radius) */}
      <div className="w-10 h-10 rounded-md bg-surface-container-highest overflow-hidden mr-3 flex-shrink-0 border border-white/5 relative">
        <img
          className={`w-full h-full object-cover ${isPlaying ? 'scale-102' : 'scale-100 group-hover:scale-105'} transition-all`}
          src={currentTrack.imageUrl}
          alt={currentTrack.title}
          referrerPolicy="no-referrer"
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-neon animate-ping" />
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-white font-semibold text-xs truncate font-sans tracking-tight leading-sm">
          {currentTrack.title}
        </h4>
        <p className="text-zinc-400 text-[10px] truncate mt-0.5 font-mono">
          {currentTrack.artist}
        </p>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-3.5 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert("Connecting to local WebAudio output node...");
          }}
          className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
          title="Devices"
        >
          <Smartphone className="w-4 h-4" />
        </button>

        <button
          onClick={onPlayPauseToggle}
          className="w-8 h-8 rounded-full bg-primary-neon/10 hover:bg-primary-neon/20 flex items-center justify-center text-primary-neon hover:scale-105 active:scale-95 transition-all border border-primary-neon/15"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
