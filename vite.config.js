// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/play-app/', // Replace with the name of your GitHub repo
  plugins: [react()],
})
