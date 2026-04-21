import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows clean imports: import Foo from '@/components/Foo'
      '@': path.resolve(__dirname, './src'),
    },
  },
})
