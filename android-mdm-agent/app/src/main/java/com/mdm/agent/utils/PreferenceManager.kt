package com.mdm.agent.utils

import android.content.Context
import android.content.SharedPreferences

class PreferenceManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("mdm_prefs", Context.MODE_PRIVATE)

    fun isDeviceEnrolled(): Boolean = prefs.getBoolean(KEY_ENROLLED, false)

    fun setDeviceAdminEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_DEVICE_ADMIN, enabled).apply()
    }

    fun setFcmToken(token: String) {
        prefs.edit().putString(KEY_FCM_TOKEN, token).apply()
    }

    fun getDeviceId(): String? = prefs.getString(KEY_DEVICE_ID, null)

    fun clearEnrollmentData() {
        prefs.edit()
            .remove(KEY_ENROLLED)
            .remove(KEY_DEVICE_ID)
            .apply()
    }

    fun setEnrolled(enrolled: Boolean) {
        prefs.edit().putBoolean(KEY_ENROLLED, enrolled).apply()
    }

    fun setDeviceId(id: String) {
        prefs.edit().putString(KEY_DEVICE_ID, id).apply()
    }

    fun getFcmToken(): String? = prefs.getString(KEY_FCM_TOKEN, null)

    fun setServerUrl(url: String) { prefs.edit().putString(KEY_SERVER_URL, url).apply() }
    fun getServerUrl(): String? = prefs.getString(KEY_SERVER_URL, null)

    companion object {
        private const val KEY_DEVICE_ADMIN = "device_admin_enabled"
        private const val KEY_ENROLLED = "enrolled"
        private const val KEY_DEVICE_ID = "device_id"
        private const val KEY_FCM_TOKEN = "fcm_token"
    private const val KEY_SERVER_URL = "server_url"
    }
}
