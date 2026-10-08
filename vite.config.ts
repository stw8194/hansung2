import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'])
  const supabaseUrl = env.VITE_SUPABASE_URL?.trim() || env.SUPABASE_URL?.trim()
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY?.trim() || env.SUPABASE_ANON_KEY?.trim()

  if (command === 'build') {
    const missing = [
      !supabaseUrl && 'VITE_SUPABASE_URL 또는 SUPABASE_URL',
      !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY 또는 SUPABASE_ANON_KEY',
    ].filter(Boolean)
    if (missing.length) {
      throw new Error(`필수 환경 변수가 없습니다: ${missing.join(', ')}. Vercel 환경 변수에 등록한 뒤 다시 배포하세요.`)
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl ?? ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey ?? ''),
    },
  }
})
