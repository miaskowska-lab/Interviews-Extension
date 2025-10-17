// Popup script for Apple Interview Assistant
let isMonitoring = false;
let startTime = null;
let timerInterval = null;

// DOM elements
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const meetingInfo = document.getElementById('meetingInfo');
const meetingId = document.getElementById('meetingId');
const meetingUrl = document.getElementById('meetingUrl');
const timer = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const settingsLink = document.getElementById('settingsLink');

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on Google Meet
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab.url && currentTab.url.includes('meet.google.com')) {
      const urlParts = currentTab.url.split('/');
      const meetingIdValue = urlParts[urlParts.length - 1];
      
      meetingInfo.style.display = 'block';
      meetingId.textContent = meetingIdValue;
      meetingUrl.textContent = currentTab.url;
      
      // Check if monitoring is already active
      chrome.storage.local.get(['isMonitoring', 'startTime'], function(result) {
        if (result.isMonitoring) {
          isMonitoring = true;
          startTime = result.startTime;
          updateUI();
          startTimer();
        }
      });
    } else {
      statusText.textContent = 'Not on Google Meet';
      startBtn.disabled = true;
    }
  });
});

// Start monitoring
startBtn.addEventListener('click', function() {
  isMonitoring = true;
  startTime = Date.now();
  
  // Save state
  chrome.storage.local.set({
    isMonitoring: true,
    startTime: startTime
  });
  
  // Send message to background script
  chrome.runtime.sendMessage({action: 'startMonitoring'});
  
  updateUI();
  startTimer();
});

// Stop monitoring
stopBtn.addEventListener('click', function() {
  isMonitoring = false;
  startTime = null;
  
  // Clear state
  chrome.storage.local.remove(['isMonitoring', 'startTime']);
  
  // Send message to background script
  chrome.runtime.sendMessage({action: 'stopMonitoring'});
  
  updateUI();
  stopTimer();
});

// Open settings
settingsLink.addEventListener('click', function(e) {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Update UI based on monitoring state
function updateUI() {
  if (isMonitoring) {
    statusDot.className = 'status-dot active';
    statusText.textContent = 'Monitoring...';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    timer.style.display = 'block';
  } else {
    statusDot.className = 'status-dot';
    statusText.textContent = 'Ready to monitor';
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    timer.style.display = 'none';
  }
}

// Start timer
function startTimer() {
  timerInterval = setInterval(function() {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Change status based on time
      if (elapsed >= 20) { // 20 seconds
        statusDot.className = 'status-dot danger';
        statusText.textContent = 'Candidate notified!';
      } else if (elapsed >= 10) { // 10 seconds
        statusDot.className = 'status-dot warning';
        statusText.textContent = 'Engineer pinged!';
      }
    }
  }, 1000);
}

// Stop timer
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'statusUpdate') {
    switch(request.status) {
      case 'waiting':
        statusDot.className = 'status-dot active';
        statusText.textContent = 'Waiting for interviewer';
        break;
      case 'alone':
        statusDot.className = 'status-dot warning';
        statusText.textContent = 'No interviewer detected';
        break;
      case 'pinged':
        statusDot.className = 'status-dot warning';
        statusText.textContent = 'Engineer pinged!';
        break;
      case 'notified':
        statusDot.className = 'status-dot danger';
        statusText.textContent = 'Candidate notified!';
        break;
    }
  }
});
