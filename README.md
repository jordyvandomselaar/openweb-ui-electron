# OpenWebUI Electron

An Electron wrapper for OpenWebUI that provides a desktop experience with a quick launcher.

## Features

- **Desktop App**: Run OpenWebUI as a standalone desktop application
- **Quick Launcher**: Global hotkey (`Alt+Space`) to quickly access OpenWebUI with search functionality
- **Web Search Integration**: Toggle between regular chat and web search mode
- **External Link Handling**: Automatically opens external links in your default browser
- **Auto-start**: Launches automatically when you log in
- **Transparent Launcher**: Beautiful, minimal launcher interface

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Bun](https://bun.sh/) (for package management)
- macOS (current build configuration is for Mac)
- Apple Developer Account (for code signing and distribution)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd openwebui-electron
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Configure the application** (see Configuration section below)

4. **Run the application**:
   ```bash
   bun run start
   ```

## Configuration

Before running the application, you need to configure several values:

### Required Configuration Values

| File | Line | Value | Description |
|------|------|-------|-------------|
| `main.js` | 7 | `baseUrl` | Your OpenWebUI instance URL (e.g., `https://your-openwebui.com` or `http://localhost:3000`) |
| `package.json` | 6 | `author` | Your name |
| `package.json` | 10 | `appId` | Unique app identifier (e.g., `com.yourname.openwebui`) |
| `package.json` | 15 | `identity` | Apple Developer identity for code signing |

### Detailed Configuration Steps

1. **Set OpenWebUI Base URL** (`main.js`, line 7):
   ```javascript
   const baseUrl = 'https://your-openwebui-instance.com';
   ```

2. **Update Package Information** (`package.json`):
   ```json
   {
     "author": "Your Name Here",
     "build": {
       "appId": "com.yourname.openwebui",
       "mac": {
         "identity": "Apple Development: your.email@example.com (YOUR_TEAM_ID)"
       }
     }
   }
   ```

### Apple Developer Configuration

For building and distributing on macOS, you'll need:

- **Apple Developer Team ID**: Found in your Apple Developer account
- **Developer Email**: The email associated with your Apple Developer account
- **Code Signing Identity**: Format: `Apple Development: your.email@example.com (TEAM_ID)`

## Usage

### Running the Application

```bash
# Development mode
bun run start

# Build for distribution
bun run dist
```

### Using the Launcher

1. **Open Launcher**: Press `Alt+Space` anywhere on your system
2. **Type Query**: Enter your question or search term
3. **Toggle Web Search**: Click the globe icon to enable/disable web search
4. **Submit**: Press `Enter` to open OpenWebUI with your query
5. **Cancel**: Press `Escape` to close the launcher

### Keyboard Shortcuts

- `Alt+Space`: Open quick launcher
- `Enter`: Submit query and open main window
- `Escape`: Close launcher

## Building for Distribution

1. **Ensure all configuration values are set** (see Configuration section)

2. **Build the application**:
   ```bash
   bun run dist
   ```

3. **Find the built application** in the `dist` folder

### Build Requirements

- Valid Apple Developer certificate for code signing
- Proper `appId` and `identity` configuration in `package.json`

## Project Structure

```
openwebui-electron/
├── main.js              # Main Electron process
├── preload.js           # Preload script for secure IPC
├── launcher.html        # Quick launcher UI
├── package.json         # Project configuration and dependencies
├── tsconfig.json        # TypeScript configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

### Key Files

- **`main.js`**: Main Electron application logic, window management, and IPC handlers
- **`preload.js`**: Secure bridge between renderer and main process
- **`launcher.html`**: Quick launcher interface with search functionality
- **`package.json`**: Project metadata, dependencies, and build configuration

## Development

### Architecture

The application consists of two main windows:

1. **Main Window**: Displays the OpenWebUI interface
2. **Launcher Window**: Transparent, always-on-top quick access interface

### IPC Communication

- `launch-url`: Sent from launcher to main process with query and search mode
- `hide-launcher`: Sent to hide the launcher window

### Security Features

- Context isolation enabled
- Node integration disabled in renderer
- Sandboxed renderer processes
- External links open in default browser

## Troubleshooting

### Common Issues

1. **App won't start**: Check that the `baseUrl` in `main.js` is correctly set
2. **Build fails**: Ensure Apple Developer identity is properly configured
3. **Launcher doesn't appear**: Check that global shortcut isn't conflicting with other apps

### Debug Mode

Run with debug output:
```bash
DEBUG=* bun run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
6. Yolo