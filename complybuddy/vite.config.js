import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  // Replace 'complyease-app' with the name of your GitHub repository
  base: '/complybuddy-app/', 
  plugins: [react()],
})