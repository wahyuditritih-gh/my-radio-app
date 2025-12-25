import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Radio, Volume2 } from 'lucide-react';

const STREAMS = [
  { id: 'port1', name: 'Saluran Utama', url: 'https://cilacap.radioislam.my.id:11162/stream' },
  { id: 'port2', name: 'Saluran Dua', url: 'https://cilacap.radioislam.my.id:11606/stream' }
];

function App() {
  const [currentStream, setCurrentStream] = useState(STREAMS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  // Update volume secara real-time
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Fungsi Toggle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Fungsi Ganti Port/Stream
  const switchStream = (stream) => {
    setCurrentStream(stream);
    setIsPlaying(false); // Reset status play saat ganti source
    if (audioRef.current) {
      audioRef.current.load(); // Paksa browser muat source baru
    }
  };

const [metaData, setMetaData] = useState({ title: 'Loading...', artist: '' });
// Ganti dengan URL Worker Anda
const PROXY_URL = "https://radio-proxy.wahyuditritih.workers.dev/"; 
useEffect(() => {
  const fetchShoutcastMetadata = async () => {
    try {
      const response = await fetch(PROXY_URL);
      const data = await response.json();
      
      // Shoutcast JSON biasanya memiliki properti 'songtitle'
      const rawTitle = data.songtitle || "Live Streaming";
      
      // Memisahkan "Artist - Title" jika ada tanda strip (-)
      if (rawTitle.includes(" - ")) {
        const [artist, ...titleParts] = rawTitle.split(" - ");
        setMetaData({
          artist: artist.trim(),
          title: titleParts.join(" - ").trim()
        });
      } else {
        setMetaData({
          artist: "Radio Station",
          title: rawTitle
        });
      }
    } catch (error) {
      console.error("Shoutcast Metadata Error:", error);
    }
  };

  fetchShoutcastMetadata();
  const interval = setInterval(fetchShoutcastMetadata, 15000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <div className="mb-6 animate-pulse">
          <Radio size={64} className="mx-auto text-blue-400" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Streaming Al-Manshuroh</h1>
        <p className="text-slate-400 mb-6">Sedang Memutar: {currentStream.name}</p>

        {/* Audio Element Hidden */}
        <audio ref={audioRef} src={currentStream.url} preload="none" />

        {/* Controls */}
        <div className="flex flex-col gap-6">
          <button 
            onClick={togglePlay}
            className="bg-blue-600 hover:bg-blue-500 transition-all p-6 rounded-full mx-auto"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} fill="white" />}
          </button>

          <div className="flex items-center gap-3 bg-slate-700 p-3 rounded-lg">
            <Volume2 size={20} />
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(e.target.value)}
              className="w-full h-2 bg-blue-400 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STREAMS.map((stream) => (
              <button
                key={stream.id}
                onClick={() => switchStream(stream)}
                className={`py-2 px-4 rounded-xl border-2 transition-all ${
                  currentStream.id === stream.id 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-600 hover:border-slate-400'
                }`}
              >
                {stream.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;