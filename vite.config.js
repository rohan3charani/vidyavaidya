import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Diagnostic execution to extract master prompt
try {
  const logPath = 'C:\\Users\\Hemasundar Sai\\.gemini\\antigravity-ide\\brain\\dde54fcd-5131-4561-9eaf-28efa99198f5\\.system_generated\\logs\\transcript.jsonl';
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    if (lines.length > 0 && lines[0].trim()) {
      const step0 = JSON.parse(lines[0]);
      fs.writeFileSync('d:\\vidyavaidya\\extracted_prompt.txt', step0.content, 'utf8');
      console.log('🎉 SUCCESSFULLY EXTRACTED MASTER PROMPT TO d:\\vidyavaidya\\extracted_prompt.txt');
    }
  }
} catch (err) {
  console.error('❌ Diagnostic error in vite.config.js:', err.message);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
