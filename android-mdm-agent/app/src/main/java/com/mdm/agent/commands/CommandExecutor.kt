package com.mdm.agent.commands

import android.content.Context
import android.util.Log
import com.mdm.agent.MDMApplication

data class CommandResult(
    val success: Boolean,
    val message: String? = null,
    val data: Map<String, Any>? = null
)

class CommandExecutor(private val context: Context) {

    companion object {
        private const val TAG = "CommandExecutor"
    }

    private val deviceCommands = DeviceCommands(context)
    private val appCommands = AppCommands(context)
    private val policyCommands = PolicyCommands(context)
    private val securityCommands = SecurityCommands(context)
    private val monitoringCommands = MonitoringCommands(context)

    suspend fun executeCommand(
        command: String, 
        parameters: Map<String, Any>, 
        commandId: String
    ): CommandResult {
        
        Log.d(TAG, "Executing command: $command with parameters: $parameters")
        
        return try {
            when (command) {
                // Device commands
                "lock_device" -> deviceCommands.lockDevice(parameters)
                "unlock_device" -> deviceCommands.unlockDevice(parameters)
                "reboot_device" -> deviceCommands.rebootDevice(parameters)
                "wipe_device" -> deviceCommands.wipeDevice(parameters)
                "get_device_info" -> deviceCommands.getDeviceInfo()
                
                // App commands
                "install_app" -> appCommands.installApp(parameters)
                "uninstall_app" -> appCommands.uninstallApp(parameters)
                
                // Policy commands
                "update_policy" -> policyCommands.updatePolicy(parameters)
                "remove_policy" -> policyCommands.removePolicy(parameters)
                "set_password_policy" -> policyCommands.setPasswordPolicy(parameters)
                
                // Security commands
                "disable_camera" -> securityCommands.disableCamera()
                "enable_camera" -> securityCommands.enableCamera()
                "disable_usb" -> securityCommands.disableUsb()
                "enable_usb" -> securityCommands.enableUsb()
                
                // Monitoring commands
                "get_location" -> monitoringCommands.getCurrentLocation()
                
                // Custom command
                "custom_command" -> executeCustomCommand(parameters)
                
                else -> {
                    Log.w(TAG, "Unknown command: $command")
                    CommandResult(false, "Unknown command: $command")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error executing command: $command", e)
            CommandResult(false, "Command execution failed: ${e.message}")
        }
    }

    private suspend fun executeCustomCommand(parameters: Map<String, Any>): CommandResult {
        val action = parameters["action"] as? String
        return when (action) {
            "get_installed_apps" -> monitoringCommands.getInstalledApps()
            "get_device_status" -> monitoringCommands.getDeviceStatus()
            "take_screenshot" -> deviceCommands.takeScreenshot()
            else -> CommandResult(false, "Unknown custom command action: $action")
        }
    }
}
