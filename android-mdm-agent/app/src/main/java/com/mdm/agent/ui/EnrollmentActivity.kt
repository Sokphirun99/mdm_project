package com.mdm.agent.ui

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.mdm.agent.MDMApplication
import com.mdm.agent.R
import com.mdm.agent.network.EnrollRequest
import com.mdm.agent.utils.PreferenceManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.URI
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit
import com.mdm.agent.service.CheckInWorker
import com.mdm.agent.network.CheckInRequest
import com.mdm.agent.utils.DeviceInfo

class EnrollmentActivity : AppCompatActivity() {
    private lateinit var tv: TextView
    private lateinit var prefs: PreferenceManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_enrollment)

        tv = findViewById(R.id.tvEnrollment)
        prefs = PreferenceManager(this)

        val qr = intent?.getStringExtra("qr")
        tv.text = getString(R.string.enrollment_qr_value, qr ?: "-")

        if (!qr.isNullOrBlank()) {
            enrollFromQr(qr)
        }
    }

    private fun enrollFromQr(content: String) {
        val parsed = parseQr(content)
    val serverUrl = parsed.serverUrl
        val organizationId = parsed.organizationId

        if (serverUrl == null) {
            tv.text = "Invalid QR: missing serverUrl"
            return
        }

    CoroutineScope(Dispatchers.IO).launch {
            val app = MDMApplication.instance
            val api = app.apiService
            val req = EnrollRequest(
                deviceId = obtainDeviceId(),
                deviceName = Build.MODEL ?: "Android Device",
                model = Build.MODEL,
                manufacturer = Build.MANUFACTURER,
                androidVersion = Build.VERSION.RELEASE,
                apiLevel = Build.VERSION.SDK_INT,
                serialNumber = getSerialNumberSafe(),
                imei = null, // requires READ_PHONE_STATE and TelephonyManager; skip for now
                fcmToken = prefs.getFcmToken(),
                organizationId = organizationId,
                deviceInfo = mapOf(
                    "brand" to Build.BRAND,
                    "device" to Build.DEVICE,
                    "product" to Build.PRODUCT
                )
            )

            val response = api.enroll(serverUrl, req)
            response.use { resp ->
                val bodyStr = try { resp.body?.string() } catch (_: Exception) { null }
                withContext(Dispatchers.Main) {
                    if (resp.isSuccessful) {
                        // Try to parse backend device.id
                        val returnedId = try {
                            val o = org.json.JSONObject(bodyStr ?: "{}")
                            o.optJSONObject("device")?.optString("id")?.takeIf { it.isNotBlank() }
                        } catch (_: Exception) { null }
                        val storedId = returnedId ?: req.deviceId
                        prefs.setEnrolled(true)
                        prefs.setDeviceId(storedId)
                        prefs.setServerUrl(serverUrl)
                        tv.text = "Enrollment successful"
                        // Immediate one-shot check-in
                        immediateCheckIn()
                        // Schedule periodic check-ins
                        scheduleCheckIn()
                    } else {
                        tv.text = "Enrollment failed: ${resp.code} - ${bodyStr ?: resp.message}"
                    }
                }
            }
        }
    }

    private data class ParsedQr(val serverUrl: String?, val organizationId: String?)

    private fun parseQr(content: String): ParsedQr {
        return try {
            if (content.trim().startsWith("{")) {
                val o = JSONObject(content)
                ParsedQr(
                    o.optString("serverUrl").takeIf { it.isNotBlank() },
                    o.optString("organizationId").takeIf { it.isNotBlank() }
                )
            } else if (content.startsWith("mdm://")) {
                val uri = URI(content)
                val q = uri.query.orEmpty().split('&').mapNotNull {
                    val parts = it.split('=')
                    if (parts.size == 2) parts[0] to parts[1] else null
                }.toMap()
                ParsedQr(q["serverUrl"], q["organizationId"])
            } else {
                ParsedQr(null, null)
            }
        } catch (e: Exception) {
            ParsedQr(null, null)
        }
    }

    @SuppressLint("HardwareIds")
    private fun obtainDeviceId(): String =
        Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID) ?: "unknown"

    @SuppressLint("HardwareIds")
    private fun getSerialNumberSafe(): String? = try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) Build.getSerial() else null
    } catch (_: Exception) { null }

    private fun scheduleCheckIn() {
        val request = PeriodicWorkRequestBuilder<CheckInWorker>(15, TimeUnit.MINUTES)
            .build()
        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "mdm_check_in",
            ExistingPeriodicWorkPolicy.UPDATE,
            request
        )
    }

    private fun immediateCheckIn() {
        val serverUrl = prefs.getServerUrl() ?: return
        val deviceId = prefs.getDeviceId() ?: return
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val api = MDMApplication.instance.apiService
                val req = CheckInRequest(
                    batteryLevel = DeviceInfo.getBatteryLevel(this@EnrollmentActivity),
                    isCharging = DeviceInfo.isCharging(this@EnrollmentActivity),
                    networkType = DeviceInfo.getNetworkType(this@EnrollmentActivity)
                )
                api.checkIn(serverUrl, deviceId, req).use { }
            } catch (_: Exception) { }
        }
    }
}
