import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

const STATIONS = [
  { id: 1, name: 'Saluran Satu', url: 'https://live.almanshuroh.workers.dev/radio1', metaUrl: 'https://live.almanshuroh.workers.dev/meta1' },
  { id: 2, name: 'Saluran Dua', url: 'https://live.almanshuroh.workers.dev/radio2', metaUrl: 'https://live.almanshuroh.workers.dev/meta2' }
];
const RadioPlayer = () => {
  const [currentStation, setCurrentStation] = useState(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState("Memuat Judul...");
  const [timeLeft, setTimeLeft] = useState(null);
  const [volume, setVolume] = useState(0.8); // Default volume 80%
  const playerRef = useRef(null);
  const timerRef = useRef(null);

  // Ambil Metadata
  const fetchMetadata = async () => {
    try {
      const res = await fetch(`${currentStation.metaUrl}?t=${Date.now()}`);
      const data = await res.json();
      setSongTitle(data.title || currentStation.name);
    } catch (err) {
      setSongTitle(currentStation.name);
    }
  };

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 20000);
    return () => clearInterval(interval);
  }, [currentStation]);

  // Logika Sleep Timer
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 60000);
    } else if (timeLeft === 0) {
      stopRadio();
      setTimeLeft(null);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const stopRadio = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.unload();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopRadio();
    } else {
      playerRef.current = new Howl({
        src: [currentStation.url],
        html5: true,
        volume: volume,
        format: ['mp3', 'aac']
      });
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  // Update Volume saat slider digeser
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.volume(newVol);
    }
  };

  const shareToWhatsApp = () => {
    const message = `📢 Yuk simak :
  *${currentStation.name}* \nJudul: ${songTitle}\nLink: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Indikator Sinyal */}
        <div style={styles.signalContainer}>
          <div style={{ ...styles.signalDot, backgroundColor: songTitle === "OFFLINE" ? '#ff4d4d' : (isPlaying ? '#00ff00' : '#ccc') }}></div>
          <span style={styles.statusText}>
            {songTitle === "OFFLINE" ? 'OFFLINE' : (isPlaying ? 'LIVE STREAMING' : 'READY')}
          </span>
        </div>

        {/* Judul Lagu Running Text */}
<div style={styles.marqueeContainer}>
  <div style={{ 
    ...styles.marquee, 
    animationPlayState: isPlaying ? 'running' : 'paused' 
  }}>
    {isPlaying 
      ? (songTitle === "OFFLINE" ? "⚠️ SIARAN OFFLINE / ISTIRAHAT" : `SEDANG DIPUTAR: ${songTitle}`)
      : `TEKAN PLAY UNTUK MENDENGARKAN`}
  </div>
</div>

        <div style={styles.stationName}>{currentStation.name}</div>

        {/* Pilihan Saluran */}
        <div style={styles.buttonGroup}>
          {STATIONS.map(s => (
            <button 
              key={s.id}
              onClick={() => { stopRadio(); setCurrentStation(s); }}
              style={{...styles.stationBtn, backgroundColor: currentStation.id === s.id ? '#333' : '#e0e0e0', color: currentStation.id === s.id ? '#fff' : '#333'}}
            >
              📻 SALURAN {s.id}
            </button>
          ))}
        </div>

        {/* Tombol Play */}
        <button onClick={togglePlay} style={styles.playBtn}>
          {isPlaying ? '■ STOP RADIO' : '▶ PLAY RADIO'}
        </button>

        {/* Slider Volume */}
        <div style={styles.volumeContainer}>
          <span style={{fontSize: '12px'}}>🔈</span>
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={volume} onChange={handleVolumeChange} 
            style={styles.volumeSlider} 
          />
          <span style={{fontSize: '12px'}}>🔊</span>
        </div>

        <button onClick={shareToWhatsApp} style={styles.shareBtn}>
          💬 Bagikan ke WhatsApp
        </button>

        {/* Sleep Timer */}
        <div style={styles.timerSection}>
          <div style={styles.subTitle}>SLEEP TIMER {timeLeft && `(${timeLeft}m)`}</div>
          <div style={styles.timerGrid}>
            {[15, 30, 60, 0].map(m => (
              <button key={m} onClick={() => setTimeLeft(m === 0 ? null : m)} style={styles.timerBtn}>
                {m === 0 ? 'Off' : `${m}m`}
              </button>
            ))}
          </div>
        </div>

        {/* List Jadwal */}
        <div style={styles.scheduleSection}>
          <div style={styles.subTitle}>SIARAN KAJIAN HARI INI</div>
          <div style={styles.scheduleList}>
            <div style={styles.scheduleItem}><span>05:15 WIB</span><span>KAJIAN BERSERI</span></div>
            <div style={styles.scheduleItem}><span>06:15 WIB</span><span>SAJIAN UNTUK ANAK</span></div>
            <div style={styles.scheduleItem}><span>08:00 WIB</span><span>TAUSIYAH</span></div>
            <div style={styles.scheduleItem}><span>09:00 WIB</span><span>KAJIAN TEMATIK I</span></div>
            <div style={styles.scheduleItem}><span>10:15 WIB</span><span>KAJIAN TEMATIK II</span></div>
            <div style={styles.scheduleItem}><span>18:15 WIB</span><span>KAJIAN DARI MASJID (LIVE)</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    minHeight: '100dvh', backgroundColor: '#ffffff', padding: '20px' // Latar belakang putih bersih
  },
  card: { 
    background: 'linear-gradient(180deg, #818181, #cacaca)', // Silver yang lebih teduh (matte)
    padding: '25px', borderRadius: '25px', width: '100%', maxWidth: '350px', 
    boxShadow: '10px 10px 30px #d1d1d1, -10px -10px 30px #f0f0f0',
    display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#333'
  },
  signalContainer: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' },
  signalDot: { width: '8px', height: '8px', borderRadius: '50%' },
  statusText: { fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' 
  },
  marqueeContainer: { 
    width: '100%', 
    overflow: 'hidden', 
    whiteSpace: 'nowrap', 
    background: '#1a1a1a', 
    color: '#00ff00', 
    padding: '12px 0', 
    borderRadius: '10px', 
    marginBottom: '15px',
    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.5)',
    // Pastikan tidak ada display: flex di sini agar teks tidak melebar
    position: 'relative' 
  },
  marquee: { 
    display: 'inline-block', 
    paddingLeft: '100%', 
    animation: 'marquee 15s linear infinite', 
    fontSize: '15px', 
    fontWeight: 'bold',
    // Tambahkan ini untuk memastikan teks tidak turun ke bawah
    whiteSpace: 'nowrap'
  },
  stationName: { fontSize: '15px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' },
  buttonGroup: { display: 'flex', gap: '8px', width: '100%', marginBottom: '15px' },
  stationBtn: { flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  playBtn: { 
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none', 
    background: '#333', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px'
  },
  volumeContainer: { display: 'flex', alignItems: 'center', width: '100%', gap: '10px', marginBottom: '15px' },
  volumeSlider: { flex: 1, cursor: 'pointer', accentColor: '#333' },
  shareBtn: { 
    width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #25D366', 
    color: '#075E54', background: 'transparent', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' 
  },
  timerSection: { width: '100%', borderTop: '1px solid #bbb', paddingTop: '10px', marginBottom: '15px' },
  timerGrid: { display: 'flex', gap: '5px' },
  timerBtn: { flex: 1, padding: '6px', borderRadius: '5px', border: 'none', background: '#ccc', color: '#333', fontSize: '11px', cursor: 'pointer' },
  subTitle: { fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', width: '100%', color: '#555' },
  scheduleSection: { width: '100%', borderTop: '1px solid #bbb', paddingTop: '10px' },
  scheduleList: { display: 'flex', flexDirection: 'column', gap: '5px' },
  scheduleItem: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '7px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px' }
};

export default RadioPlayer;