# Trip Bundle

A yarn monorepo for travel planning applications.

## 🧳 About

Trip Bundle is your comprehensive travel companion, helping you plan, organize, and manage your trips with ease.

## 📦 Packages

- **trip-bundle-pwa**: Progressive Web App for trip planning and management

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 4.0.0

### Installation

```bash
# Install dependencies
yarn install
```

### Environment Setup

1. **OpenAI API Key** (Required for AI trip generation)
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key
   - Create a `.env` file in the project root:
   ```bash
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Spotify API** (Optional for music preferences)
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add these to your `.env` file:
   ```bash
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

### Start Development

```bash
# Start development server
yarn dev
```

### Available Scripts

- `yarn dev` - Start development servers for all packages
- `yarn build` - Build all packages for production
- `yarn test` - Run tests for all packages
- `yarn lint` - Lint all packages

## 🏗️ Project Structure

```
trip-bundle/
├── packages/
│   └── trip-bundle-pwa/     # Progressive Web App
├── package.json             # Root package.json with workspaces
└── README.md               # This file
```

## 🔧 Development

This is a yarn workspaces monorepo. Each package in the `packages/` directory is a separate workspace that can have its own dependencies and scripts.

## 📱 PWA Features

The trip-bundle-pwa includes:

- ✅ Offline functionality
- ✅ Installable on mobile devices
- ✅ Modern React with TypeScript
- ✅ Responsive design
- ✅ Service worker for caching

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
