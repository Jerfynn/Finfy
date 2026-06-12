<div align="center">
  <img width="1200" height="475" alt="FinFy Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />

  <h1>🎵 FinFy - High-Fidelity Music Streaming</h1>
  
  <p>A gorgeous, high-fidelity music streaming web application built with a premium Midnight Neon theme.</p>
</div>

## 🌟 Overview

FinFy is not just another music player. It features interactive playbacks, fully working audio timelines, searchable tracks, a liked songs library, and beautifully animated bottom sheets. The backend boasts a unique **Mathematical Synthesizer** that generates real sound waves (WAV files) on the fly, alongside supporting seamless HTTP Range requests for instant scrubbing and zero-latency seeking.

## ✨ Key Features

- **Real-time Audio Synthesis:** On-the-fly mathematical waveform generation (Retrowave, Acid Techno, Urban Jazz, etc.).
- **Local Audio Support:** Automatically scans and serves `.mp3` and `.wav` files from the `backend/songs` directory.
- **High-Fidelity Streaming:** Custom Express backend with full HTTP Range request support for seamless audio scrubbing.
- **Dynamic Themes:** Switch between Midnight Neon (Orange), Electric Cyan, Hot Magenta, and Laser Green.
- **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for buttery smooth page transitions, floating overlays, and dynamic equalizers.
- **Library & Search:** Manage custom channels, view your "Loved Tracks", and search through the ambient feeds.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Vite.
- **Backend:** Node.js, Express, Custom Audio Synthesis Engine.

## 🚀 Getting Started

**Prerequisites:** Node.js (v18+ recommended)

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Set the `GEMINI_API_KEY` in your `.env.local` to your Gemini API key (if applicable).

3. **Add Local Music (Optional):**
   Drop your favorite `.mp3` or `.wav` files into the `backend/songs/` directory. FinFy will automatically detect and add them to your local library stream!

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to `http://localhost:3000` in your browser and enjoy the vibes.

## 📜 License

This project is licensed under the MIT License.
