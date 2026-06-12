import React, { useEffect, useState, useRef } from 'react';
import { Track } from '../types';
import { audioSynth } from '../utils/audio';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Smartphone,
  Share2,
  ListMusic,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NowPlayingOverlayProps {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  onPlayPauseToggle: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSeek: (seconds: number) => void;
  onClose: () => void;
  playlistName?: string;
  shuffle: boolean;
  repeat: boolean;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  queue: Track[];
}

export function NowPlayingOverlay({
  track,
  isPlaying,
  currentTime,
  onPlayPauseToggle,
  onNextTrack,
  onPrevTrack,
  onSeek,
  onClose,
  playlistName = 'Techno Bunker',
  shuffle,
  repeat,
  onToggleShuffle,
  onToggleRepeat,
  queue
}: NowPlayingOverlayProps) {
  const [isLiked, setIsLiked] = useState(true);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [showQueuePanel, setShowQueuePanel] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);

  // Poll real waveform from synthesizer node when playing
  useEffect(() => {
    const updateWave = () => {
      setWaveform(audioSynth.getWaveform());
      animationRef.current = requestAnimationFrame(updateWave);
    };
    updateWave();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleShare = () => {
    // Write current track URL to clipboard
    const shareUrl = `${window.location.href}?track=${track.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2000);
    });
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col w-full h-screen select-none overflow-hidden pb-12">
      {/* Absolute Dynamic Atmospheric Background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none transition-all duration-1000">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary-neon/15 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      {/* Header Banner */}
      <header className="flex justify-between items-center h-16 w-full px-4 fixed top-0 bg-transparent z-40">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-zinc-100 hover:text-primary transition-colors hover:bg-white/5 rounded-full"
        >
          <ChevronDown className="w-7 h-7" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-500">
            Playing From Playlist
          </span>
          <span className="text-xs font-bold text-white font-sans mt-0.5">{playlistName}</span>
        </div>

        <button
          onClick={() => alert(`Dynamic synthetic matrix calibration: ${track.synthConfig?.type || 'sine'}`)}
          className="w-10 h-10 flex items-center justify-center text-zinc-100 hover:text-primary transition-colors hover:bg-white/5 rounded-full"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Primary interactive layout */}
      <main className="flex-1 flex flex-col justify-between px-6 pt-20 pb-4 max-w-md mx-auto w-full">
        {/* Large reflective Album art */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/5 group"
          >
            <img
              src={track.imageUrl}
              alt={track.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-[1.03] rotate-[0.5deg]' : 'scale-100'
              }`}
              referrerPolicy="no-referrer"
            />
            {/* Mirror overlay reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
          </motion.div>

          {/* Dynamic LED spectrum visualizer bar rows underneath image */}
          <div className="flex items-end justify-center gap-[3px] h-10 w-full max-w-[280px] mt-6 px-4">
            {waveform.map((pt, idx) => {
              // Convert 0-255 baseline to peak percentage
              const offset = Math.abs(pt - 128); // height from center
              const heightPercent = isPlaying
                ? Math.min(100, Math.max(10, (offset / 128) * 160))
                : 10 + Math.sin(idx * 0.4 + Date.now() * 0.003) * 15;

              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-all duration-75 ${
                    isPlaying ? 'bg-primary-neon' : 'bg-zinc-700'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    boxShadow: isPlaying ? '0 0 6px rgba(255,107,0,0.5)' : 'none',
                    opacity: 0.35 + (heightPercent / 100) * 0.65
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Track Title and Artist Block */}
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col min-w-0 flex-1 pr-6">
            <motion.h1
              layoutId={`title-${track.id}`}
              className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none truncate"
            >
              {track.title}
            </motion.h1>
            <p className="text-zinc-400 text-xs md:text-sm truncate mt-2 font-mono">
              {track.artist}
            </p>
          </div>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all ${
              isLiked
                ? 'bg-primary-neon/10 border-primary-neon/20 text-primary-neon'
                : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Audio scrub timeline slider */}
        <div className="space-y-2 mb-4">
          <div className="relative w-full h-1 bg-zinc-800 rounded-full group">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-primary-neon shadow-[0_0_8px_#ff6b00]"
              style={{ width: `${(currentTime / track.duration) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={track.duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="absolute -top-1.5 left-0 w-full h-4 opacity-0 cursor-pointer appearance-none z-10"
            />
          </div>
          <div className="flex justify-between px-0.5 text-[10px] text-zinc-500 font-mono font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Playback action controls deck */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <button
              onClick={onToggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                shuffle ? 'text-primary-neon' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={onPrevTrack}
              className="p-2 text-zinc-300 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            {/* Huge dynamic center circular trigger */}
            <button
              onClick={onPlayPauseToggle}
              className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center bg-primary-neon text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,107,0,0.45)] border border-primary-neon"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-black stroke-black" />
              ) : (
                <Play className="w-6 h-6 fill-black stroke-black ml-1" />
              )}
            </button>

            <button
              onClick={onNextTrack}
              className="p-2 text-zinc-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>

            <button
              onClick={onToggleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeat ? 'text-primary-neon' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Repeat"
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Under deck items row: Devices, Share, Queue */}
          <div className="flex justify-around items-center pt-2 border-t border-white/5">
            <button
              onClick={() => alert(`Active Node Status: Dynamic Audio Loop running: ${formatTime(currentTime)}`)}
              className="flex flex-col items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              <Smartphone className="w-4.5 h-4.5 mb-0.5" />
              <span>Devices</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              <Share2 className="w-4.5 h-4.5 mb-0.5" />
              <span>Share</span>
            </button>

            <button
              onClick={() => setShowQueuePanel(true)}
              className="flex flex-col items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-zinc-500 hover:text-white transition-colors"
            >
              <ListMusic className="w-4.5 h-4.5 mb-0.5" />
              <span>Queue</span>
            </button>
          </div>
        </div>
      </main>

      {/* Share clipboard copied banner */}
      <AnimatePresence>
        {showShareNotification && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-surface-container border border-primary-neon/20 px-4 py-2 rounded-full text-xs text-primary-neon flex items-center gap-2 shadow-xl z-50 font-semibold"
          >
            <Check className="w-4 h-4" /> Loop link written to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Queue drawer slide up */}
      <AnimatePresence>
        {showQueuePanel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end">
            <div
              className="absolute inset-0"
              onClick={() => setShowQueuePanel(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full bg-[#121212] border-t border-white/10 rounded-t-[32px] p-6 max-h-[70vh] flex flex-col relative z-10"
            >
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowQueuePanel(false)} />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-primary-neon" /> Matrix Playback Queue
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{queue.length} streams</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1 hide-scrollbar">
                {queue.map((qTrack, idx) => {
                  const isCurrent = qTrack.id === track.id;
                  return (
                    <div
                      key={`${qTrack.id}-${idx}`}
                      className={`flex items-center gap-3 p-2 rounded-xl border ${
                        isCurrent 
                          ? 'bg-primary-neon/5 border-primary-neon/15 text-primary-neon' 
                          : 'bg-white/3 border-transparent hover:bg-white/5 text-zinc-300'
                      }`}
                    >
                      <span className="w-4 text-center text-xs font-mono text-zinc-600 font-semibold">{idx + 1}</span>
                      <img
                        src={qTrack.imageUrl}
                        alt={qTrack.title}
                        className="w-9 h-9 object-cover rounded-md flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{qTrack.title}</p>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">{qTrack.artist}</p>
                      </div>
                      {isCurrent && <span className="text-[9px] px-1.5 py-0.2 bg-primary-neon/15 text-primary-neon rounded font-mono uppercase font-bold">LIVE</span>}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowQueuePanel(false)}
                className="mt-6 w-full bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl text-xs font-bold text-white transition-all"
              >
                Close Queue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
