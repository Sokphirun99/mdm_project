package com.mdm.agent.fcm

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.mdm.agent.MDMApplication
import com.mdm.agent.commands.CommandExecutor
import com.mdm.agent.utils.PreferenceManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject

class MDMFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "MDMFirebaseMessaging"
    }

    private lateinit var preferenceManager: PreferenceManager
    private lateinit var commandExecutor: CommandExecutor

    override fun onCreate() {
        super.onCreate()
        preferenceManager = PreferenceManager(this)
        commandExecutor = CommandExecutor(this)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        Log.d(TAG, "Message received from: ${remoteMessage.from}")
        
        // Check if device is enrolled
        if (!preferenceManager.isDeviceEnrolled()) {
            Log.w(TAG, "Device not enrolled, ignoring message")
            return
        }

        // Handle notification payload
        remoteMessage.notification?.let { notification ->
            Log.d(TAG, "Message Notification Title: ${notification.title}")
            Log.d(TAG, "Message Notification Body: ${notification.body}")
            
            // Show notification if needed
            showNotification(notification.title, notification.body)
        }

        // Handle data payload for MDM commands
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            handleDataPayload(remoteMessage.data)
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "New FCM token received: $token")
        
        // Store token locally
        preferenceManager.setFcmToken(token)
        
        // Send token to server
        sendTokenToServer(token)
    }

    private fun handleDataPayload(data: Map<String, String>) {
        try {
            val type = data["type"]
            
            when (type) {
                "MDM_COMMAND" -> {
                    val command = data["command"]
                    val params = data["params"]
                    val commandId = data["commandId"]
                    val timestamp = data["timestamp"]
                    
                    if (command != null && commandId != null) {
                        handleMDMCommand(command, params, commandId)
                    } else {
                        Log.e(TAG, "Invalid MDM command data")
                    }
                }
                
                "NOTIFICATION" -> {
                    val title = data["title"] ?: "MDM Notification"
                    val body = data["body"] ?: ""
                    showNotification(title, body)
                }
                
                "ENROLLMENT_SUCCESS" -> {
                    showNotification("Enrollment Successful", "Your device has been enrolled in MDM")
                }
                
                "UNENROLLMENT" -> {
                    showNotification("Device Unenrolled", "Your device has been removed from MDM")
                    handleUnenrollment()
                }
                
                else -> {
                    Log.w(TAG, "Unknown message type: $type")
                }
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Error handling data payload", e)
        }
    }

    private fun handleMDMCommand(command: String, params: String?, commandId: String) {
        Log.d(TAG, "Executing MDM command: $command with ID: $commandId")
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Acknowledge command receipt
                acknowledgeCommand(commandId)
                
                // Parse parameters
                val paramMap = if (params != null && params.isNotEmpty()) {
                    parseJsonToMap(params)
                } else {
                    emptyMap()
                }
                
                // Execute command
                val result = commandExecutor.executeCommand(command, paramMap, commandId)
                
                // Report command completion
                reportCommandResult(commandId, result.success, result.message)
                
            } catch (e: Exception) {
                Log.e(TAG, "Error executing command: $command", e)
                reportCommandResult(commandId, false, e.message ?: "Unknown error")
            }
        }
    }

    private fun parseJsonToMap(jsonString: String): Map<String, Any> {
        return try {
            val jsonObject = JSONObject(jsonString)
            val map = mutableMapOf<String, Any>()
            
            val keys = jsonObject.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                map[key] = jsonObject.get(key)
            }
            
            map
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing JSON parameters", e)
            emptyMap()
        }
    }

    private fun acknowledgeCommand(commandId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val apiService = MDMApplication.instance.apiService
                apiService.acknowledgeCommand(commandId)
                Log.d(TAG, "Command acknowledged: $commandId")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to acknowledge command: $commandId", e)
            }
        }
    }

    private fun reportCommandResult(commandId: String, success: Boolean, message: String?) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val apiService = MDMApplication.instance.apiService
                val status = if (success) "completed" else "failed"
                apiService.reportCommandResult(commandId, status, message)
                Log.d(TAG, "Command result reported: $commandId - $status")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to report command result: $commandId", e)
            }
        }
    }

    private fun sendTokenToServer(token: String) {
        if (!preferenceManager.isDeviceEnrolled()) {
            Log.d(TAG, "Device not enrolled, token will be sent during enrollment")
            return
        }
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val apiService = MDMApplication.instance.apiService
                val deviceId = preferenceManager.getDeviceId()
                
                if (deviceId != null) {
                    apiService.updateDeviceFcmToken(deviceId, token)
                    Log.d(TAG, "FCM token sent to server")
                } else {
                    Log.e(TAG, "No device ID found, cannot send token")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to send FCM token to server", e)
            }
        }
    }

    private fun showNotification(title: String?, body: String?) {
        // TODO: Implement notification display
        Log.d(TAG, "Showing notification: $title - $body")
    }

    private fun handleUnenrollment() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Clear enrollment data
                preferenceManager.clearEnrollmentData()
                
                // Stop background services
                // TODO: Implement service stopping
                
                Log.d(TAG, "Device unenrolled successfully")
            } catch (e: Exception) {
                Log.e(TAG, "Error during unenrollment", e)
            }
        }
    }
}
