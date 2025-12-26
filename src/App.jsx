import React from 'react';
import RadioPlayer from './RadioPlayer';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #333' }}>
        <h2>Radio Streaming</h2>
      </nav>
      
      <main style={{ marginTop: '2rem' }}>
        <RadioPlayer />
      </main>

      <footer style={{ position: 'fixed', bottom: 10, width: '100%', textAlign: 'center', fontSize: '12px', color: '#666' }}>
        Format HE-AAC Optimized for Mobile
      </footer>
    </div>
  );
}

export default App;