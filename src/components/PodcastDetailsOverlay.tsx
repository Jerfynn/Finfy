import React from 'react';
import { Podcast } from '../types';
import { ChevronDown, Headphones, Bookmark, Share2, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface PodcastDetailsOverlayProps {
  podcast: Podcast;
  onClose: () => void;
  onPlayEpisode: () => void;
}

export function PodcastDetailsOverlay({
  podcast,
  onClose,
  onPlayEpisode,
}: PodcastDetailsOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col w-full h-screen select-none overflow-hidden pb-12">
      {/* Background ambient glow matching theme */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-primary-neon/10 blur-[130px] animate-pulse" />
      </div>

      {/* Header Bar */}
      <header className="flex justify-between items-center h-16 w-full px-4 fixed top-0 bg-transparent z-40">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-zinc-100 hover:text-primary transition-colors hover:bg-white/5 rounded-full"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">
          Podcast Episode
        </span>

        <button
          onClick={() => alert("Added to bookmarks.")}
          className="w-10 h-10 flex items-center justify-center text-zinc-100 hover:text-primary transition-colors hover:bg-white/5 rounded-full"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </header>

      {/* Main layout */}
      <main className="flex-1 flex flex-col justify-center px-8 pt-24 pb-8 max-w-sm mx-auto w-full space-y-6">
        {/* Album Art Frame */}
        <div className="flex justify-center flex-1 items-center">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="w-56 h-56 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/5 relative group"
          >
            <img
              src={podcast.imageUrl}
              alt={podcast.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </div>

        {/* Categories, Titles, Stats */}
        <div className="space-y-3 text-center">
          <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider rounded uppercase bg-primary-neon/15 text-primary-neon border border-primary-neon/15">
            {podcast.category}
          </span>
          <h2 className="text-lg font-bold text-white leading-tight font-sans">
            {podcast.title}
          </h2>
          <p className="text-xs text-zinc-400 font-medium">By {podcast.publisher}</p>
        </div>

        {/* Styled Scrollable Synopsis box */}
        <div className="bg-surface-container border border-white/5 p-4 rounded-2xl max-h-36 overflow-y-auto">
          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
            Episode Synopsis
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">{podcast.description}</p>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl border border-white/3 text-center text-[10.5px] font-mono text-zinc-400">
          <div className="border-r border-white/5 flex flex-col justify-center py-1">
            <span className="text-zinc-500 text-[9px] uppercase">Duration</span>
            <span className="font-semibold text-white mt-0.5">{podcast.durationMinutes} minutes</span>
          </div>
          <div className="flex flex-col justify-center py-1">
            <span className="text-zinc-500 text-[9px] uppercase">Channel</span>
            <span className="font-semibold text-white mt-0.5">FinFy Digital</span>
          </div>
        </div>

        {/* Action Triggers footer row */}
        <div className="flex gap-3">
          <button
            onClick={() => alert("Podcast share links copied successfully.")}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-colors flex-shrink-0"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={onPlayEpisode}
            className="flex-1 h-12 rounded-xl bg-primary-neon text-black font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,107,0,0.35)] hover:scale-101 active:scale-98 transition-transform"
          >
            <Play className="w-4 h-4 fill-current" /> Play Episode Now
          </button>
        </div>
      </main>
    </div>
  );
}
