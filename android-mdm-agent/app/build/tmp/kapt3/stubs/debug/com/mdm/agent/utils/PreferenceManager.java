package com.mdm.agent.utils;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0002\b\f\u0018\u0000 \u00192\u00020\u0001:\u0001\u0019B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0006\u0010\u0007\u001a\u00020\bJ\b\u0010\t\u001a\u0004\u0018\u00010\nJ\b\u0010\u000b\u001a\u0004\u0018\u00010\nJ\b\u0010\f\u001a\u0004\u0018\u00010\nJ\u0006\u0010\r\u001a\u00020\u000eJ\u000e\u0010\u000f\u001a\u00020\b2\u0006\u0010\u0010\u001a\u00020\u000eJ\u000e\u0010\u0011\u001a\u00020\b2\u0006\u0010\u0012\u001a\u00020\nJ\u000e\u0010\u0013\u001a\u00020\b2\u0006\u0010\u0014\u001a\u00020\u000eJ\u000e\u0010\u0015\u001a\u00020\b2\u0006\u0010\u0016\u001a\u00020\nJ\u000e\u0010\u0017\u001a\u00020\b2\u0006\u0010\u0018\u001a\u00020\nR\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001a"}, d2 = {"Lcom/mdm/agent/utils/PreferenceManager;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "prefs", "Landroid/content/SharedPreferences;", "clearEnrollmentData", "", "getDeviceId", "", "getFcmToken", "getServerUrl", "isDeviceEnrolled", "", "setDeviceAdminEnabled", "enabled", "setDeviceId", "id", "setEnrolled", "enrolled", "setFcmToken", "token", "setServerUrl", "url", "Companion", "app_debug"})
public final class PreferenceManager {
    @org.jetbrains.annotations.NotNull
    private final android.content.SharedPreferences prefs = null;
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String KEY_DEVICE_ADMIN = "device_admin_enabled";
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String KEY_ENROLLED = "enrolled";
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String KEY_DEVICE_ID = "device_id";
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String KEY_FCM_TOKEN = "fcm_token";
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String KEY_SERVER_URL = "server_url";
    @org.jetbrains.annotations.NotNull
    public static final com.mdm.agent.utils.PreferenceManager.Companion Companion = null;
    
    public PreferenceManager(@org.jetbrains.annotations.NotNull
    android.content.Context context) {
        super();
    }
    
    public final boolean isDeviceEnrolled() {
        return false;
    }
    
    public final void setDeviceAdminEnabled(boolean enabled) {
    }
    
    public final void setFcmToken(@org.jetbrains.annotations.NotNull
    java.lang.String token) {
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getDeviceId() {
        return null;
    }
    
    public final void clearEnrollmentData() {
    }
    
    public final void setEnrolled(boolean enrolled) {
    }
    
    public final void setDeviceId(@org.jetbrains.annotations.NotNull
    java.lang.String id) {
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getFcmToken() {
        return null;
    }
    
    public final void setServerUrl(@org.jetbrains.annotations.NotNull
    java.lang.String url) {
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getServerUrl() {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0014\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0005\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000R\u000e\u0010\b\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\t"}, d2 = {"Lcom/mdm/agent/utils/PreferenceManager$Companion;", "", "()V", "KEY_DEVICE_ADMIN", "", "KEY_DEVICE_ID", "KEY_ENROLLED", "KEY_FCM_TOKEN", "KEY_SERVER_URL", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}