# Pair Drop 🚀

**Pair Drop** is a blazing-fast, real-time file and text sharing application designed for the local network. Share content between your phone, laptop, or tablet instantly without the hassle of logins, accounts, or cloud storage.

![Version](https://img.shields.io/badge/version-1.0.0-black)
![License](https://img.shields.io/badge/license-MIT-white)

## ✨ Features

- **Zero Configuration**: No signup or login required. Just open and share.
- **Real-time Sync**: Items appear instantly on all connected devices via WebSockets.
- **Cross-Platform**: Works on any device with a modern web browser.
- **Secure Pairing**: Connect devices using a simple 6-digit code or a QR code.
- **PWA Ready**: Install it as a standalone app on your mobile or desktop.
- **Premium Design**: Sleek, monochromatic UI with fluid animations.

---

## 🚀 How It Works (For Users)

1.  **Create a Session**: Open the app on your primary device and click "Start Sharing" to get a unique 6-digit code.
2.  **Join from Another Device**: Scan the QR code or enter the 6-digit code on your second device.
3.  **Share Anything**: Drop files into the share zone or type a text message. It will immediately pop up on the other device!
4.  **Auto-Expiration**: Sessions and shared items are ephemeral and automatically expire after 24 hours.

---

## 🛠️ Developer Information

### Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui.
- **Backend**: Node.js, Express, WebSocket (`ws`).
- **Persistence**: PostgreSQL, Drizzle ORM.
- **Real-time**: WebSocket-based signaling for instant updates.

### Quick Start
```bash
# Install dependencies
npm install

# Setup environment
# Create a .env file with DATABASE_URL=your_postgresql_url

# Push database schema
npm run db:push

# Start development server
npm run dev
```

---

## 📖 Documentation Index

For detailed technical information, please refer to the following guides:

- 🏛️ **[Architecture Overview](file:///m:/40.%20Go%20Lang%20Practice/Pair-Drop/ARCHITECTURE.md)**: Deep dive into the P2P connection and signaling logic.
- 🔌 **[API Reference](file:///m:/40.%20Go%20Lang%20Practice/Pair-Drop/API.md)**: REST endpoints and WebSocket event specifications.
- ⚙️ **[Setup & Configuration](file:///m:/40.%20Go%20Lang%20Practice/Pair-Drop/SETUP.md)**: Detailed instructions for environment setup and deployment.
- ❓ **[Troubleshooting & FAQ](file:///m:/40.%20Go%20Lang%20Practice/Pair-Drop/TROUBLESHOOTING.md)**: Solutions for common issues.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Created with ❤️ by [Moeed ul Hassan](https://moedulhassan.xyz)