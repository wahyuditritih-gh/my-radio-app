import React from 'react';
import RadioPlayer from './RadioPlayer';
import './App.css';

function App() {
  return (
    <div className="App">
      <main style={{ marginTop: '2rem' }}>
        <RadioPlayer />
      </main>

      <footer style={{ position: 'fixed', bottom: 10, width: '100%', textAlign: 'center', fontSize: '12px', color: '#666' }}>
        HE-AAC Optimized for Mobile || t.me/AlmanshurohCilacap
      </footer>
    </div>
  );
}

export default App;