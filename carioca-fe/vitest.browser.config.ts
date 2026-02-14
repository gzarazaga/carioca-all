/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
    browser: {
      enabled: true,
      provider: playwright(),
      headless: false,
      instances: [
        { browser: 'chromium' },
      ],
    },
  },
})
