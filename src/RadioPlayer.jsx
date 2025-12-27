import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

const STATIONS = [
  { id: 1, name: 'Saluran-1', url: '/stream-satu' },
  { id: 2, name: 'Saluran-2', url: '/stream-dua' }
];
const SCHEDULE = [
  { time: '05:15 - 06:00', activity: 'Kajian Pagi diputar ulang 13:30 - 14:15' },
  { time: '08:00 - 08:45', activity: 'Tausiyah diputar ulang 16:45 - 17:30' },
  { time: '09:00 - 09:50', activity: 'Kajian Ilmiah diputar ulang 21:10 - 21:50' },
  { time: '10:10 - 11:15', activity: 'Kajian Ilmiah 2 diputar ulang 19:50 - 21:00' },
  { time: '18:00 - 19:00', activity: 'Kajian Langsung' }
  ];
const RadioPlayer = () => {
  const [currentStation, setCurrentStation] = useState(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Sedia');
  const [timeLeft, setTimeLeft] = useState(0); // Dalam minit
  const player = useRef(null);
  const timerRef = useRef(null);

  // Fungsi Sleep Timer
  useEffect(() => {
    if (timeLeft > 0 && isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopPlayer();
            setIsPlaying(false);
            setStatus('Tamat (Timer)');
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Tolak 1 minit setiap 60 saat
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isPlaying]);

  const stopPlayer = () => {
    if (player.current) {
      player.current.unload();
      player.current = null;
    }
  };

  const playRadio = (station) => {
    stopPlayer();
    setIsLoading(true);
    setStatus('Menghubung...');

    player.current = new Howl({
      src: [station.url],
      html5: true,
      format: ['aac'],
      onload: () => {
        setIsLoading(false);
        setStatus('Stabil');
        player.current.play();
      },
      onplay: () => {
        setIsPlaying(true);
        setStatus('Online');
      },
      onpause: () => {
        setIsPlaying(false);
        setStatus('Berhenti');
      },
      onloaderror: () => {
        setStatus('Mungkin sedang Offline');
        handleReconnect(station);
      }
    });
  };

  const handleReconnect = (station) => {
    setTimeout(() => {
      if (!isPlaying) playRadio(station);
    }, 3000);
  };

const shareToWhatsApp = () => {
  const message = `Ayo simak *${currentStation.name}* melalui aplikasi radio streaming Al-Manshroh Cilacap. Sedang siaran live sekarang! 📻\n\nLink: ${window.location.href}`;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Indikator Isyarat */}
        <div style={styles.signalContainer}>
          <span style={{ 
            ...styles.signalDot, 
            backgroundColor: status === 'Live' ? '#2ecc71' : status === 'Menghubung...' ? '#f1c40f' : '#e74c3c' 
          }}></span>
          <span style={styles.statusText}>{status} {timeLeft > 0 ? `(${timeLeft}m)` : ''}</span>
        </div>

        {/* Running Text */}
        <div style={styles.marqueeContainer}>
          <div style={isPlaying ? styles.marquee : { ...styles.marquee, animationPlayState: 'paused' }}>
            {currentStation.name} - Radio Streaming Al-Manshuroh Cilacap - {currentStation.name}
          </div>
        </div>
        
        {/* Pemilihan Saluran */}
        <div style={styles.buttonGroup}>
          {STATIONS.map((s) => (
            <button 
              key={s.id} 
              onClick={() => { setCurrentStation(s); playRadio(s); }}
              style={{...styles.stationBtn, border: currentStation.id === s.id ? '2px solid #007bff' : '2px solid transparent'}}
            >
              CH {s.id}
            </button>
          ))}
        </div>

        {/* Butang Kawalan Utama */}
        <button onClick={() => isPlaying ? player.current.pause() : playRadio(currentStation)} disabled={isLoading} style={styles.playBtn}>
          {isLoading ? 'MEMUAT...' : isPlaying ? 'STOP' : 'PLAY'}
        </button>

{/* Tombol Share WhatsApp */}
<button onClick={shareToWhatsApp} style={styles.shareBtn}>
  <span style={{ marginRight: '8px' }}>💬</span> Bagikan ke WhatsApp
</button>

        {/* Sleep Timer Selector */}
        <div style={styles.timerSection}>
          <p style={{ fontSize: '11px', marginBottom: '5px' }}>Pemasa Tidur (Menit):</p>
          <div style={styles.timerButtons}>
            {[15, 30, 60, 0].map((m) => (
              <button key={m} onClick={() => setTimeLeft(m)} style={styles.timerBtn}>
                {m === 0 ? 'Off' : m}
              </button>
            ))}
          </div>
        </div>
       
        <div style={styles.scheduleSection}>
          <p style={styles.scheduleTitle}>📅 Jadual Acara Kajian Hari Ini</p>
          <div style={styles.scheduleList}>
          {SCHEDULE.map((item, index) => (
          <div key={index} style={styles.scheduleItem}>
          <span style={styles.scheduleTime}>{item.time}</span>
          <span style={styles.scheduleActivity}>{item.activity}</span>
        </div>
      ))}
     </div>
   </div>


      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '10px' },
  card: { background: '#1a1a1a', color: '#fff', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  signalContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', gap: '8px' },
  signalDot: { width: '10px', height: '10px', borderRadius: '50%' },
  statusText: { fontSize: '12px', fontWeight: 'bold' },
  marqueeContainer: { overflow: 'hidden', whiteSpace: 'nowrap', background: '#000', padding: '10px', borderRadius: '10px', marginBottom: '20px' },
  marquee: { display: 'inline-block', paddingLeft: '100%', animation: 'marquee 15s linear infinite', fontWeight: 'bold', color: '#007bff' },
  buttonGroup: { display: 'flex', gap: '10px', marginBottom: '20px' },
  stationBtn: { flex: 1, padding: '10px', borderRadius: '8px', background: '#333', color: '#fff', cursor: 'pointer' },
  playBtn: { width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#007bff', color: '#fff', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
  timerSection: { borderTop: '1px solid #333', paddingTop: '15px' },
  timerButtons: { display: 'flex', justifyContent: 'space-between', gap: '5px' },
  timerBtn: { flex: 1, background: '#444', border: 'none', color: '#fff', borderRadius: '5px', padding: '5px', fontSize: '12px', cursor: 'pointer' },
  
  shareBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #25D366', // Warna khas WhatsApp
    backgroundColor: 'transparent',
    color: '#25D366',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: '0.3s'
  },
  


scheduleSection: {
    marginTop: '20px',
    borderTop: '1px solid #333',
    paddingTop: '15px',
    textAlign: 'left'
  },
  scheduleTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '10px'
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '150px', 
    overflowY: 'auto',   
    paddingRight: '5px'
  },
  scheduleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    background: '#222',
    padding: '8px',
    borderRadius: '5px',
    borderLeft: '3px solid #007bff'
  },
  scheduleTime: {
    color: '#aaa',
    fontWeight: 'bold',
    marginRight: '10px'
  },
  scheduleActivity: {
    color: '#fff',
    textAlign: 'right'
  }
};

export default RadioPlayer;