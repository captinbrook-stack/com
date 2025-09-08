import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This MUST match your repository name
  base: '/complybuddy-app/', 
  plugins: [react()],
})