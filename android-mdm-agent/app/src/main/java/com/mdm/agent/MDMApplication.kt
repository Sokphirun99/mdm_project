package com.mdm.agent

import android.app.Application
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import androidx.work.Configuration
import androidx.work.WorkManager
import com.mdm.agent.admin.MDMDeviceAdminReceiver
import com.mdm.agent.data.database.MDMDatabase
import com.mdm.agent.data.repository.DeviceRepository
import com.mdm.agent.data.repository.PolicyRepository
import com.mdm.agent.network.ApiService
import com.mdm.agent.service.MDMBackgroundService
import com.mdm.agent.utils.PreferenceManager

class MDMApplication : Application(), Configuration.Provider {

    companion object {
        lateinit var instance: MDMApplication
            private set
    }

    lateinit var database: MDMDatabase
        private set

    lateinit var deviceRepository: DeviceRepository
        private set

    lateinit var policyRepository: PolicyRepository
        private set

    lateinit var apiService: ApiService
        private set

    lateinit var preferenceManager: PreferenceManager
        private set

    private lateinit var devicePolicyManager: DevicePolicyManager
    private lateinit var componentName: ComponentName

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize core components
        initializeDatabase()
        initializeRepositories()
        initializeNetworking()
        initializePreferences()
        initializeDeviceAdmin()

        // Start background services
        startBackgroundServices()
    }

    private fun initializeDatabase() {
        database = MDMDatabase.getDatabase(this)
    }

    private fun initializeRepositories() {
        deviceRepository = DeviceRepository(database.deviceDao())
        policyRepository = PolicyRepository(database.policyDao())
    }

    private fun initializeNetworking() {
        apiService = ApiService.create(this)
    }

    private fun initializePreferences() {
        preferenceManager = PreferenceManager(this)
    }

    private fun initializeDeviceAdmin() {
        devicePolicyManager = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        componentName = ComponentName(this, MDMDeviceAdminReceiver::class.java)
    }

    private fun startBackgroundServices() {
        if (preferenceManager.isDeviceEnrolled()) {
            MDMBackgroundService.start(this)
        }
    }

    fun getDevicePolicyManager(): DevicePolicyManager = devicePolicyManager

    fun getComponentName(): ComponentName = componentName

    fun isDeviceOwner(): Boolean {
        return devicePolicyManager.isDeviceOwnerApp(packageName)
    }

    fun isAdminActive(): Boolean {
        return devicePolicyManager.isAdminActive(componentName)
    }

    override fun getWorkManagerConfiguration(): Configuration {
        return Configuration.Builder()
            .setMinimumLoggingLevel(android.util.Log.INFO)
            .build()
    }
}
