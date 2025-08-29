import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Determine base path for GitHub Pages deployment
  let base = '/'
  
  if (command === 'build' && process.env.GITHUB_PAGES) {
    // For now, deploy everything to /trip-bundle/ since that's what GitHub Pages is configured for
    base = '/trip-bundle/'
  }

  return {
    base,
    plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['TripBundleIcon.jpeg'],
      manifest: {
        name: 'Trip Bundle AI',
        short_name: 'TripBundle',
        description: 'Your AI-powered travel companion',
        theme_color: '#667eea',
        background_color: '#667eea',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['travel', 'productivity', 'lifestyle'],
        lang: 'en-US',
        icons: [
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '180x180',
            type: 'image/jpeg',
            purpose: 'any'
          }
        ],
        // Screenshots removed - add them when available
        // screenshots: [
        //   {
        //     src: 'screenshot-wide.png',
        //     sizes: '1280x720',
        //     type: 'image/png',
        //     form_factor: 'wide'
        //   },
        //   {
        //     src: 'screenshot-narrow.png',
        //     sizes: '750x1334',
        //     type: 'image/png',
        //     form_factor: 'narrow'
        //   }
        // ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg}']
      }
    })
  ]
  }
})
