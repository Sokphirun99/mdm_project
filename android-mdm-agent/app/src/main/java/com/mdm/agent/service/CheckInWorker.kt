package com.mdm.agent.service

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.mdm.agent.MDMApplication
import com.mdm.agent.network.CheckInRequest
import com.mdm.agent.utils.PreferenceManager
import com.mdm.agent.utils.DeviceInfo

class CheckInWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {
    override suspend fun doWork(): Result {
        val prefs = PreferenceManager(applicationContext)
    val backendDeviceId = prefs.getDeviceId()
    val serverUrl = prefs.getServerUrl()
    if (backendDeviceId.isNullOrBlank() || serverUrl.isNullOrBlank()) {
            Log.w(TAG, "No backend device ID; skipping check-in")
            return Result.success()
        }

        return try {
            val api = MDMApplication.instance.apiService
            val storage = DeviceInfo.getStorageInfo()
            val mem = DeviceInfo.getMemoryInfo(applicationContext)
            val req = CheckInRequest(
                batteryLevel = DeviceInfo.getBatteryLevel(applicationContext),
                isCharging = DeviceInfo.isCharging(applicationContext),
                networkType = DeviceInfo.getNetworkType(applicationContext),
                availableStorage = storage.availableBytes,
                totalStorage = storage.totalBytes,
                availableRam = mem.availableBytes,
                totalRam = mem.totalBytes,
                isRooted = DeviceInfo.isRooted(),
                isScreenLocked = DeviceInfo.isScreenLocked(applicationContext),
                lastBoot = DeviceInfo.getLastBootIso()
            )
            val resp = api.checkIn(serverUrl, backendDeviceId, req)
            resp.use { r ->
                if (r.isSuccessful) {
                    Log.d(TAG, "Check-in ok: ${r.code}")
                    Result.success()
                } else {
                    Log.e(TAG, "Check-in failed: ${r.code}")
                    Result.retry()
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Check-in error", e)
            Result.retry()
        }
    }

    companion object { private const val TAG = "MDMCheckInWorker" }
}
