# Noto - Collaborative Document Editor

A real-time collaborative document editing application built with React, Convex, and BlockNote.

![Project Screenshot](./public/screenshot.png) <!-- Update with actual screenshot if available -->

## Features

- 🔐 **Secure Authentication** - Sign in with email/password or social providers
- 📝 **Rich Text Editing** - Powerful editor powered by BlockNote for creating beautiful documents
- 👥 **Real-time Collaboration** - Edit documents simultaneously with multiple users
- 🌐 **Public & Private Documents** - Share documents publicly or keep them private
- 🔍 **Search Functionality** - Easily find documents by title
- 📱 **Responsive Design** - Works seamlessly across devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database and serverless functions)
- **Editor**: BlockNote (rich text editor)
- **Authentication**: Convex Auth
- **Presence**: Convex Presence (real-time user indicators)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd noto
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env
   ```

4. Initialize Convex:
   ```bash
   npx convex dev
   ```

### Development

Start the development server:

```bash
npm run dev
```

This will start both the frontend and backend development servers.

### Building for Production

```bash
npm run build
```

## Project Structure

```
├── convex/           # Convex backend functions and schema
├── src/              # React frontend source code
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   └── App.tsx       # Main application component
├── public/           # Static assets
└── index.html        # Entry HTML file
```

## Key Components

- **DocumentEditor**: Main editor component using BlockNote
- **Sidebar**: Document navigation and management
- **LandingPage**: Welcome screen with sign-in options
- **PresenceIndicator**: Real-time user presence indicators

## Deployment

Deploy to production with Convex:

```bash
npx convex deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Convex](https://convex.dev) - Backend platform for real-time applications
- [BlockNote](https://blocknotejs.org) - Block-based rich text editor
- [React](https://reactjs.org) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework