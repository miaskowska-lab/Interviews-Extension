// Background script for Apple Interview Assistant
let isMonitoring = false;
let meetingId = null;
let startTime = null;
let heartbeatInterval = null;
let pingTimeout = null;
let notifyTimeout = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startMonitoring') {
    startMonitoring();
  } else if (request.action === 'stopMonitoring') {
    stopMonitoring();
  }
});

// Listen for tab updates to detect Google Meet
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('meet.google.com')) {
    const urlParts = tab.url.split('/');
    meetingId = urlParts[urlParts.length - 1];
  }
});

function startMonitoring() {
  if (isMonitoring) return;
  
  isMonitoring = true;
  startTime = Date.now();
  
  // Get current tab to extract meeting ID
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0] && tabs[0].url && tabs[0].url.includes('meet.google.com')) {
      const urlParts = tabs[0].url.split('/');
      meetingId = urlParts[urlParts.length - 1];
      
      console.log('🍎 Starting monitoring for meeting:', meetingId);
      
      // Start heartbeat
      startHeartbeat();
      
      // Set up timers
      pingTimeout = setTimeout(() => {
        sendPing();
      }, 10 * 1000); // 10 seconds
      
      notifyTimeout = setTimeout(() => {
        sendNotification();
      }, 20 * 1000); // 20 seconds
    }
  });
}

function stopMonitoring() {
  isMonitoring = false;
  startTime = null;
  meetingId = null;
  
  console.log('🍎 Stopping monitoring');
  
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
  
  if (pingTimeout) {
    clearTimeout(pingTimeout);
    pingTimeout = null;
  }
  
  if (notifyTimeout) {
    clearTimeout(notifyTimeout);
    notifyTimeout = null;
  }
}

function startHeartbeat() {
  heartbeatInterval = setInterval(() => {
    sendHeartbeat();
  }, 10 * 1000); // Every 10 seconds
}

function sendHeartbeat() {
  if (!isMonitoring || !meetingId) return;
  
  chrome.storage.sync.get(['candidateEmail'], (result) => {
    const email = result.candidateEmail || 'unknown@example.com';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    
    console.log(`🔄 Heartbeat: ${meetingId} - ${email} - ${elapsed}s`);
    
    // Send to backend
    fetch('http://localhost:4000/api/heartbeat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': 'dev123'
      },
      body: JSON.stringify({
        meetingId: meetingId,
        candidateEmail: email,
        status: 'waiting',
        uptime: elapsed
      })
    }).catch(error => {
      console.error('❌ Heartbeat failed:', error);
    });
  });
}

function sendPing() {
  if (!isMonitoring || !meetingId) return;
  
  console.log(`🚨 PING: ${meetingId} - Engineer pinged!`);
  
  // Send to backend
  fetch('http://localhost:4000/api/ping', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Token': 'dev123'
    },
    body: JSON.stringify({
      meetingId: meetingId
    })
  }).catch(error => {
    console.error('❌ Ping failed:', error);
  });
  
  // Update popup
  chrome.runtime.sendMessage({action: 'statusUpdate', status: 'pinged'});
}

function sendNotification() {
  if (!isMonitoring || !meetingId) return;
  
  chrome.storage.sync.get(['candidateEmail'], (result) => {
    const email = result.candidateEmail || 'unknown@example.com';
    
    console.log(`📧 NOTIFY: ${meetingId} - ${email} - Candidate notification sent!`);
    
    // Send to backend
    fetch('http://localhost:4000/api/notify-candidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Token': 'dev123'
      },
      body: JSON.stringify({
        meetingId: meetingId,
        candidateEmail: email
      })
    }).catch(error => {
      console.error('❌ Notification failed:', error);
    });
    
    // Update popup
    chrome.runtime.sendMessage({action: 'statusUpdate', status: 'notified'});
  });
}

// Initialize
console.log('🍎 Apple Interview Assistant background script loaded');
