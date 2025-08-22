# MDM Project - LAN Access Setup Guide

This guide helps you access the MDM system from devices on your local network (LAN).

## Quick Setup

### 1. Find Your Machine's LAN IP
```bash
# On macOS/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1
# Or:
ipconfig getifaddr en0  # macOS Wi-Fi

# Example output: 192.168.1.50
```

### 2. Set Environment Variables
```bash
export SERVER_URL="http://192.168.1.50:3000"
export API_BASE_URL="http://192.168.1.50:3000"
export ALLOWED_ORIGINS="http://192.168.1.50:8080"
```

### 3. Rebuild and Start Services
```bash
cd /Users/phirun/Projects/mdm_project
docker compose up -d --build
```

### 4. Verify Services
- Backend: http://192.168.1.50:3000/health
- Admin UI: http://192.168.1.50:8080
- Login: admin@example.com / admin1234

## Android Device Enrollment

### 1. Generate Enrollment QR
- Open Admin UI: http://192.168.1.50:8080
- Login with admin credentials
- Go to Devices > Enrollment
- Generate QR code (will contain LAN IP automatically)

### 2. Install Android Agent
- Rebuild the Android app (network security changes are now included)
- Install on device connected to same Wi-Fi network

### 3. Enroll Device
- Open MDM Agent app
- Tap "Scan QR"
- Scan the enrollment QR from admin UI
- Verify enrollment success

### 4. Verify Check-ins
- Device should appear in Admin UI > Devices
- Background check-ins happen every 15 minutes
- Telemetry updates (battery, network, etc.) should appear

## Network Requirements

### Same Network
- Phone and computer must be on same Wi-Fi/VLAN
- No AP isolation enabled on router

### Firewall
- Ports 3000 (backend) and 8080 (admin) must be accessible
- Test: `curl http://192.168.1.50:3000/health` from another device

## Troubleshooting

### Backend Not Accessible
```bash
# Check if backend is running
docker compose ps

# Check backend logs
docker compose logs backend

# Test locally
curl http://localhost:3000/health
```

### CORS Errors
- Ensure ALLOWED_ORIGINS includes your LAN IP
- Check browser console for specific errors

### Android Network Errors
- Verify network security config allows cleartext HTTP
- Check if device can reach: http://192.168.1.50:3000/health

### Admin UI Errors
- Clear browser cache
- Check browser console for API errors
- Verify API_BASE_URL in build args

## Security Notes

### Development vs Production
- Current setup allows HTTP cleartext for development
- For production: use HTTPS with proper certificates
- Consider restricting cleartext to debug builds only

### Network Security
- Current Android config allows all cleartext HTTP in debug
- Release builds should use HTTPS only
- Consider VPN for remote access instead of exposing to internet

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `SERVER_URL` | QR code generation | `http://192.168.1.50:3000` |
| `API_BASE_URL` | Admin UI API calls | `http://192.168.1.50:3000` |
| `ALLOWED_ORIGINS` | Backend CORS | `http://192.168.1.50:8080` |

## Files Modified for LAN Access

### Android Agent
- `app/src/main/res/xml/network_security_config.xml` - Allow cleartext HTTP
- `app/src/debug/res/xml/network_security_config.xml` - Debug-only cleartext

### Docker Configuration  
- `docker-compose.yml` - Environment variables for LAN URLs
- `backend-server/src/index.js` - Friendly root route

### Flutter Admin
- `lib/src/core/services/api_service.dart` - Better error handling for backend responses

## Next Steps (Optional)

### HTTPS Setup
1. Get SSL certificates (Let's Encrypt, self-signed, etc.)
2. Configure reverse proxy (Caddy, Traefik, nginx)
3. Update Android network security config for HTTPS
4. Set SERVER_URL and API_BASE_URL to https://...

### Production Deployment
1. Use proper secrets management
2. Set strong JWT secrets
3. Configure database SSL
4. Set up monitoring and logging
5. Implement proper backup strategy
