import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

const STATIONS = [
  { id: 1, name: 'Saluran 1', url: '/stream-satu' },
  { id: 2, name: 'Saluran 2', url: '/stream-dua' }
];

const RadioPlayer = () => {
  const [currentStation, setCurrentStation] = useState(STATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const player = useRef(null);

  // Fungsi untuk membersihkan player lama
  const stopPlayer = () => {
    if (player.current) {
      player.current.unload();
      player.current = null;
    }
  };

  const playRadio = (station) => {
    stopPlayer();
    setIsLoading(true);

    player.current = new Howl({
      src: [station.url],
      html5: true,
      format: ['aac'],
      onloaderror: (id, err) => {
       console.error("Load Error:", err);
       setIsLoading(false);
      },
    onplayerror: (id, err) => {
      console.error("Play Error:", err);
    // Jika gagal play, coba paksa lewat HTML5 element langsung
      player.current.once('unlock', () => {
      player.current.play();
    });
  }
});

    player.current = new Howl({
      src: [station.url],
      html5: true,
      format: ['aac'],
      pool: 5, // Tambahkan ini untuk manajemen memori di mobile
      html5PoolSize: 10 // Menambah jatah buffer HTML5 di HP
    });

    player.current = new Howl({
      src: [station.url],
      html5: true, // WAJIB untuk HE-AAC stream agar tidak putus di background
      format: ['aac'],
      onload: () => {
        setIsLoading(false);
        player.current.play();
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onloaderror: (id, err) => {
        console.error("Gagal memuat audio:", err);
        setIsLoading(false);
        alert("Gagal memuat saluran. Mungkin server sedang offline atau periksa koneksi internet Anda.");
      }
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      player.current.pause();
    } else {
      if (!player.current) {
        playRadio(currentStation);
      } else {
        player.current.play();
      }
    }
  };

  const switchStation = (station) => {
    setCurrentStation(station);
    playRadio(station);
  };

  // Bersihkan memory saat aplikasi ditutup
  useEffect(() => {
    return () => stopPlayer();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>📻 Al-Manshuroh Cilacap</h3>
        <p>Radio: <strong>{currentStation.name}</strong></p>
        
        <div style={styles.buttonGroup}>
          {STATIONS.map((s) => (
            <button 
              key={s.id} 
              onClick={() => switchStation(s)}
              style={{...styles.stationBtn, backgroundColor: currentStation.id === s.id ? '#007bff' : '#444'}}
            >
              {s.name}
            </button>
          ))}
        </div>

        <button onClick={togglePlay} disabled={isLoading} style={styles.playBtn}>
          {isLoading ? 'MEMUAT...' : isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </div>
    </div>
  );
};

// CSS-in-JS sederhana agar tampilan rapi di HP
const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  card: { background: '#222', color: '#fff', padding: '30px', borderRadius: '15px', textAlign: 'center', width: '100%', maxWidth: '400px' },
  buttonGroup: { display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' },
  stationBtn: { padding: '10px', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer', fontSize: '12px' },
  playBtn: { width: '100%', padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }
};

export default RadioPlayer;