import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Menghindari error path saat dipublish di folder atau subdomain
  server: {
    host: true, // Agar bisa dibuka via IP Laptop di Browser HP
proxy: {
      // Saat di lokal, setiap request ke /stream-cilacap 
      // akan diteruskan ke server radio asli
      '/stream-satu': {
        target: 'https://cilacap.radioislam.my.id:11162',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/stream-satu/, '/stream'),
      },
      '/stream-dua': {
        target: 'https://cilacap.radioislam.my.id:11606',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/stream-dua/, '/stream'),
      },
    },
  },
})

