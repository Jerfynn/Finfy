import React, { useState } from 'react';
import { PLAYLISTS } from '../data';
import { Playlist, Track } from '../types';
import { FolderHeart, Plus, Settings, User, Radio, Sliders, Check, Sparkles, LogOut, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LibraryTabProps {
  onPlayPlaylist: (playlist: Playlist) => void;
  onPlayTrack: (track: Track) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
}

const THEME_OPTIONS = [
  { id: 'orange', name: 'Midnight Neon', hex: '#ff6b00', text: 'text-[#ff6b00]' },
  { id: 'cyan', name: 'Electric Cyan', hex: '#00f0ff', text: 'text-[#00f0ff]' },
  { id: 'pink', name: 'Hot Magenta', hex: '#ff007f', text: 'text-[#ff007f]' },
  { id: 'green', name: 'Laser Green', hex: '#39ff14', text: 'text-[#39ff14]' }
];

export function LibraryTab({
  onPlayPlaylist,
  onPlayTrack,
  themeColor,
  setThemeColor,
}: LibraryTabProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>([]);
  const [streamQuality, setStreamQuality] = useState('hifi');

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
      id: `custom-${Date.now()}`,
      name: newPlaylistName,
      description: 'Custom created channel',
      type: 'custom',
      tracks: [],
    };

    setCustomPlaylists([...customPlaylists, newPlaylist]);
    setNewPlaylistName('');
    setShowAddPlaylistModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1">
            Library
          </h2>
          <p className="text-xs text-zinc-400">Playlists, sync states, & calibrations</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border ${
            showSettings
              ? 'bg-primary-neon text-black border-transparent'
              : 'bg-surface-container text-zinc-400 hover:text-white border-white/5'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showSettings ? (
          /* Profile & Settings Sub-screen */
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Account Card */}
            <div className="p-4 bg-surface-container rounded-2xl border border-white/5 flex items-center gap-4">
              <img
                className="w-14 h-14 rounded-full border-2 border-primary-neon object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj5Um8wlRj6Wkyj9S8KL7dZ92txitEgJcc_qdNmuQSHI6md22H3U9VMcFZAa6iAtXISFL7FubeSWRIi7leKNbfb9GqBKgUPQnuhc3jngQkVV7UUCrGWFG0EckiABu5dRcWWBFGxCveMlEviUCvIC1eimhL0sdG7ddTWyOKXn-OJaVbqel6W8Hp3aIw0tvcmn_0blDzmPAz686TZt4TWoPhGDzN30CWHv8ZAtJEEPexsBnbKdpxhPQhmCdjGFJZNn8y3XKBvFjrpQ"
                alt="Profile"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bold text-white text-[15px]">Jerfin Fink</h3>
                <p className="text-xs text-primary-neon">Premium Audiophile Account</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">UID: 962055-AIS</p>
              </div>
            </div>

            {/* Accent Theme Controls */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" /> DYNAMIC ACCENT SYSTEM
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {THEME_OPTIONS.map((opt) => {
                  const isActive = themeColor === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setThemeColor(opt.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all min-w-0 ${
                        isActive
                          ? 'bg-surface-container-high border-white/10'
                          : 'bg-surface-container-low border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 mr-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: opt.hex }}
                        />
                        <span className={`truncate ${isActive ? 'font-bold text-white' : 'text-zinc-300'}`}>
                          {opt.name}
                        </span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-primary-neon flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stream quality settings */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" /> AUDIO FEED CALIBRATION
              </h4>
              <div className="p-3 bg-surface-container rounded-2xl border border-white/5 divide-y divide-white/5">
                {[
                  { id: 'hifi', label: 'Hi-Fi Lossless (WebAudio High-Res)', desc: '24-bit 96kHz synthetic' },
                  { id: 'high', label: 'Standard Digital Sweep', desc: '16-bit 48kHz balanced' },
                  { id: 'eco', label: 'Battery Saver Low', desc: 'Saves processor interrupts' }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setStreamQuality(item.id)}
                    className="flex items-center justify-between py-2.5 cursor-pointer first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{item.label}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</p>
                    </div>
                    {streamQuality === item.id && (
                      <span className="w-2 h-2 rounded-full bg-primary-neon shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom logout buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-xl text-xs font-semibold text-white transition-all"
              >
                Back To Library
              </button>
              <button
                onClick={() => alert("Premium account logged in securely offline.")}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-400 font-semibold text-xs px-4 rounded-xl flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" /> Secure Auth
              </button>
            </div>
          </motion.div>
        ) : (
          /* Library Playlists Layout */
          <motion.div
            key="playlists"
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 25 }}
            className="space-y-6"
          >
            {/* Quick action grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowAddPlaylistModal(true)}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all border border-dashed border-white/10 hover:border-primary-neon/40 group text-center"
              >
                <Plus className="w-6 h-6 text-zinc-500 group-hover:text-primary-neon transition-colors mb-2" />
                <span className="text-xs font-semibold text-zinc-300">New Channel</span>
              </button>

              <button
                onClick={() => {
                  const likedPlaylist = PLAYLISTS.find(p => p.type === 'liked');
                  if (likedPlaylist) onPlayPlaylist(likedPlaylist);
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all border border-white/5 hover:border-primary-neon/20 text-center"
              >
                <FolderHeart className="w-6 h-6 text-primary-neon mb-2" />
                <span className="text-xs font-semibold text-white">Loved Tracks</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">428 tracks</span>
              </button>
            </div>

            {/* List Header */}
            <div>
              <h3 className="text-xs font-mono text-zinc-500 tracking-wider">YOUR RETRO FEEDS</h3>
              <div className="flex flex-col gap-2 mt-3">
                {/* Default static feeds */}
                {PLAYLISTS.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => onPlayPlaylist(playlist)}
                    className="flex items-center gap-3 p-3 bg-surface-container-low hover:bg-surface-container border border-white/3 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-surface-container-high flex-shrink-0">
                      {playlist.imageUrl ? (
                        <img
                          src={playlist.imageUrl}
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-neon/10 flex items-center justify-center text-primary-neon">
                          <FolderHeart className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{playlist.name}</h4>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {playlist.description}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Custom users created playlist */}
                {customPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => onPlayPlaylist(playlist)}
                    className="flex items-center gap-3 p-3 bg-surface-container-low hover:bg-surface-container border border-primary-neon/10 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="w-11 h-11 rounded-lg bg-primary-neon/10 border border-primary-neon/20 flex items-center justify-center text-primary-neon flex-shrink-0">
                      <FolderHeart className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{playlist.name}</h4>
                      <p className="text-[10.5px] text-zinc-400 truncate mt-0.5">
                        {playlist.tracks.length} tracks • Custom digital channel
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Custom Addition Modal */}
      <AnimatePresence>
        {showAddPlaylistModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.form
              onSubmit={handleCreatePlaylist}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xs bg-surface-container border border-white/10 rounded-3xl p-5 shadow-2xl relative space-y-4"
            >
              <div className="text-center">
                <Sparkles className="w-7 h-7 text-primary-neon mx-auto mb-2" />
                <h3 className="text-md font-bold text-white">Create Custom Channel</h3>
                <p className="text-[10px] text-zinc-500 mt-1">Calibrate a custom synthetic sound loop</p>
              </div>

              <input
                type="text"
                autoFocus
                placeholder="Channel Name (e.g. Midnight Synth)"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full bg-surface-container-low border border-white/5 focus:border-primary-neon/40 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-500 outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlaylistModal(false);
                    setNewPlaylistName('');
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 rounded-xl py-2.5 text-xs font-semibold text-white transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-neon text-black font-bold rounded-xl py-2.5 text-xs transition-all shadow-[0_0_12px_rgba(255,107,0,0.3)]"
                >
                  Configure
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
