import { Track } from '../types';

class AudioSynthManager {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentTrack: Track | null = null;
  private volumeValue = 0.5;
  private analyzerNode: AnalyserNode | null = null;

  // HTML5 Media Player details
  private audioElement: HTMLAudioElement | null = null;
  private audioSource: MediaElementAudioSourceNode | null = null;

  // Lazy initialize AudioContext on user gesture
  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Setup master gain
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volumeValue * 0.5, this.ctx.currentTime);

        // Setup analyzer so we can make real waveform visualization!
        this.analyzerNode = this.ctx.createAnalyser();
        this.analyzerNode.fftSize = 64;

        // Chain together
        this.gainNode.connect(this.analyzerNode);
        this.analyzerNode.connect(this.ctx.destination);
      }
    }
    // Resume context if suspended
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Retrieve or instantiate HTML5 Audio element
  public getOrCreateAudioElement(): HTMLAudioElement {
    this.init();
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = "anonymous";
      
      if (this.ctx) {
        try {
          this.audioSource = this.ctx.createMediaElementSource(this.audioElement);
          // Connect to analyzer for live audio frequencies feeds
          this.audioSource.connect(this.analyzerNode || this.ctx.destination);
        } catch (err) {
          console.warn("MediaElementAudioSourceNode connection error:", err);
        }
      }
    }
    return this.audioElement;
  }

  public getAudioElement(): HTMLAudioElement {
    return this.getOrCreateAudioElement();
  }

  public play(track: Track, onTick: () => void = () => {}) {
    this.init();
    this.isPlaying = true;
    
    const audio = this.getOrCreateAudioElement();
    const streamUrl = track.audioUrl || `/api/stream/${track.id}`;

    // If it's a new song selection, load and play
    if (this.currentTrack?.id !== track.id) {
      this.currentTrack = track;
      audio.src = streamUrl;
      audio.load();
    }

    audio.play()
      .then(() => {
        onTick();
      })
      .catch(err => {
        console.warn("Autoplay was prevented by browser security rules - waiting user interaction:", err);
      });
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public seek(seconds: number) {
    const audio = this.getOrCreateAudioElement();
    if (audio && isFinite(seconds)) {
      audio.currentTime = seconds;
    }
  }

  public setVolume(vol: number) {
    this.volumeValue = vol;
    if (this.audioElement) {
      this.audioElement.volume = vol;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol * 0.5, this.ctx.currentTime);
    }
  }

  public getWaveform(): number[] {
    if (!this.analyzerNode || !this.isPlaying) {
      // Return interactive, gorgeous floating sine waves when paused
      const time = Date.now() * 0.003;
      return Array.from({ length: 16 }, (_, i) => {
        const val = Math.sin(i * 0.4 + time) * 40 + Math.cos(i * 0.2 + time) * 20 + 128;
        return Math.floor(Math.min(255, Math.max(0, val)));
      });
    }

    const dataArray = new Uint8Array(this.analyzerNode.frequencyBinCount);
    this.analyzerNode.getByteTimeDomainData(dataArray);

    // Downsample to 16 points for our LED bouncing spectrum rows
    const result: number[] = [];
    const step = Math.floor(dataArray.length / 16) || 1;
    for (let i = 0; i < 16; i++) {
      result.push(dataArray[i * step] || 128);
    }
    return result;
  }
}

export const audioSynth = new AudioSynthManager();
