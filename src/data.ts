import { Track, Podcast, Playlist } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Synth Waves',
    artist: 'Neon Architects',
    album: 'Retro Future',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkD8Gb_XN2fN9oLEviyq9P2NfHfm1m_42B5gLi4gWQYErkLWPuGs_zlR1pet5SEiT42EcwmA5pC2UnAESlbFhVuSoWp3hnCq7qktoZ_FzzldMMaqbW6mPy9XWBIUuOrjQ2chsXZ3wafu90KvHQB7xd24UyewCcJN_pBglL8HMRo6mS0lXiTR47sAytWfCU59QjALOwGYKyUZJAipTnn7skfUQI3xMyQJv9zSkyEZ879i29SpxouWe2eQq1LLmHtN8EuAl_CgsxkA',
    duration: 342, // 5:42
    category: 'recently',
    synthConfig: {
      baseFreq: 110, // A2
      type: 'sawtooth',
      tempo: 120,
      notes: [110, 137.5, 165, 220, 275, 330, 440, 330] // Major arpeggio
    }
  },
  {
    id: '2',
    title: 'Midnight Beats',
    artist: 'Cyber Sunset',
    album: 'Dark Drive',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqiQ4Xnef34oQdQOpbtgTM7-uFolmbVn52eZ4AMBPdEQduhMoekcznS49r1v4PH9cjhuoqhDaZzDzVzRbwk91kZBy7NGzq45VM3kEAoRZ0PKz2NOnlmmuLnXRmPXD9vRqaKO4SmGjuvTuXvJiDjSccjBonYe3XuBaYLz0FYQN_SZ1THIEgXbutrKCV_pO3taX0iLl_1Nd-2Qy4YtCHC715uzmHyNSLqGSmonOtjHdKnZ7n0NY3FMA7Ukhp9BDpZlLQytROsKkIgQ',
    duration: 288,
    category: 'recently',
    synthConfig: {
      baseFreq: 98, // G2
      type: 'triangle',
      tempo: 110,
      notes: [98, 116.5, 146.8, 196, 233, 293.7, 392, 293.7] // Minor triad
    }
  },
  {
    id: '3',
    title: 'Urban Jazz',
    artist: 'The Sax Club',
    album: 'Steeltown Lounge',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjK5jX_cUWYiF4x-q9YjqczRNsh0_CACpv2ST0hERY2SGWwfe55hZ6tOyWOGhsSHrzQ9ToljZ1kfSmvQBi6ua3emDJhqgTbnq1et7JMV7VDNGLVeTi0j2UWe68Cb61oS_eXVkQ_yFk-T9eWo8T7pNOf3CRiYJxPzftT54yHHHvg0--7V8uOrvh-BKnRPl-GlDM7HKS64Zpynul0PPFFM61yb8-t1eyvZXZLiva60fL-ymy6s5UFmwmYmEebl8a0ADXdjtdICEKFQ',
    duration: 315,
    category: 'recently',
    synthConfig: {
      baseFreq: 130.8, // C3
      type: 'sine',
      tempo: 90,
      notes: [130.8, 164.8, 196, 246.9, 261.6, 329.6, 392, 493.9] // Major 7th chord
    }
  },
  {
    id: '4',
    title: 'Live Echoes',
    artist: 'Electric Arena',
    album: 'Underground Sound',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH2mjIlV875ZeJgR19a6P5U9rTihJSoL4IWhDBVM640uci8uPfGX3I2Kx8UB8R2nUF7IVWUkjic3b-xfhpg5W_bGxemNzZyyK9OiJbMcWyPI0uVODeyP20XK2khEcmegDTB_vGcF-aEfLY7IEVtcNNZJeZEsd2JA204Z98yVQsNvjIAD0_hEe-pbK3Qj7yW9KXZB9QJdziyGO6PoeX4eqA_5sVSZF3_Q_Bq4C7_f1fKYt6x0at--YgmScdWRQjl1lLnq-Sd0UBjg',
    duration: 412,
    category: 'recently',
    synthConfig: {
      baseFreq: 87.3, // F2
      type: 'square',
      tempo: 125,
      notes: [87.3, 104.8, 130.8, 174.6, 209.6, 261.6, 349.2, 261.6] // Fsus2/sus4 feel
    }
  },
  {
    id: '5',
    title: 'Pop Pulse',
    artist: 'Chart Runners',
    album: 'Frequencies',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJpZ2_kva2k4zBombgiZo_7NGa2kjAC6trLtuWLvSQMv-C0APX59uul_gn3H6H3AZeCujcDveDYTyAcwNlziSthNQo0TkG5pzFJd2bhPIgxccT2eaNlv7V0zAVQAFag9GfEAXKFeLLdj-BRgKu4Ar8ywhXStS18-Oy6IOC8BDDCDJzOhM_0UYpJCJp9hxbFzet035dBhNJrOwbro1_ydvvZAAA5ZVl7aiHlrnQlVmFVC0hJPzdHSrPmT_ITSPu5Byc-0O783fqvQ',
    duration: 198,
    category: 'recently',
    synthConfig: {
      baseFreq: 146.8, // D3
      type: 'triangle',
      tempo: 128,
      notes: [146.8, 185, 220, 293.7, 370, 440, 587.3, 440] // D Major energizing
    }
  },
  {
    id: '6',
    title: 'Golden Chill',
    artist: 'Solar Horizon',
    album: 'Warm Winds',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUF0x2eWQSxhqVMJmnWPq3EfyKNobxU_QF90LErcuGgApdyxsRA3F_Np9nxDuKdxfLy7yLJA3hkTxJ3NVpmpIXwNcgO-t_QNpf4U_Ct_skDdvKk1xomrUsOzHebjvcmp2CI4rf7mASU9z4TCefrHBpABrh8AWuqkU504Sw4KT7MlQ-L_gmcdCyktHztUAyUNPbBwIn9BYqzc5TupfvIOXRoSDAkfHSJZ-CFmbBLKA4iIJORINVrMAmzN5doV8PISr1rniH3ynyxw',
    duration: 324,
    category: 'recently',
    synthConfig: {
      baseFreq: 123.5, // B2
      type: 'sine',
      tempo: 75,
      notes: [123.5, 146.8, 164.8, 185, 246.9, 293.7, 329.6, 370] // B Minor pentatonic - very atmospheric
    }
  },
  {
    id: 'active',
    title: 'Kinetic Immersion',
    artist: 'Neural Network & Amber Neon',
    album: 'Techno Bunker Vol. 4',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxCNhrG2H4nQIgAS22CTe7yV1qiJhk6eZJ36hYjzu7zknQRW-pODzfWTjfKHv3Oy8fgawBTqCx-2hLLnwrdyCtVMkY6aWL_heJ16hjtT8cqGDgOdt-a1r4A2A6Tl054wmBg_ZgmtoK2Gv9pCSUdvOI0vt7EdEtmp8RNEVUTSRuO6_cEFLfv_-jwJTnsyheLrFkmERnuPNbEAjZ2tufwvVG0PIKpHme_cQszBcfPlnDU6u8gBpTLe6KQSr2kKAr4r_vwM1Mly2ZeA',
    duration: 342, // 5:42
    category: 'mix',
    synthConfig: {
      baseFreq: 73.4, // D2 - deep bass
      type: 'sawtooth',
      tempo: 132, // high energy
      notes: [73.4, 73.4, 110, 73.4, 146.8, 110, 73.4, 220] // Acid bass pulse
    }
  }
];

export const PODCASTS: Podcast[] = [
  {
    id: 'pod-1',
    title: 'The Future of AI Music',
    publisher: 'Technology',
    category: 'Technology',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSvn8s5Qo4x0dFoPFKCr0DYg5VwCMeGoKsiWo3bV3pRvMa4G-H2Tv2ZJJGhzemKIwg0mxRUQzK0WiGIovfbZXivy5hgr69kOcpXu0L-XYnfhoYhmHHMo7D1gF64te5i1mhIY6gpUS2BZs4C6S1kQkr34ypwrfw2Mn38BQywdwqze1-g4RNkrPQsyojIFupDb_cNQw2Ss4dmK__cE8m5XhZg0U7qoDYlCkV1TSy28p6nVNJRhIYGvM8pdEHxE_u59YiHUX4SqebGQ',
    description: 'Exploring how generative models are reshaping the acoustic landscape and empowering artists of tomorrow.',
    durationMinutes: 42
  },
  {
    id: 'pod-2',
    title: 'Vinyl Resurgence',
    publisher: 'Culture',
    category: 'Culture',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxzGf-3ynsiSRLk9FIMyBx5EVkrEb7A8MmjwL0vA2RJE_c_ZfZs3zdPk6418uTxSoxX2IoW4wEdLjFVxLcAdsJv1dMfVdEglp1MqrVXV8GNKWxdIDcDA3jxgGS_yUR4xGMho1YcNbJX2QgqT0A2YpU8zxMR0xTOwLOmjAKHTFW0QeUJRo5yjJX69yaycFBex3ARDL9w1uQ038k2SMgUPzXtqiPPWOjJqXLuSb-82WxpX2czSQf_50GJ7aURD4kJZ-i0VnloSX6OA',
    description: 'Why analog formats are dominating the digital era of listeners, diving into physical manufacturing and historical roots.',
    durationMinutes: 58
  },
  {
    id: 'pod-3',
    title: 'Cyberpunk Soundscapes',
    publisher: 'Arts & Media',
    category: 'Culture',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqiQ4Xnef34oQdQOpbtgTM7-uFolmbVn52eZ4AMBPdEQduhMoekcznS49r1v4PH9cjhuoqhDaZzDzVzRbwk91kZBy7NGzq45VM3kEAoRZ0PKz2NOnlmmuLnXRmPXD9vRqaKO4SmGjuvTuXvJiDjSccjBonYe3XuBaYLz0FYQN_SZ1THIEgXbutrKCV_pO3taX0iLl_1Nd-2Qy4YtCHC715uzmHyNSLqGSmonOtjHdKnZ7n0NY3FMA7Ukhp9BDpZlLQytROsKkIgQ',
    description: 'How blade-runner synths and industrial sound effects established an entire subgenre of atmospheric immersion.',
    durationMinutes: 35
  }
];

export const PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-liked',
    name: 'Liked Songs',
    description: '428 tracks',
    type: 'liked',
    tracksCount: 428,
    tracks: [
      TRACKS[0], TRACKS[1], TRACKS[6], TRACKS[2], TRACKS[3]
    ]
  },
  {
    id: 'playlist-mix-1',
    name: 'Daily Mix 1',
    description: 'Made for Jerfin',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvrXDDWBJttR1q_uj0gJ_r2iionfOBlvy5MF_ocVpTk-OSMGnrc5A3Qy-OKsVUJx6spxUeT6gfvUvJqlvyuoDp9kyfqn9RhwRixQe0E6pWfAk13spLueyfh-bydV0CriuhbqR59qUFGSt3-giZ7Y50n3SxSoimtZ1-dr5kRkcv3GbNXdCxlvno9004SBVKo9o-AKnLkDhagqPdxK_KeJKNONvlZ5-MFhV7JIT2cICcJZ_Tn2QY0ZEJTAoHKgNUCL6INw1wRV_sAQ',
    type: 'mix',
    tracks: [
      TRACKS[6], TRACKS[1], TRACKS[4], TRACKS[5]
    ]
  },
  {
    id: 'playlist-weekly',
    name: 'Discover Weekly',
    description: 'New music for you',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL5ryklEVA-KBjK4FMRRxbQ8RZRbpU9bhjp9055prbgDuXxBSz2HlzoZwLLffsf6iOR6wESpZFfMg9_5AGyzSmGgvozddgFioRB9g0MsVeB0uioSD-LzgS3U3qOw7kdcCFpuf3CsHn7MeQHm4rgaFVozk5V5vWZo7ZdCf9qq9u8GBZiINd-FcUB5ewNLOO3x8-AyL9fQM7XK7ZTtt3wo3TE7d2fcVH_1KBTwS6AkBF0Vp8f-sHh26ztFVHY0hxlPm-EmLBQ-jaA',
    type: 'weekly',
    tracks: [
      TRACKS[2], TRACKS[3], TRACKS[5], TRACKS[0], TRACKS[1]
    ]
  }
];
