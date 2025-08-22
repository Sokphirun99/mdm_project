package com.mdm.agent.network;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000L\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\b\u0018\u0000 \u001f2\u00020\u0001:\u0001\u001fB\u000f\b\u0002\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u000e\u0010\r\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u0010J\u001e\u0010\u0011\u001a\u00020\u00122\u0006\u0010\u0013\u001a\u00020\u00102\u0006\u0010\u0014\u001a\u00020\u00102\u0006\u0010\u0015\u001a\u00020\u0016J\u0016\u0010\u0017\u001a\u00020\u00122\u0006\u0010\u0013\u001a\u00020\u00102\u0006\u0010\u0015\u001a\u00020\u0018J \u0010\u0019\u001a\u00020\u000e2\u0006\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u001a\u001a\u00020\u00102\b\u0010\u001b\u001a\u0004\u0018\u00010\u0010J\u0016\u0010\u001c\u001a\u00020\u000e2\u0006\u0010\u001d\u001a\u00020\u00102\u0006\u0010\u001e\u001a\u00020\u0010R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000b\u001a\u00020\fX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006 "}, d2 = {"Lcom/mdm/agent/network/ApiService;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "client", "Lokhttp3/OkHttpClient;", "gson", "Lcom/google/gson/Gson;", "json", "Lokhttp3/MediaType;", "prefs", "Lcom/mdm/agent/utils/PreferenceManager;", "acknowledgeCommand", "", "commandId", "", "checkIn", "Lokhttp3/Response;", "serverUrl", "backendDeviceId", "req", "Lcom/mdm/agent/network/CheckInRequest;", "enroll", "Lcom/mdm/agent/network/EnrollRequest;", "reportCommandResult", "status", "message", "updateDeviceFcmToken", "deviceId", "token", "Companion", "app_debug"})
public final class ApiService {
    @org.jetbrains.annotations.NotNull
    private final okhttp3.OkHttpClient client = null;
    @org.jetbrains.annotations.NotNull
    private final com.google.gson.Gson gson = null;
    @org.jetbrains.annotations.NotNull
    private final okhttp3.MediaType json = null;
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.utils.PreferenceManager prefs = null;
    @org.jetbrains.annotations.NotNull
    public static final com.mdm.agent.network.ApiService.Companion Companion = null;
    
    private ApiService(android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final okhttp3.Response enroll(@org.jetbrains.annotations.NotNull
    java.lang.String serverUrl, @org.jetbrains.annotations.NotNull
    com.mdm.agent.network.EnrollRequest req) {
        return null;
    }
    
    public final void acknowledgeCommand(@org.jetbrains.annotations.NotNull
    java.lang.String commandId) {
    }
    
    public final void reportCommandResult(@org.jetbrains.annotations.NotNull
    java.lang.String commandId, @org.jetbrains.annotations.NotNull
    java.lang.String status, @org.jetbrains.annotations.Nullable
    java.lang.String message) {
    }
    
    public final void updateDeviceFcmToken(@org.jetbrains.annotations.NotNull
    java.lang.String deviceId, @org.jetbrains.annotations.NotNull
    java.lang.String token) {
    }
    
    @org.jetbrains.annotations.NotNull
    public final okhttp3.Response checkIn(@org.jetbrains.annotations.NotNull
    java.lang.String serverUrl, @org.jetbrains.annotations.NotNull
    java.lang.String backendDeviceId, @org.jetbrains.annotations.NotNull
    com.mdm.agent.network.CheckInRequest req) {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0018\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u000e\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u0006\u00a8\u0006\u0007"}, d2 = {"Lcom/mdm/agent/network/ApiService$Companion;", "", "()V", "create", "Lcom/mdm/agent/network/ApiService;", "context", "Landroid/content/Context;", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
        
        @org.jetbrains.annotations.NotNull
        public final com.mdm.agent.network.ApiService create(@org.jetbrains.annotations.NotNull
        android.content.Context context) {
            return null;
        }
    }
}