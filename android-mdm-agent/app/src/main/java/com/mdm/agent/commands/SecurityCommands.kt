package com.mdm.agent.commands

import android.app.admin.DevicePolicyManager
import android.content.Context
import android.os.Build
import android.util.Log
import com.mdm.agent.MDMApplication

class SecurityCommands(private val context: Context) {

    companion object {
        private const val TAG = "SecurityCommands"
    }

    private val app = MDMApplication.instance
    private val devicePolicyManager = app.getDevicePolicyManager()
    private val componentName = app.getComponentName()

    suspend fun disableCamera(): CommandResult {
        return try {
            if (!app.isAdminActive()) {
                return CommandResult(false, "Device admin not active")
            }

            devicePolicyManager.setCameraDisabled(componentName, true)
            Log.d(TAG, "Camera disabled successfully")
            CommandResult(true, "Camera disabled")
            
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception while disabling camera", e)
            CommandResult(false, "Permission denied: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Error disabling camera", e)
            CommandResult(false, "Failed to disable camera: ${e.message}")
        }
    }

    suspend fun enableCamera(): CommandResult {
        return try {
            if (!app.isAdminActive()) {
                return CommandResult(false, "Device admin not active")
            }

            devicePolicyManager.setCameraDisabled(componentName, false)
            Log.d(TAG, "Camera enabled successfully")
            CommandResult(true, "Camera enabled")
            
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception while enabling camera", e)
            CommandResult(false, "Permission denied: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Error enabling camera", e)
            CommandResult(false, "Failed to enable camera: ${e.message}")
        }
    }

    suspend fun disableUsb(): CommandResult {
        return try {
            if (!app.isDeviceOwner()) {
                return CommandResult(false, "Device owner privileges required")
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                devicePolicyManager.addUserRestriction(componentName, "no_usb_file_transfer")
                Log.d(TAG, "USB file transfer disabled")
                CommandResult(true, "USB file transfer disabled")
            } else {
                CommandResult(false, "USB restriction not supported on this Android version")
            }
            
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception while disabling USB", e)
            CommandResult(false, "Permission denied: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Error disabling USB", e)
            CommandResult(false, "Failed to disable USB: ${e.message}")
        }
    }

    suspend fun enableUsb(): CommandResult {
        return try {
            if (!app.isDeviceOwner()) {
                return CommandResult(false, "Device owner privileges required")
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                devicePolicyManager.clearUserRestriction(componentName, "no_usb_file_transfer")
                Log.d(TAG, "USB file transfer enabled")
                CommandResult(true, "USB file transfer enabled")
            } else {
                CommandResult(false, "USB restriction not supported on this Android version")
            }
            
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception while enabling USB", e)
            CommandResult(false, "Permission denied: ${e.message}")
        } catch (e: Exception) {
            Log.e(TAG, "Error enabling USB", e)
            CommandResult(false, "Failed to enable USB: ${e.message}")
        }
    }
}
