package com.mdm.agent.commands

import android.app.admin.DevicePolicyManager
import android.content.Context
import android.os.Build
import android.provider.Settings
import android.util.Log
import com.mdm.agent.MDMApplication

class DeviceCommands(private val context: Context) {

    companion object {
        private const val TAG = "DeviceCommands"
    }

    private val app = MDMApplication.instance
    private val devicePolicyManager = app.getDevicePolicyManager()
    private val componentName = app.getComponentName()

    suspend fun lockDevice(parameters: Map<String, Any>): CommandResult {
        return try {
            if (!app.isAdminActive()) {
                return CommandResult(false, "Device admin not active")
            }

            val message = parameters["message"] as? String ?: "Device locked by administrator"
            
            if (app.isDeviceOwner()) {
                devicePolicyManager.lockNow()
                Log.d(TAG, "Device locked successfully")
                CommandResult(true, "Device locked with message: $message")
            } else {
                devicePolicyManager.lockNow()
                Log.d(TAG, "Device locked (limited admin)")
                CommandResult(true, "Device locked")
            }
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception while locking device", e)
            CommandResult(false, "Permission denied: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Error locking device", e)
            CommandResult(false, "Failed to lock device: ${e.message}")
        }
    }

    suspend fun unlockDevice(parameters: Map<String, Any>): CommandResult {
        return try {
            // Note: Android doesn't allow programmatic unlock for security reasons
            // This would typically require user interaction
            Log.w(TAG, "Unlock device requested but not supported")
            CommandResult(false, "Device unlock not supported for security reasons")
        } catch (e: Exception) {
            Log.e(TAG, "Error unlocking device", e)
            CommandResult(false, "Failed to unlock device: ${e.message}")
        }
    }

    suspend fun rebootDevice(parameters: Map<String, Any>): CommandResult {
        return try {
            if (!app.isDeviceOwner()) {
                return CommandResult(false, "Device owner privileges required for reboot")
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                devicePolicyManager.reboot(componentName)
                Log.d(TAG, "Device reboot initiated")
                CommandResult(true, "Device reboot initiated")
            } else {
                CommandResult(false, "Reboot not supported on this Android version")
            }
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception while rebooting device", e)
            CommandResult(false, "Permission denied: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Error rebooting device", e)
            CommandResult(false, "Failed to reboot device: ${e.message}")
        }
    }

    suspend fun wipeDevice(parameters: Map<String, Any>): CommandResult {
        return try {
            if (!app.isDeviceOwner()) {
                return CommandResult(false, "Device owner privileges required for wipe")
            }

            val confirmed = parameters["confirmed"] as? Boolean ?: false
            if (!confirmed) {
                return CommandResult(false, "Wipe operation requires confirmation")
            }

            // Wipe device data
            var flags = 0
            
            // Wipe external storage if requested
            val wipeExternalStorage = parameters["wipeExternalStorage"] as? Boolean ?: true
            if (wipeExternalStorage && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                flags = flags or DevicePolicyManager.WIPE_EXTERNAL_STORAGE
            }

            // Reset protection data if requested
            val resetProtectionData = parameters["resetProtectionData"] as? Boolean ?: false
            if (resetProtectionData && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                flags = flags or DevicePolicyManager.WIPE_RESET_PROTECTION_DATA
            }

            val reason = parameters["reason"] as? String ?: "Remote wipe requested by administrator"
            
            devicePolicyManager.wipeData(flags, reason)
            Log.d(TAG, "Device wipe initiated")
            CommandResult(true, "Device wipe initiated")
            
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception while wiping device", e)
            CommandResult(false, "Permission denied: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Error wiping device", e)
            CommandResult(false, "Failed to wipe device: ${e.message}")
        }
    }

    suspend fun getDeviceInfo(): CommandResult {
        return try {
            val deviceInfo = mutableMapOf<String, Any>()
            
            // Basic device information
            deviceInfo["manufacturer"] = Build.MANUFACTURER
            deviceInfo["model"] = Build.MODEL
            deviceInfo["brand"] = Build.BRAND
            deviceInfo["product"] = Build.PRODUCT
            deviceInfo["device"] = Build.DEVICE
            deviceInfo["board"] = Build.BOARD
            deviceInfo["hardware"] = Build.HARDWARE
            deviceInfo["serial"] = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                try {
                    Build.getSerial()
                } catch (e: SecurityException) {
                    "Permission denied"
                }
            } else {
                Build.SERIAL
            }
            
            // Android version information
            deviceInfo["androidVersion"] = Build.VERSION.RELEASE
            deviceInfo["apiLevel"] = Build.VERSION.SDK_INT
            deviceInfo["securityPatch"] = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Build.VERSION.SECURITY_PATCH
            } else {
                "N/A"
            }
            
            // Device admin status
            deviceInfo["isAdminActive"] = app.isAdminActive()
            deviceInfo["isDeviceOwner"] = app.isDeviceOwner()
            
            // Display information
            val displayMetrics = context.resources.displayMetrics
            deviceInfo["screenDensity"] = displayMetrics.densityDpi
            deviceInfo["screenWidth"] = displayMetrics.widthPixels
            deviceInfo["screenHeight"] = displayMetrics.heightPixels
            
            // Device ID
            val androidId = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
            deviceInfo["androidId"] = androidId
            
            Log.d(TAG, "Device info collected successfully")
            CommandResult(true, "Device info collected", deviceInfo)
            
        } catch (e: Exception) {
            Log.e(TAG, "Error collecting device info", e)
            CommandResult(false, "Failed to collect device info: ${e.message}")
        }
    }

    suspend fun takeScreenshot(): CommandResult {
        return try {
            // Note: Taking screenshots programmatically requires special permissions
            // and is typically restricted for security reasons
            Log.w(TAG, "Screenshot requested but may not be permitted")
            CommandResult(false, "Screenshot capture not implemented due to security restrictions")
        } catch (e: Exception) {
            Log.e(TAG, "Error taking screenshot", e)
            CommandResult(false, "Failed to take screenshot: ${e.message}")
        }
    }
}
