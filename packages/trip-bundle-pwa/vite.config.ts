import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Determine base path for GitHub Pages deployment
  let base = '/'
  
  if (command === 'build' && process.env.GITHUB_PAGES) {
    // Check if we're building for a specific subdirectory
    if (process.env.VITE_MOCK === 'true') {
      // Mock version goes to /trip-bundle/mock/
      base = '/trip-bundle/mock/'
    } else if (process.env.VITE_MOCK === 'false') {
      // Real AI version goes to /trip-bundle/real/
      base = '/trip-bundle/real/'
    } else {
      // Landing page goes to /trip-bundle/
      base = '/trip-bundle/'
    }
  }

  return {
    base,
    define: {
      // Make environment variables available to the browser
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
      'process.env.VITE_MOCK': JSON.stringify(process.env.VITE_MOCK),
    },
    plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['TripBundleIcon.jpeg'],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Trip Bundle AI',
        short_name: 'TripBundle',
        description: 'Your AI-powered travel companion',
        theme_color: '#667eea',
        background_color: '#f0f0f0', // Light background to complement the icon
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: base,
        start_url: base,
        categories: ['travel', 'productivity', 'lifestyle'],
        lang: 'en-US',
        icons: [
          // Standard app icons
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '72x72',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '96x96',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '128x128',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '144x144',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '152x152',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '384x384',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          // Maskable icons for adaptive icons
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'maskable'
          },
          {
            src: 'TripBundleIcon.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable'
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg}'],
        navigateFallback: `${base}index.html`,
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/yoavtsook2806\.github\.io\/trip-bundle\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'trip-bundle-cache'
            }
          }
        ]
      }
    })
  ]
  }
})
