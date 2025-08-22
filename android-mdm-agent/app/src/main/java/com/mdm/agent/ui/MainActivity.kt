package com.mdm.agent.ui

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanOptions
import com.mdm.agent.R

class MainActivity : AppCompatActivity() {

    private lateinit var statusText: TextView

    private val barcodeLauncher = registerForActivityResult(ScanContract()) { result ->
        if (result.contents != null) {
            statusText.text = getString(R.string.scan_result, result.contents)
            startActivity(android.content.Intent(this, EnrollmentActivity::class.java).putExtra("qr", result.contents))
        } else if (result.originalIntent == null) {
            statusText.text = getString(R.string.scan_cancelled)
        } else {
            statusText.text = getString(R.string.scan_failed)
        }
    }

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) startScan() else statusText.text = getString(R.string.camera_permission_denied)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        statusText = findViewById(R.id.tvStatus)
        val scanBtn: Button = findViewById(R.id.btnScan)

        scanBtn.setOnClickListener {
            ensureCameraPermissionAndScan()
        }
    }

    private fun ensureCameraPermissionAndScan() {
        when (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)) {
            PackageManager.PERMISSION_GRANTED -> startScan()
            else -> permissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun startScan() {
        val options = ScanOptions().apply {
            setDesiredBarcodeFormats(ScanOptions.QR_CODE)
            setPrompt(getString(R.string.scan_prompt))
            setBeepEnabled(true)
            setBarcodeImageEnabled(false)
            setOrientationLocked(true)
        }
        barcodeLauncher.launch(options)
    }
}
