package com.mdm.agent.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.IBinder

class MDMBackgroundService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // No-op stub
        return START_STICKY
    }

    companion object {
        fun start(context: Context) {
            context.startService(Intent(context, MDMBackgroundService::class.java))
        }
    }
}
