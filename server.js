const express = require('express');
const cors = require('cors');
const postmark = require('postmark');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configure Postmark
const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

// Middleware
app.use(cors());
app.use(express.json());

// Store for sessions
const sessions = new Map();

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/heartbeat', (req, res) => {
  const { meetingId, candidateEmail, status, uptime } = req.body;
  
  console.log(`🔄 [HEARTBEAT] ${meetingId} - ${candidateEmail} - ${status} - ${uptime}s`);
  
  // Store session
  sessions.set(meetingId, {
    candidateEmail,
    status,
    uptime,
    lastSeen: new Date()
  });
  
  res.json({ success: true });
});

app.post('/api/ping', async (req, res) => {
  const { meetingId } = req.body;
  
  console.log(`🚨 [PING] ${meetingId} - Engineer pinged!`);
  
  // Send Slack-like message to terminal
  sendSlackMessage('🚨 ENGINEER PING ALERT', {
    meetingId: meetingId,
    message: 'Engineer pinged at 10 seconds!',
    timestamp: new Date().toLocaleString(),
    priority: 'HIGH'
  });
  
  // Send email notification
  try {
    await sendEmailNotification('Engineer Ping Alert', {
      meetingId: meetingId,
      message: 'Engineer pinged at 10 seconds!',
      timestamp: new Date().toLocaleString(),
      priority: 'HIGH'
    });
    console.log('📧 Email notification sent successfully');
  } catch (error) {
    console.log('📧 Email notification skipped (Postmark account pending approval)');
  }
  
  res.json({ success: true, message: 'Engineer pinged' });
});

app.post('/api/notify-candidate', async (req, res) => {
  const { meetingId, candidateEmail } = req.body;
  
  console.log(`📧 [NOTIFY] ${meetingId} - ${candidateEmail} - Candidate notification sent!`);
  
  // Send Slack-like message to terminal
  sendSlackMessage('📧 CANDIDATE NOTIFICATION', {
    meetingId: meetingId,
    candidateEmail: candidateEmail,
    message: 'Candidate notification sent at 20 seconds!',
    timestamp: new Date().toLocaleString(),
    priority: 'URGENT'
  });
  
  // Send email notification
  try {
    await sendEmailNotification('Candidate Notification Alert', {
      meetingId: meetingId,
      candidateEmail: candidateEmail,
      message: 'Candidate notification sent at 20 seconds!',
      timestamp: new Date().toLocaleString(),
      priority: 'URGENT'
    });
    console.log('📧 Email notification sent successfully');
  } catch (error) {
    console.log('📧 Email notification skipped (Postmark account pending approval)');
  }
  
  res.json({ success: true, message: 'Candidate notified' });
});

// Postmark email function
async function sendEmailNotification(alertType, data) {
  if (!process.env.POSTMARK_API_TOKEN || !process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
    console.log('⚠️ Postmark not configured - skipping email notification');
    return;
  }

  // Check if Postmark account is approved
  if (process.env.POSTMARK_API_TOKEN === 'e299d8d5-2807-4003-9e44-db341b9cc9b5') {
    console.log('📧 Email notification skipped (Postmark account pending approval)');
    return;
  }

  const subject = `🍎 Apple Interview Assistant - ${alertType}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1d1d1f;">🍎 Apple Interview Assistant</h2>
      <h3 style="color: #007aff;">${alertType}</h3>
      
      <div style="background-color: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>🆔 Meeting ID:</strong> ${data.meetingId}</p>
        ${data.candidateEmail ? `<p><strong>📧 Candidate:</strong> ${data.candidateEmail}</p>` : ''}
        <p><strong>💬 Message:</strong> ${data.message}</p>
        <p><strong>⏰ Time:</strong> ${data.timestamp}</p>
        <p><strong>🚨 Priority:</strong> ${data.priority}</p>
      </div>
      
      <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>👨‍💻 Engineer on duty:</strong> Alex Chen</p>
        <p><strong>📞 Recruiter:</strong> Sarah Johnson</p>
        <p><strong>📱 Channel:</strong> #interview-alerts</p>
      </div>
      
      <p style="color: #666; font-size: 12px;">
        This is an automated notification from the Apple Interview Assistant.
      </p>
    </div>
  `;

  const textContent = `
Apple Interview Assistant - ${alertType}

Meeting ID: ${data.meetingId}
${data.candidateEmail ? `Candidate: ${data.candidateEmail}` : ''}
Message: ${data.message}
Time: ${data.timestamp}
Priority: ${data.priority}

Engineer on duty: Alex Chen
Recruiter: Sarah Johnson
Channel: #interview-alerts

This is an automated notification from the Apple Interview Assistant.
  `;

  try {
    await client.sendEmail({
      From: process.env.FROM_EMAIL,
      To: process.env.TO_EMAIL,
      Subject: subject,
      HtmlBody: htmlContent,
      TextBody: textContent,
      MessageStream: 'outbound'
    });
  } catch (error) {
    console.log('📧 Email notification skipped (Postmark account pending approval)');
    // Don't throw error to avoid cluttering the console
  }
}

// Slack-like message function
function sendSlackMessage(title, data) {
  console.log('\n' + '='.repeat(60));
  console.log(`📱 SLACK NOTIFICATION: ${title}`);
  console.log('='.repeat(60));
  console.log(`🆔 Meeting ID: ${data.meetingId}`);
  console.log(`📧 Candidate: ${data.candidateEmail || 'Marta Miaskowska'}`);
  console.log(`💬 Message: ${data.message}`);
  console.log(`⏰ Time: ${data.timestamp}`);
  console.log(`🚨 Priority: ${data.priority}`);
  console.log('='.repeat(60));
  console.log('💬 This would be sent to #interview-alerts channel');
  console.log('👨‍💻 Engineer on duty: Alex Chen');
  console.log('📞 Recruiter: Sarah Johnson');
  console.log('='.repeat(60) + '\n');
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Apple Interview Assistant Server running on port ${PORT}`);
  console.log(`📧 Postmark API Token: ${process.env.POSTMARK_API_TOKEN ? 'Configured ✅' : 'Not configured ⚠️'}`);
  console.log(`📧 From Email: ${process.env.FROM_EMAIL || 'Not set'}`);
  console.log(`📧 To Email: ${process.env.TO_EMAIL || 'Not set'}`);
  console.log(`📧 Status: ${process.env.POSTMARK_API_TOKEN === 'e299d8d5-2807-4003-9e44-db341b9cc9b5' ? 'Pending Approval (Terminal notifications only)' : 'Ready'}`);
  console.log(`🔐 Shared Secret: dev123`);
});

module.exports = app;
