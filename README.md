Run instructions:
For local:
set test = true in client/src/api_constants.js
setup ngrok locally.

set these keys in .env file:
mongodb_url (also whitelist local ip on mongo)
jwt_secret
ngrok_domain
payu_key
payu_salt
frontend_domain as localhost:3000 (in future could host both on separate machines)
(if want to test email)
sendgrid_api_key
sendgrid_from_email

ngrok http 8081
add ngrok forwarded domain to ngrok_domain

Run in terminal:
cd server/
npm run dev
cd client/
npm start

IF docker:
cd server/ docker build -t bms-server .
cd server/ docker run -p 8081:8081 --env-file .env bms-server
cd client/ docker build -t bms-client .
cd client/ docker run -p 3000:80 bms-client

glcoud ssh: gcloud compute ssh bms-instance-1 --zone=asia-south1-c

For payment test:
Test card: 5123456789012346
CVV: 123
Expiry: Any future month
OTP: 123456
