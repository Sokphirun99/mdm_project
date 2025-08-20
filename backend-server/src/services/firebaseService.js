const admin = require('firebase-admin');
require('dotenv').config();

class FirebaseService {
  constructor() {
    this.enabled = (process.env.ENABLE_FCM || '').toLowerCase() !== 'false';

    // Only attempt initialization if enabled and we have basic required fields
    const hasCreds = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    );

    if (this.enabled && hasCreds) {
      try {
        if (!admin.apps.length) {
          const serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            client_id: process.env.FIREBASE_CLIENT_ID,
            auth_uri: process.env.FIREBASE_AUTH_URI,
            token_uri: process.env.FIREBASE_TOKEN_URI,
            auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
          };

          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
        }
        this.messaging = admin.messaging();
      } catch (err) {
        console.warn('[Firebase] Initialization disabled due to config error:', err?.message || err);
        this.enabled = false;
        this.messaging = null;
      }
    } else {
      if (!this.enabled) {
        console.info('[Firebase] FCM explicitly disabled via ENABLE_FCM=false');
      } else {
        console.info('[Firebase] Missing credentials; FCM disabled for this run');
      }
      this.messaging = null;
    }
  }

  async sendToDevice(fcmToken, title, body, data = {}) {
    if (!this.enabled || !this.messaging) {
      console.info('[Firebase] sendToDevice noop (FCM disabled):', { title, dataKeys: Object.keys(data || {}) });
      return { success: true, noop: true };
    }
    try {
      const message = {
        token: fcmToken,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'mdm_commands',
            priority: 'high',
            defaultSound: true
          }
        }
      };

      const response = await this.messaging.send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendCommand(fcmToken, command, params = {}) {
    if (!this.enabled || !this.messaging) {
      console.info('[Firebase] sendCommand noop (FCM disabled):', { command, params });
      return { success: true, noop: true };
    }
    try {
      const message = {
        token: fcmToken,
        data: {
          type: 'MDM_COMMAND',
          command: command,
          params: JSON.stringify(params),
          timestamp: Date.now().toString(),
          commandId: require('uuid').v4()
        },
        android: {
          priority: 'high'
        }
      };

      const response = await this.messaging.send(message);
      console.log(`Command '${command}' sent to device:`, response);
      return response;
    } catch (error) {
      console.error(`Error sending command '${command}':`, error);
      throw error;
    }
  }

  async sendToMultipleDevices(fcmTokens, title, body, data = {}) {
    if (!this.enabled || !this.messaging) {
      console.info('[Firebase] sendToMultipleDevices noop (FCM disabled):', { count: (fcmTokens || []).length });
      return { success: true, noop: true };
    }
    try {
      const message = {
        tokens: fcmTokens,
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: Date.now().toString()
        }
      };

      const response = await this.messaging.sendMulticast(message);
      console.log(`Successfully sent message to ${response.successCount} devices`);
      
      if (response.failureCount > 0) {
        console.log(`Failed to send to ${response.failureCount} devices`);
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            console.error(`Error for token ${fcmTokens[idx]}:`, resp.error);
          }
        });
      }

      return response;
    } catch (error) {
      console.error('Error sending multicast message:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseService();
