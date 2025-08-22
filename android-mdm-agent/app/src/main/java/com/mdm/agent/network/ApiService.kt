package com.mdm.agent.network

import android.content.Context
import android.util.Log
import com.google.gson.Gson
import com.mdm.agent.utils.PreferenceManager
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import java.util.concurrent.TimeUnit

data class EnrollRequest(
    val deviceId: String,
    val deviceName: String,
    val model: String?,
    val manufacturer: String?,
    val androidVersion: String?,
    val apiLevel: Int?,
    val serialNumber: String?,
    val imei: String?,
    val fcmToken: String?,
    val enrollmentMethod: String = "qr_code",
    val organizationId: String?,
    val deviceInfo: Map<String, Any?> = emptyMap()
)

data class CheckInRequest(
    val batteryLevel: Int? = null,
    val isCharging: Boolean? = null,
    val networkType: String? = null,
    val availableStorage: Long? = null,
    val totalStorage: Long? = null,
    val availableRam: Long? = null,
    val totalRam: Long? = null,
    val isRooted: Boolean? = null,
    val isScreenLocked: Boolean? = null,
    val lastBoot: String? = null
)

class ApiService private constructor(context: Context) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()
    private val gson = Gson()
    private val json = "application/json; charset=utf-8".toMediaType()
    private val prefs = PreferenceManager(context)

    fun enroll(serverUrl: String, req: EnrollRequest): Response {
        val url = serverUrl.trimEnd('/') + "/api/devices/enroll"
        val body = gson.toJson(req).toRequestBody(json)
        val request = Request.Builder()
            .url(url)
            .post(body)
            .build()
        return client.newCall(request).execute()
    }

    fun acknowledgeCommand(commandId: String) {
        val serverUrl = prefs.getServerUrl()
        if (serverUrl.isNullOrBlank()) {
            Log.w("ApiService", "No serverUrl; cannot acknowledgeCommand")
            return
        }
        try {
            val payload = mapOf(
                "commandId" to commandId,
                "status" to "acknowledged"
            )
            val url = serverUrl.trimEnd('/') + "/api/commands/$commandId/response"
            val body = gson.toJson(payload).toRequestBody(json)
            val request = Request.Builder().url(url).post(body).build()
            client.newCall(request).execute().use { resp ->
                Log.d("ApiService", "acknowledgeCommand resp=${resp.code}")
            }
        } catch (e: Exception) {
            Log.e("ApiService", "acknowledgeCommand failed", e)
        }
    }

    fun reportCommandResult(commandId: String, status: String, message: String?) {
        val serverUrl = prefs.getServerUrl()
        if (serverUrl.isNullOrBlank()) {
            Log.w("ApiService", "No serverUrl; cannot reportCommandResult")
            return
        }
        val normalized = when (status.lowercase()) {
            "completed", "success", "ok" -> "completed"
            "failed", "error" -> "failed"
            else -> status
        }
        try {
            val payload = mapOf(
                "commandId" to commandId,
                "status" to normalized,
                "response" to message
            )
            val url = serverUrl.trimEnd('/') + "/api/commands/$commandId/response"
            val body = gson.toJson(payload).toRequestBody(json)
            val request = Request.Builder().url(url).post(body).build()
            client.newCall(request).execute().use { resp ->
                Log.d("ApiService", "reportCommandResult resp=${resp.code}")
            }
        } catch (e: Exception) {
            Log.e("ApiService", "reportCommandResult failed", e)
        }
    }

    fun updateDeviceFcmToken(deviceId: String, token: String) {
        Log.d("ApiService", "updateDeviceFcmToken($deviceId, $token)")
    }

    // Minimal check-in; backend expects /api/devices/:id/checkin
    fun checkIn(serverUrl: String, backendDeviceId: String, req: CheckInRequest): Response {
        val url = serverUrl.trimEnd('/') + "/api/devices/$backendDeviceId/checkin"
        val body = gson.toJson(req).toRequestBody(json)
        val request = Request.Builder().url(url).post(body).build()
        return client.newCall(request).execute()
    }

    companion object {
        fun create(context: Context): ApiService = ApiService(context)
    }
}
