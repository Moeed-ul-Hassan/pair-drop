# Troubleshooting & FAQ: Pair Drop ❓

Solutions to common issues and answers to frequently asked questions.

## 🔍 Common Issues

### 1. Devices Cannot Find Each Other
- **Check Network**: Ensure both devices are on the same local network (WiFi).
- **Verify Code**: Double-check that the 6-digit code matches exactly on both devices.
- **Firewall**: Ensure your device's firewall or the network router isn't blocking WebSocket traffic on the application's port.

### 2. Files Fail to Upload
- **File Size**: Very large files might time out depending on your local network speed. Try smaller files first to verify connection.
- **Browser Support**: Ensure you are using a modern browser (Chrome, Firefox, Safari, Edge).

### 3. "Session Expired" Message
- Sessions and items are designed to be ephemeral and expire after **24 hours**. If you see this, simply create a new session.

## 🙋 Frequently Asked Questions

### Is my data stored permanently?
**No.** All shared text and files are stored temporarily and are automatically purged after 24 hours. Pair Drop is designed for quick transfers, not long-term storage.

### Do I need to create an account?
**No.** Pair Drop uses an anonymous session-based pairing system. You don't need a username, password, or email.

### Can I share with multiple devices?
**Yes!** Anyone with the 6-digit code or QR code can join the session. Any item shared will be synced to all connected participants instantly.

---

## 🛠️ Developer Troubleshooting

### Database Connection Fails
- Ensure your `DATABASE_URL` in `.env` is correct and the PostgreSQL service is running.
- If using Docker, ensure the container is mapped to the correct port.

### WebSockets Disconnecting
- Check if your proxy (like Nginx) is configured to handle WebSocket upgrades.
- In development, the Vite server proxies requests; Ensure no other service is occupying the port.

---

[Back to README](file:///m:/40.%20Go%20Lang%20Practice/Pair-Drop/readme.md)
