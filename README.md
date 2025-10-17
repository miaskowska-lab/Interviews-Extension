# 🍎 Apple Interview Assistant

A simple Chrome extension that monitors Google Meet interviews to detect when candidates are alone and automatically notifies engineers and recruiters.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd apple-extension
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will start on `http://localhost:4000`

### 3. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `apple-extension` folder
5. The Apple Interview Assistant extension should appear

### 4. Configure Extension
1. Click the extension icon in Chrome toolbar
2. Click "⚙️ Settings"
3. Enter your email address
4. Click "Save Settings"

### 5. Test It!
1. Go to `meet.google.com`
2. Create or join a meeting
3. Click the extension icon → "Start Monitoring"
4. Watch the timer count up!

## 📱 How It Works

### Extension Features
- **Real-time Monitoring**: Detects when candidates are alone in Google Meet
- **Timer Display**: Shows elapsed time in the popup
- **Status Indicators**: Color-coded dots (green/yellow/red)
- **Automatic Alerts**: Pings engineers at 10 minutes, notifies candidates at 15 minutes

### Timeline
- **0-10 minutes**: Green dot, "Monitoring..." status
- **10 minutes**: Yellow dot, "Engineer pinged!" status
- **15 minutes**: Red dot, "Candidate notified!" status

## 🎯 What You'll See

### Extension Popup
- Meeting ID and URL
- Timer counting up: `00:00`, `00:01`, `00:02`...
- Status with color-coded dot
- Start/Stop monitoring buttons

### Terminal (Server Logs)
```
🚀 Apple Interview Assistant Server running on port 4000
🔄 [HEARTBEAT] abc-def-ghi - your-email@example.com - waiting - 0s
🔄 [HEARTBEAT] abc-def-ghi - your-email@example.com - waiting - 10s

============================================================
📱 SLACK NOTIFICATION: 🚨 ENGINEER PING ALERT
============================================================
🆔 Meeting ID: abc-def-ghi
📧 Candidate: Marta Miaskowska
💬 Message: Engineer pinged at 10 seconds!
⏰ Time: 10/17/2025, 1:45:30 PM
🚨 Priority: HIGH
============================================================
💬 This would be sent to #interview-alerts channel
👨‍💻 Engineer on duty: Alex Chen
📞 Recruiter: Sarah Johnson
============================================================

============================================================
📱 SLACK NOTIFICATION: 📧 CANDIDATE NOTIFICATION
============================================================
🆔 Meeting ID: abc-def-ghi
📧 Candidate: Marta Miaskowska
💬 Message: Candidate notification sent at 20 seconds!
⏰ Time: 10/17/2025, 1:45:40 PM
🚨 Priority: URGENT
============================================================
💬 This would be sent to #interview-alerts channel
👨‍💻 Engineer on duty: Alex Chen
📞 Recruiter: Sarah Johnson
============================================================
```
```

## 🔧 Configuration

### Settings Page
- **Candidate Email**: Your email for notifications
- **Backend URL**: Server URL (default: http://localhost:4000)
- **Target Domain**: Domain to detect (default: apple.com)
- **Interviewer Names**: Comma-separated names to recognize

### Environment Variables
- `PORT`: Server port (default: 4000)
- `DEV_SHARED_SECRET`: Authentication token (default: dev123)

## 🛠️ Development

### Running in Development
```bash
npm run dev
```

### Building Extension
No build step required! The extension uses vanilla JavaScript and can be loaded directly.

### Testing
1. Start the server: `npm start`
2. Load extension in Chrome
3. Go to Google Meet
4. Start monitoring
5. Check terminal for logs

## 🎉 Features

- No complex build process
- Detects Google Meet sessions
- 10-minute ping, 15-minute notification
- Color-coded status indicators
- Easy configuration
- RESTful endpoints for all actions
- Persistent settings and state

## 🚨 Troubleshooting

### Extension Not Loading
- Make sure you selected the `apple-extension` folder (not a subfolder)
- Check Chrome extensions page for errors
- Try refreshing the extension

### Server Not Starting
- Check if port 4000 is free: `lsof -i :4000`
- Kill existing process: `kill -9 <PID>`
- Try a different port in `server.js`

### No Heartbeats
- Check if server is running: `curl http://localhost:4000/health`
- Check Chrome DevTools console for errors
- Verify extension permissions

## 📝 API Endpoints

- `GET /health` - Server health check
- `POST /api/heartbeat` - Send heartbeat from extension
- `POST /api/ping` - Ping engineer (10 minutes)
- `POST /api/notify-candidate` - Notify candidate (15 minutes)

## 🎯 Perfect for Demonstrations

This extension is designed to be:
- **Simple to understand** - Clear code structure
- **Easy to demonstrate** - Visual feedback and logs
- **Quick to set up** - No complex dependencies
- **Reliable** - Works consistently across sessions

**Ready to monitor Apple interviews!** 🍎
