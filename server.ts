import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Mathematical Synthesizer to generate real sound waves (WAV files) on the fly
function getSampleForTrack(trackId: string, sampleIdx: number, sRate: number = 22050): number {
  const t = sampleIdx / sRate;
  let sample = 0;

  if (trackId === '1') {
    // Synth Waves: Retrowave arpeggiator
    const noteTime = 0.125; // 8 notes per second (16th notes at 120bpm)
    const notes = [110, 137.5, 165, 220, 275, 330, 440, 330]; // A major outline
    const noteIndex = Math.floor(t / noteTime);
    const freq = notes[noteIndex % notes.length];
    
    // Sawtooth oscillator
    const phase = (t * freq) % 1;
    const saw = 2 * phase - 1;
    
    // Sub-bass oscillator
    const sub = Math.sin(2 * Math.PI * t * (freq / 2));
    
    // Exponential decay of individual notes
    const notePos = (t % noteTime) / noteTime;
    const env = Math.exp(-4 * notePos);
    
    // Low-pass sweep LFO
    const sweep = 0.4 + 0.6 * Math.sin(2 * Math.PI * t * 0.15);
    sample = (saw * sweep * 0.6 + sub * 0.4) * env;
  } 
  else if (trackId === '2') {
    // Midnight Beats: Melancholic chords with deep pulse
    const chordTime = 1.09; // 110bpm quarter note lengths
    const chords = [
      [98.0, 116.5, 146.8], // Gm
      [110.0, 130.8, 164.8], // Am
      [87.3, 103.8, 130.8], // Fm
      [98.0, 116.5, 146.8]  // Gm
    ];
    const chordIdx = Math.floor(t / (chordTime * 2)) % chords.length;
    const freqs = chords[chordIdx];
    
    let waveMix = 0;
    for (const f of freqs) {
      waveMix += Math.sin(2 * Math.PI * t * f);
    }
    waveMix /= 3.0;
    
    // Drum overlay (periodic deep kick and snare snap)
    const beatPos = (t % chordTime) / chordTime;
    const drumKick = Math.sin(2 * Math.PI * t * (120 * Math.exp(-40 * beatPos))) * Math.exp(-6 * beatPos);
    
    // Snare white-noise burst every 2 beats
    const halfChordTime = chordTime;
    const snareBeat = Math.floor(t / halfChordTime) % 2 === 1;
    const snare = snareBeat ? ((Math.random() * 2 - 1) * Math.exp(-14 * (t % halfChordTime))) : 0;
    
    sample = waveMix * 0.45 + drumKick * 0.45 + snare * 0.15;
  }
  else if (trackId === '3') {
    // Urban Jazz: Electric piano rhodes
    const chordTime = 1.6;
    const chords = [
      [130.8, 164.8, 196.0, 246.9], // Cmaj7
      [146.8, 174.6, 220.0, 261.6], // Dm7
      [196.0, 246.9, 293.7, 349.2], // G7
      [130.8, 164.8, 196.0, 246.9]  // Cmaj7
    ];
    const chordIdx = Math.floor(t / chordTime) % chords.length;
    const freqs = chords[chordIdx];
    
    const vibrato = 1.0 + 0.007 * Math.sin(2 * Math.PI * t * 5.5); // Warm vibrato
    let organ = 0;
    for (const f of freqs) {
      organ += Math.sin(2 * Math.PI * t * f * vibrato);
      organ += 0.25 * Math.sin(2 * Math.PI * t * f * 2 * vibrato); // Add warm second harmonic
    }
    organ /= 4.0;
    
    // Add soft snare rim click
    const beatPos = (t % 0.8) / 0.8;
    const rimClick = Math.sin(2 * Math.PI * t * 1500) * Math.exp(-40 * beatPos);
    
    sample = organ * 0.65 + rimClick * 0.12;
  } 
  else if (trackId === '4') {
    // Live Echoes: Echo sweeps
    const period = 1.5;
    const phasePos = (t % period) / period;
    const freq = 150 + 350 * Math.sin(Math.PI * phasePos);
    
    const wave = ((t * freq) % 1 < 0.5) ? 1 : -1; // square wave
    const env = Math.exp(-3 * phasePos);
    
    // Echo buffer synthesis
    const echo1 = t > 0.45 ? ((((t - 0.45) * freq) % 1 < 0.5 ? 1 : -1) * Math.exp(-3 * ((t - 0.45) % period)) * 0.35) : 0;
    
    sample = wave * env * 0.45 + echo1;
  } 
  else if (trackId === '5') {
    // Pop Pulse: Fast cheery neon synthesizer
    const beatTime = 60 / 128; // 128bpm
    const notesIdx = Math.floor(t / beatTime);
    const notes = [146.8, 164.8, 185.0, 220.0, 220.0, 185.0, 293.7, 220.0]; // Retro melody
    const freq = notes[notesIdx % notes.length];
    
    const phase = (t * freq) % 1;
    const tri = 1 - 4 * Math.abs(phase - 0.5); // triangle wave
    
    const env = Math.exp(-2.5 * (t % beatTime));
    
    // Kick drum four on the floor overlay
    const kickPos = (t % beatTime) / beatTime;
    const kickFreq = 160 * Math.exp(-35 * kickPos);
    const kick = Math.sin(2 * Math.PI * t * kickFreq) * Math.exp(-6 * kickPos);
    
    sample = tri * env * 0.5 + kick * 0.45;
  } 
  else if (trackId === '6') {
    // Golden Chill: Ultra ambient pads
    const f1 = 123.5; // B2
    const f2 = 146.8; // D3
    const f3 = 185.0; // F#3
    const f4 = 246.9; // B3
    
    const sweep1 = 0.5 + 0.5 * Math.sin(2 * Math.PI * t * 0.05);
    const sweep2 = 0.5 + 0.5 * Math.sin(2 * Math.PI * t * 0.08);
    
    const s1 = Math.sin(2 * Math.PI * t * f1) * sweep1;
    const s2 = Math.sin(2 * Math.PI * t * f2) * sweep2;
    const s3 = Math.sin(2 * Math.PI * t * f3) * (1.0 - sweep1);
    const s4 = Math.sin(2 * Math.PI * t * f4) * (1.0 - sweep2);
    
    sample = (s1 + s2 + s3 + s4) * 0.25;
  } 
  else if (trackId === 'active') {
    // Kinetic Immersion: Acid techno drive with pounding concrete kick
    const noteTime = 60 / (132 * 4); // Fast notes
    const notesIdx = Math.floor(t / noteTime);
    const pattern = [73.4, 73.4, 110.0, 73.4, 146.8, 110.0, 73.4, 220.0];
    const freq = pattern[notesIdx % pattern.length];
    
    const phase = (t * freq) % 1;
    const saw = 2 * phase - 1;
    const env = Math.exp(-5.5 * (t % noteTime));
    
    // Concrete kick drum
    const kickPeriod = 60 / 132;
    const kickPos = (t % kickPeriod) / kickPeriod;
    const kickFreq = 180 * Math.exp(-42 * kickPos);
    const kick = Math.sin(2 * Math.PI * t * kickFreq) * Math.exp(-5 * kickPos);
    
    sample = saw * env * 0.4 + kick * 0.6;
  }
  else {
    // Standard ambient synthesizer loop
    sample = Math.sin(2 * Math.PI * t * 220) * 0.3;
  }

  // Clip sample to short PCM integer
  const integerVal = Math.floor(sample * 32700);
  return Math.min(32767, Math.max(-32768, integerVal));
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Mock Database of Track Objects
  const BACKEND_TRACKS = [
    {
      id: '1',
      title: 'Synth Waves',
      artist: 'Neon Architects',
      album: 'Retro Future',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkD8Gb_XN2fN9oLEviyq9P2NfHfm1m_42B5gLi4gWQYErkLWPuGs_zlR1pet5SEiT42EcwmA5pC2UnAESlbFhVuSoWp3hnCq7qktoZ_FzzldMMaqbW6mPy9XWBIUuOrjQ2chsXZ3wafu90KvHQB7xd24UyewCcJN_pBglL8HMRo6mS0lXiTR47sAytWfCU59QjALOwGYKyUZJAipTnn7skfUQI3xMyQJv9zSkyEZ879i29SpxouWe2eQq1LLmHtN8EuAl_CgsxkA',
      albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkD8Gb_XN2fN9oLEviyq9P2NfHfm1m_42B5gLi4gWQYErkLWPuGs_zlR1pet5SEiT42EcwmA5pC2UnAESlbFhVuSoWp3hnCq7qktoZ_FzzldMMaqbW6mPy9XWBIUuOrjQ2chsXZ3wafu90KvHQB7xd24UyewCcJN_pBglL8HMRo6mS0lXiTR47sAytWfCU59QjALOwGYKyUZJAipTnn7skfUQI3xMyQJv9zSkyEZ879i29SpxouWe2eQq1LLmHtN8EuAl_CgsxkA',
      audioUrl: '/api/stream/1',
      duration: 342, // 5:42
      category: 'recently'
    },
    {
      id: '2',
      title: 'Midnight Beats',
      artist: 'Cyber Sunset',
      album: 'Dark Drive',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqiQ4Xnef34oQdQOpbtgTM7-uFolmbVn52eZ4AMBPdEQduhMoekcznS49r1v4PH9cjhuoqhDaZzDzVzRbwk91kZBy7NGzq45VM3kEAoRZ0PKz2NOnlmmuLnXRmPXD9vRqaKO4SmGjuvTuXvJiDjSccjBonYe3XuBaYLz0FYQN_SZ1THIEgXbutrKCV_pO3taX0iLl_1Nd-2Qy4YtCHC715uzmHyNSLqGSmonOtjHdKnZ7n0NY3FMA7Ukhp9BDpZlLQytROsKkIgQ',
      albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqiQ4Xnef34oQdQOpbtgTM7-uFolmbVn52eZ4AMBPdEQduhMoekcznS49r1v4PH9cjhuoqhDaZzDzVzRbwk91kZBy7NGzq45VM3kEAoRZ0PKz2NOnlmmuLnXRmPXD9vRqaKO4SmGjuvTuXvJiDjSccjBonYe3XuBaYLz0FYQN_SZ1THIEgXbutrKCV_pO3taX0iLl_1Nd-2Qy4YtCHC715uzmHyNSLqGSmonOtjHdKnZ7n0NY3FMA7Ukhp9BDpZlLQytROsKkIgQ',
      audioUrl: '/api/stream/2',
      duration: 288, // 4:48
      category: 'recently'
    },
    {
      id: '3',
      title: 'Urban Jazz',
      artist: 'The Sax Club',
      album: 'Steeltown Lounge',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjK5jX_cUWYiF4x-q9YjqczRNsh0_CACpv2ST0hERY2SGWwfe55hZ6tOyWOGhsSHrzQ9ToljZ1kfSmvQBi6ua3emDJhqgTbnq1et7JMV7VDNGLVeTi0j2UWe68Cb61oS_eXVkQ_yFk-T9eWo8T7pNOf3CRiYJxPzftT54yHHHvg0--7V8uOrvh-BKnRPl-GlDM7HKS64Zpynul0PPFFM61yb8-t1eyvZXZLiva60fL-ymy6s5UFmwmYmEebl8a0ADXdjtdICEKFQ',
      albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjK5jX_cUWYiF4x-q9YjqczRNsh0_CACpv2ST0hERY2SGWwfe55hZ6tOyWOGhsSHrzQ9ToljZ1kfSmvQBi6ua3emDJhqgTbnq1et7JMV7VDNGLVeTi0j2UWe68Cb61oS_eXVkQ_yFk-T9eWo8T7pNOf3CRiYJxPzftT54yHHHvg0--7V8uOrvh-BKnRPl-GlDM7HKS64Zpynul0PPFFM61yb8-t1eyvZXZLiva60fL-ymy6s5UFmwmYmEebl8a0ADXdjtdICEKFQ',
      audioUrl: '/api/stream/3',
      duration: 315, // 5:15
      category: 'recently'
    },
    {
      id: '4',
      title: 'Live Echoes',
      artist: 'Electric Arena',
      album: 'Underground Sound',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH2mjIlV875ZeJgR19a6P5U9rTihJSoL4IWhDBVM640uci8uPfGX3I2Kx8UB8R2nUF7IVWUkjic3b-xfhpg5W_bGxemNzZyyK9OiJbMcWyPI0uVODeyP20XK2khEcmegDTB_vGcF-aEfLY7IEVtcNNZJeZEsd2JA204Z98yVQsNvjIAD0_hEe-pbK3Qj7yW9KXZB9QJdziyGO6PoeX4eqA_5sVSZF3_Q_Bq4C7_f1fKYt6x0at--YgmScdWRQjl1lLnq-Sd0UBjg',
      albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH2mjIlV875ZeJgR19a6P5U9rTihJSoL4IWhDBVM640uci8uPfGX3I2Kx8UB8R2nUF7IVWUkjic3b-xfhpg5W_bGxemNzZyyK9OiJbMcWyPI0uVODeyP20XK2khEcmegDTB_vGcF-aEfLY7IEVtcNNZJeZEsd2JA204Z98yVQsNvjIAD0_hEe-pbK3Qj7yW9KXZB9QJdziyGO6PoeX4eqA_5sVSZF3_Q_Bq4C7_f1fKYt6x0at--YgmScdWRQjl1lLnq-Sd0UBjg',
      audioUrl: '/api/stream/4',
      duration: 412, // 6:52
      category: 'recently'
    },
    {
      id: '5',
      title: 'Pop Pulse',
      artist: 'Chart Runners',
      album: 'Frequencies',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJpZ2_kva2k4zBombgiZo_7NGa2kjAC6trLtuWLvSQMv-C0APX59uul_gn3H6H3AZeCujcDveDYTyAcwNlziSthNQo0TkG5pzFJd2bhPIgxccT2eaNlv7V0zAVQAFag9GfEAXKFeLLdj-BRgKu4Ar8ywhXStS18-Oy6IOC8BDDCDJzOhM_0UYpJCJp9hxbFzet035dBhNJrOwbro1_ydvvZAAA5ZVl7aiHlrnQlVmFVC0hJPzdHSrPmT_ITSPu5Byc-0O783fqvQ',
      albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJpZ2_kva2k4zBombgiZo_7NGa2kjAC6trLtuWLvSQMv-C0APX59uul_gn3H6H3AZeCujcDveDYTyAcwNlziSthNQo0TkG5pzFJd2bhPIgxccT2eaNlv7V0zAVQAFag9GfEAXKFeLLdj-BRgKu4Ar8ywhXStS18-Oy6IOC8BDDCDJzOhM_0UYpJCJp9hxbFzet035dBhNJrOwbro1_ydvvZAAA5ZVl7aiHlrnQlVmFVC0hJPzdHSrPmT_ITSPu5Byc-0O783fqvQ',
      audioUrl: '/api/stream/5',
      duration: 198, // 3:18
      category: 'recently'
    },
    {
      id: '6',
      title: 'Golden Chill',
      artist: 'Solar Horizon',
      album: 'Warm Winds',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUF0x2eWQSxhqVMJmnWPq3EfyKNobxU_QF90LErcuGgApdyxsRA3F_Np9nxDuKdxfLy7yLJA3hkTxJ3NVpmpIXwNcgO-t_QNpf4U_Ct_skDdvKk1xomrUsOzHebjvcmp2CI4rf7mASU9z4TCefrHBpABrh8AWuqkU504Sw4KT7MlQ-L_gmcdCyktHztUAyUNPbBwIn9BYqzc5TupfvIOXRoSDAkfHSJZ-CFmbBLKA4iIJORINVrMAmzN5doV8PISr1rniH3ynyxw',
      albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUF0x2eWQSxhqVMJmnWPq3EfyKNobxU_QF90LErcuGgApdyxsRA3F_Np9nxDuKdxfLy7yLJA3hkTxJ3NVpmpIXwNcgO-t_QNpf4U_Ct_skDdvKk1xomrUsOzHebjvcmp2CI4rf7mASU9z4TCefrHBpABrh8AWuqkU504Sw4KT7MlQ-L_gmcdCyktHztUAyUNPbBwIn9BYqzc5TupfvIOXRoSDAkfHSJZ-CFmbBLKA4iIJORINVrMAmzN5doV8PISr1rniH3ynyxw',
      audioUrl: '/api/stream/6',
      duration: 324, // 5:24
      category: 'recently'
    },
    {
      id: 'active',
      title: 'Kinetic Immersion',
      artist: 'Neural Network & Amber Neon',
      album: 'Techno Bunker Vol. 4',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxCNhrG2H4nQIgAS22CTe7yV1qiJhk6eZJ36hYjzu7zknQRW-pODzfWTjfKHv3Oy8fgawBTqCx-2hLLnwrdyCtVMkY6aWL_heJ16hjtT8cqGDgOdt-a1r4A2A6Tl054wmBg_ZgmtoK2Gv9pCSUdvOI0vt7EdEtmp8RNEVUTSRuO6_cEFLfv_-jwJTnsyheLrFkmERnuPNbEAjZ2tufwvVG0PIKpHme_cQszBcfPlnDU6u8gBpTLe6KQSr2kKAr4r_vwM1Mly2ZeA',
      albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxCNhrG2H4nQIgAS22CTe7yV1qiJhk6eZJ36hYjzu7zknQRW-pODzfWTjfKHv3Oy8fgawBTqCx-2hLLnwrdyCtVMkY6aWL_heJ16hjtT8cqGDgOdt-a1r4A2A6Tl054wmBg_ZgmtoK2Gv9pCSUdvOI0vt7EdEtmp8RNEVUTSRuO6_cEFLfv_-jwJTnsyheLrFkmERnuPNbEAjZ2tufwvVG0PIKpHme_cQszBcfPlnDU6u8gBpTLe6KQSr2kKAr4r_vwM1Mly2ZeA',
      audioUrl: '/api/stream/active',
      duration: 342, // 5:42
      category: 'mix'
    }
  ];

  // API Route: Fetch clean mock tracks
  app.get('/api/tracks', (req, res) => {
    const dynamicTracks = [...BACKEND_TRACKS];
    const songsDir = path.join(process.cwd(), 'backend', 'songs');

    // Dynamically scan the folder and add actual files to the track list!
    if (fs.existsSync(songsDir)) {
      try {
        const files = fs.readdirSync(songsDir);
        let localId = 1000;
        for (const file of files) {
          if (file.toLowerCase().endsWith('.mp3') || file.toLowerCase().endsWith('.wav')) {
            const title = path.parse(file).name;
            const exists = BACKEND_TRACKS.find(t => t.id === title || t.title === title);
            
            if (!exists) {
              const newId = `local-${localId++}`;
              dynamicTracks.unshift({
                id: newId,
                title: title,
                artist: 'Local Audio File',
                album: 'backend/songs',
                imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj5Um8wlRj6Wkyj9S8KL7dZ92txitEgJcc_qdNmuQSHI6md22H3U9VMcFZAa6iAtXISFL7FubeSWRIi7leKNbfb9GqBKgUPQnuhc3jngQkVV7UUCrGWFG0EckiABu5dRcWWBFGxCveMlEviUCvIC1eimhL0sdG7ddTWyOKXn-OJaVbqel6W8Hp3aIw0tvcmn_0blDzmPAz686TZt4TWoPhGDzN30CWHv8ZAtJEEPexsBnbKdpxhPQhmCdjGFJZNn8y3XKBvFjrpQ',
                albumArtUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj5Um8wlRj6Wkyj9S8KL7dZ92txitEgJcc_qdNmuQSHI6md22H3U9VMcFZAa6iAtXISFL7FubeSWRIi7leKNbfb9GqBKgUPQnuhc3jngQkVV7UUCrGWFG0EckiABu5dRcWWBFGxCveMlEviUCvIC1eimhL0sdG7ddTWyOKXn-OJaVbqel6W8Hp3aIw0tvcmn_0blDzmPAz686TZt4TWoPhGDzN30CWHv8ZAtJEEPexsBnbKdpxhPQhmCdjGFJZNn8y3XKBvFjrpQ',
                audioUrl: `/api/stream/${newId}?file=${encodeURIComponent(file)}`,
                duration: 210, // Default display duration
                category: 'recently' as any
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to read songs directory:", err);
      }
    }
    
    res.json(dynamicTracks);
  });

  // API Route: High-Fidelity Audio Streaming engine with complete Range Request Support
  app.get('/api/stream/:trackId', (req, res) => {
    const trackId = req.params.trackId;
    const requestedFile = req.query.file as string;
    const track = BACKEND_TRACKS.find(t => t.id === trackId) || BACKEND_TRACKS[0];
    
    // Check if the song exists in the local backend/songs folder
    const songsDir = path.join(process.cwd(), 'backend', 'songs');
    
    // Look for supported file names (e.g. 1.mp3, 1.wav, or by track title)
    const possibleFiles = [
      path.join(songsDir, `${trackId}.mp3`),
      path.join(songsDir, `${trackId}.wav`),
      path.join(songsDir, `${track.title}.mp3`),
      path.join(songsDir, `${track.title}.wav`)
    ];

    // If a specific file was requested from the dynamic scanner, prioritize it!
    if (requestedFile) {
      // Use path.basename to ensure safe path generation 
      possibleFiles.unshift(path.join(songsDir, path.basename(requestedFile)));
    }

    for (const file of possibleFiles) {
      if (fs.existsSync(file)) {
        // Express res.sendFile automatically handles HTTP Range requests for seamless audio streaming/scrubbing
        res.sendFile(file);
        return;
      }
    }

    // Low footprint configuration
    const S_RATE = 22050; // High-res synthesis standard
    const duration = track.duration;
    const numSamples = S_RATE * duration;
    const subChunk2Size = numSamples * 2; // 16-bit PCM = 2 bytes per sample
    const fileSize = 36 + subChunk2Size;

    // Build the structural 44-byte WAV header in-place
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(fileSize, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size (16 bytes PCM)
    header.writeUInt16LE(1, 20); // AudioFormat: Numeric PCM
    header.writeUInt16LE(1, 22); // NumChannels: Mono
    header.writeUInt32LE(S_RATE, 24); // SampleRate
    header.writeUInt32LE(S_RATE * 2, 28); // ByteRate (SampleRate * 2)
    header.writeUInt16LE(2, 32); // BlockAlign (NumChannels * BitsPerSample / 8)
    header.writeUInt16LE(16, 34); // BitsPerSample: 16-bit
    header.write('data', 36);
    header.writeUInt32LE(subChunk2Size, 40);

    const totalBytes = 44 + subChunk2Size;

    // Detect and handle HTTP Range requests for instant scrubbing and zero latency seeking
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalBytes - 1;

      if (start >= totalBytes || end >= totalBytes) {
        res.status(416).send("Requested Range Not Satisfiable");
        return;
      }

      const chunksize = (end - start) + 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${totalBytes}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/wav",
      });

      // Construct segment response buffer
      const chunkBuffer = Buffer.alloc(chunksize);
      for (let i = 0; i < chunksize; i++) {
        const bytePos = start + i;
        if (bytePos < 44) {
          chunkBuffer[i] = header[bytePos];
        } else {
          const sampleByteIndex = bytePos - 44;
          const sampleIdx = Math.floor(sampleByteIndex / 2);
          const isHighByte = sampleByteIndex % 2 === 1;
          const sampleVal = getSampleForTrack(trackId, sampleIdx, S_RATE);
          
          if (isHighByte) {
            chunkBuffer[i] = (sampleVal >> 8) & 0xFF;
          } else {
            chunkBuffer[i] = sampleVal & 0xFF;
          }
        }
      }
      res.end(chunkBuffer);
    } else {
      // Direct whole-file request
      res.writeHead(200, {
        "Content-Length": totalBytes,
        "Content-Type": "audio/wav",
        "Accept-Ranges": "bytes",
      });

      res.write(header);

      // Stream generated audio segments sequentially to keep heap footprint negligible
      const chunkSize = 16384 * 2; // 16K samples chunk size
      const tempBuf = Buffer.alloc(chunkSize);
      let sampleIdx = 0;

      while (sampleIdx < numSamples) {
        const remainingBytes = (numSamples - sampleIdx) * 2;
        const currentBytes = Math.min(chunkSize, remainingBytes);
        const currentSamples = currentBytes / 2;

        for (let i = 0; i < currentSamples; i++) {
          const val = getSampleForTrack(trackId, sampleIdx + i, S_RATE);
          tempBuf[i * 2] = val & 0xFF;
          tempBuf[i * 2 + 1] = (val >> 8) & 0xFF;
        }

        const chunkToWrite = Buffer.alloc(currentBytes);
        tempBuf.copy(chunkToWrite, 0, 0, currentBytes);
        res.write(chunkToWrite);
        
        sampleIdx += currentSamples;
      }
      res.end();
    }
  });

  // Setup Vite asset pipeline serving middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FinFy Server] Running locally on port ${PORT}`);
  });
}

startServer();
