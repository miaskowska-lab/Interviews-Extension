// Content script for Google Meet detection
console.log('🍎 Apple Interview Assistant content script loaded');

// Monitor for Apple interviewers
function checkForAppleInterviewers() {
  // Look for participant names/emails in the DOM
  const participants = document.querySelectorAll('[data-participant-id], [jsname="BOHaEe"]');
  let hasAppleInterviewer = false;
  
  participants.forEach(participant => {
    const nameElement = participant.querySelector('[data-participant-name], [jsname="BOHaEe"]');
    if (nameElement) {
      const name = nameElement.textContent.toLowerCase();
      const email = nameElement.getAttribute('data-email') || '';
      
      // Check for Apple domain
      if (email.includes('@apple.com') || 
          name.includes('apple')) {
        hasAppleInterviewer = true;
        console.log('🍎 Apple interviewer detected:', name, email);
      }
    }
  });
  
  // Send status to background script
  chrome.runtime.sendMessage({
    action: 'interviewerStatus',
    hasAppleInterviewer: hasAppleInterviewer
  });
}

// Check every 5 seconds
setInterval(checkForAppleInterviewers, 5000);

// Initial check
checkForAppleInterviewers();
