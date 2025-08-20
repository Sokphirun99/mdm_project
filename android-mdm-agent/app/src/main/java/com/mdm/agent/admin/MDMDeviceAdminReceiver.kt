package com.mdm.agent.admin

import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import android.widget.Toast
import com.mdm.agent.utils.PreferenceManager

class MDMDeviceAdminReceiver : DeviceAdminReceiver() {

    companion object {
        private const val TAG = "MDMDeviceAdminReceiver"
        
        fun getComponentName(context: Context): ComponentName {
            return ComponentName(context.applicationContext, MDMDeviceAdminReceiver::class.java)
        }
    }

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Log.d(TAG, "Device Admin enabled")
        Toast.makeText(context, "MDM Device Admin Enabled", Toast.LENGTH_SHORT).show()
        
        // Update preference
        val preferenceManager = PreferenceManager(context)
        preferenceManager.setDeviceAdminEnabled(true)
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Log.d(TAG, "Device Admin disabled")
        Toast.makeText(context, "MDM Device Admin Disabled", Toast.LENGTH_SHORT).show()
        
        // Update preference
        val preferenceManager = PreferenceManager(context)
        preferenceManager.setDeviceAdminEnabled(false)
    }

    override fun onPasswordChanged(context: Context, intent: Intent, user: android.os.UserHandle) {
        super.onPasswordChanged(context, intent, user)
        Log.d(TAG, "Password changed")
        
        // Report password change to server
        reportPasswordChange(context)
    }

    override fun onPasswordFailed(context: Context, intent: Intent, user: android.os.UserHandle) {
        super.onPasswordFailed(context, intent, user)
        Log.d(TAG, "Password failed")
        
        // Report password failure to server
        reportPasswordFailure(context)
    }

    override fun onPasswordSucceeded(context: Context, intent: Intent, user: android.os.UserHandle) {
        super.onPasswordSucceeded(context, intent, user)
        Log.d(TAG, "Password succeeded")
        
        // Report password success to server
        reportPasswordSuccess(context)
    }

    override fun onLockTaskModeEntering(context: Context, intent: Intent, pkg: String) {
        super.onLockTaskModeEntering(context, intent, pkg)
        Log.d(TAG, "Lock task mode entering for package: $pkg")
    }

    override fun onLockTaskModeExiting(context: Context, intent: Intent) {
        super.onLockTaskModeExiting(context, intent)
        Log.d(TAG, "Lock task mode exiting")
    }

    private fun reportPasswordChange(context: Context) {
        // TODO: Implement API call to report password change
        Log.d(TAG, "Reporting password change to server")
    }

    private fun reportPasswordFailure(context: Context) {
        // TODO: Implement API call to report password failure
        Log.d(TAG, "Reporting password failure to server")
    }

    private fun reportPasswordSuccess(context: Context) {
        // TODO: Implement API call to report password success
        Log.d(TAG, "Reporting password success to server")
    }
}
