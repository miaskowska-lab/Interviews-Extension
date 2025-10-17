# Postmark Email Configuration for Apple Interview Assistant

## Quick Setup (3 minutes):

### 1. Create Postmark Account
1. Go to [postmarkapp.com](https://postmarkapp.com) and sign up for a free account
2. Verify your email address
3. Complete account setup

### 2. Get Postmark API Token
1. Go to [Postmark Dashboard](https://account.postmarkapp.com)
2. Navigate to **Servers** → **Your Server** → **API Tokens**
3. Copy the **Server API Token** (starts with your server name)


### 4. Create Environment File
Create a `.env` file in your project root:
```bash
# Postmark Configuration
POSTMARK_API_TOKEN=your_server_api_token_here
FROM_EMAIL=your-verified-email@example.com
TO_EMAIL=your-notification-email@example.com

# Server Configuration
PORT=4000
NODE_ENV=development
```

**Replace these values:**
- `POSTMARK_API_TOKEN`: Your Postmark Server API Token
- `FROM_EMAIL`: Your verified sender email address
- `TO_EMAIL`: Where you want to receive notifications

### 5. Install Dependencies
```bash
npm install
```

### 6. Test It!
1. Start the server: `npm start`
2. Start monitoring in the extension
3. Wait 10 seconds → You'll get "Engineer Ping Alert" email
4. Wait 20 seconds → You'll get "Candidate Notification Alert" email

## Email Examples:

**Engineer Ping Alert (10 seconds):**
```
Subject: 🍎 Apple Interview Assistant - Engineer Ping Alert
Meeting abc-def-ghi - Engineer pinged at 10 seconds!
Time: 10/17/2025, 1:30:45 PM
Priority: HIGH
```

**Candidate Notification Alert (20 seconds):**
```
Subject: 🍎 Apple Interview Assistant - Candidate Notification Alert  
Meeting abc-def-ghi - Candidate brady@gmail.com notified at 20 seconds!
Time: 10/17/2025, 1:30:55 PM
Priority: URGENT
```

## Troubleshooting:
- **"Postmark not configured"**: Check your `.env` file exists and has correct values
- **"Invalid API token"**: Verify your Postmark Server API Token is correct
- **"Sender not verified"**: Complete sender verification in Postmark dashboard
- **"Unauthorized"**: Check API token has correct permissions
- **No emails**: Check spam folder, verify Postmark account status

## Postmark Benefits:
- ✅ **100 emails/month FREE** (perfect for testing)
- ✅ **Excellent deliverability** (designed for transactional emails)
- ✅ **Fast setup** (no complex verification process)
- ✅ **Reliable service** (used by major companies)
- ✅ **Great documentation** and support

## Security Notes:
- ✅ `.env` file is automatically ignored by git (won't be uploaded)
- ✅ API tokens are kept secure and not exposed in code
- ✅ Postmark free tier allows 100 emails/month

**Ready to receive professional email alerts!** 📧🍎
