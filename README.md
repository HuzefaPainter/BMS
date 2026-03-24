Run instructions:
ngrok http 8081
cd server/ docker build -t bms-server .
cd server/ docker run -p 8081:8081 --env-file .env bms-server
cd client/ docker build -t bms-client .
cd client/ docker run -p 3000:80 bms-client

glcoud ssh: gcloud compute ssh bms-instance-1 --zone=asia-south1-c

Test card: 5123456789012346
CVV: 123
Expiry: Any future month
OTP: 123456
