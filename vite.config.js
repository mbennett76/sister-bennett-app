import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️  Change '/sister-bennett-app/' to match your GitHub repository name exactly.
// Example: if your repo is at github.com/johndoe/my-app → base: '/my-app/'

export default defineConfig({
  plugins: [react()],
  base: '/sister-bennett-app/',
})
