package com.mdm.agent.data.database

import android.content.Context

class MDMDatabase private constructor() {
    companion object {
        fun getDatabase(context: Context): MDMDatabase = MDMDatabase()
    }

    fun deviceDao(): Any = Any()
    fun policyDao(): Any = Any()
}
