package com.mdm.agent.service

import android.app.Service
import android.content.Intent
import android.os.IBinder

class LocationService : Service() {
    override fun onBind(intent: Intent?): IBinder? = null
}
