# Android MDM Agent

Android application that acts as the MDM (Mobile Device Management) agent on enrolled devices.

## Features

- **Device Enrollment**: QR code scanning and manual enrollment
- **Remote Commands**: Lock, wipe, reboot, app management
- **Policy Enforcement**: Security policies, app restrictions
- **Real-time Communication**: Firebase Cloud Messaging integration
- **Monitoring**: Location tracking, device status reporting
- **Security**: Device admin privileges, encryption

## Architecture

- **Kotlin**: Primary development language
- **Firebase**: Push notifications and analytics
- **Device Admin API**: Core device management functionality
- **Room Database**: Local data storage
- **Work Manager**: Background task execution
- **Retrofit**: REST API communication

## Setup Instructions

### Prerequisites

- Android Studio Arctic Fox or later
- Android SDK 26+ (target SDK 34)
- Firebase project configuration
- Device with Android 8.0+ for testing

### Installation

1. **Open in Android Studio**
   ```bash
   # Open the android-mdm-agent folder in Android Studio
   ```

2. **Configure Firebase**
   - Add your `google-services.json` file to `app/` directory
   - Configure Firebase messaging in the console

3. **Update Configuration**
   Edit `strings.xml` with your server configuration:
   ```xml
   <string name="server_url">https://your-mdm-server.com</string>
   <string name="api_key">your-api-key</string>
   ```

4. **Build and Install**
   ```bash
   ./gradlew assembleDebug
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

## Key Components

### Device Admin Receiver
- Handles device admin events
- Manages password policies
- Reports security events

### Firebase Messaging Service
- Receives real-time commands
- Handles push notifications
- Executes remote operations

### Command Executor
- Processes MDM commands
- Executes device operations
- Reports command status

### Background Services
- Periodic check-ins
- Status monitoring
- Location tracking

## Supported Commands

- `lock_device`: Lock device screen
- `wipe_device`: Factory reset device
- `reboot_device`: Restart device
- `install_app`: Silent app installation
- `uninstall_app`: Remove applications
- `disable_camera`: Disable camera access
- `get_location`: Request current location
- `get_device_info`: Collect device information

## Security Features

- Device admin privileges
- Encrypted local storage
- Certificate pinning
- Secure communication
- Tamper detection

## Permissions Required

### Device Admin
- Lock device
- Wipe device data
- Set password policies

### Location
- ACCESS_FINE_LOCATION
- ACCESS_BACKGROUND_LOCATION

### App Management
- REQUEST_INSTALL_PACKAGES
- REQUEST_DELETE_PACKAGES
- QUERY_ALL_PACKAGES

## Testing

Run tests with:
```bash
./gradlew test
./gradlew connectedAndroidTest
```

## Building for Production

1. **Configure signing**
2. **Enable ProGuard**
3. **Update server URLs**
4. **Build release APK**

```bash
./gradlew assembleRelease
```

## Deployment

The app can be deployed via:
- Google Play Store (managed)
- Enterprise distribution
- Manual APK installation
- MDM-triggered installation
