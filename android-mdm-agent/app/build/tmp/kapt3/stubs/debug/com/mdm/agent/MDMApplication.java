package com.mdm.agent;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000X\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0002\b\u0004\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0002\n\u0002\b\u0005\n\u0002\u0010\u000b\n\u0002\b\u0005\u0018\u0000 .2\u00020\u00012\u00020\u0002:\u0001.B\u0005\u00a2\u0006\u0002\u0010\u0003J\u0006\u0010!\u001a\u00020\nJ\u0006\u0010\"\u001a\u00020\u0010J\b\u0010#\u001a\u00020$H\u0002J\b\u0010%\u001a\u00020$H\u0002J\b\u0010&\u001a\u00020$H\u0002J\b\u0010\'\u001a\u00020$H\u0002J\b\u0010(\u001a\u00020$H\u0002J\u0006\u0010)\u001a\u00020*J\u0006\u0010+\u001a\u00020*J\b\u0010,\u001a\u00020$H\u0016J\b\u0010-\u001a\u00020$H\u0002R\u001e\u0010\u0006\u001a\u00020\u00052\u0006\u0010\u0004\u001a\u00020\u0005@BX\u0086.\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0007\u0010\bR\u000e\u0010\t\u001a\u00020\nX\u0082.\u00a2\u0006\u0002\n\u0000R\u001e\u0010\f\u001a\u00020\u000b2\u0006\u0010\u0004\u001a\u00020\u000b@BX\u0086.\u00a2\u0006\b\n\u0000\u001a\u0004\b\r\u0010\u000eR\u000e\u0010\u000f\u001a\u00020\u0010X\u0082.\u00a2\u0006\u0002\n\u0000R\u001e\u0010\u0012\u001a\u00020\u00112\u0006\u0010\u0004\u001a\u00020\u0011@BX\u0086.\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\u0014R\u001e\u0010\u0016\u001a\u00020\u00152\u0006\u0010\u0004\u001a\u00020\u0015@BX\u0086.\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0017\u0010\u0018R\u001e\u0010\u001a\u001a\u00020\u00192\u0006\u0010\u0004\u001a\u00020\u0019@BX\u0086.\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001b\u0010\u001cR\u0014\u0010\u001d\u001a\u00020\u001e8VX\u0096\u0004\u00a2\u0006\u0006\u001a\u0004\b\u001f\u0010 \u00a8\u0006/"}, d2 = {"Lcom/mdm/agent/MDMApplication;", "Landroid/app/Application;", "Landroidx/work/Configuration$Provider;", "()V", "<set-?>", "Lcom/mdm/agent/network/ApiService;", "apiService", "getApiService", "()Lcom/mdm/agent/network/ApiService;", "componentName", "Landroid/content/ComponentName;", "Lcom/mdm/agent/data/database/MDMDatabase;", "database", "getDatabase", "()Lcom/mdm/agent/data/database/MDMDatabase;", "devicePolicyManager", "Landroid/app/admin/DevicePolicyManager;", "Lcom/mdm/agent/data/repository/DeviceRepository;", "deviceRepository", "getDeviceRepository", "()Lcom/mdm/agent/data/repository/DeviceRepository;", "Lcom/mdm/agent/data/repository/PolicyRepository;", "policyRepository", "getPolicyRepository", "()Lcom/mdm/agent/data/repository/PolicyRepository;", "Lcom/mdm/agent/utils/PreferenceManager;", "preferenceManager", "getPreferenceManager", "()Lcom/mdm/agent/utils/PreferenceManager;", "workManagerConfiguration", "Landroidx/work/Configuration;", "getWorkManagerConfiguration", "()Landroidx/work/Configuration;", "getComponentName", "getDevicePolicyManager", "initializeDatabase", "", "initializeDeviceAdmin", "initializeNetworking", "initializePreferences", "initializeRepositories", "isAdminActive", "", "isDeviceOwner", "onCreate", "startBackgroundServices", "Companion", "app_debug"})
public final class MDMApplication extends android.app.Application implements androidx.work.Configuration.Provider {
    private static com.mdm.agent.MDMApplication instance;
    private com.mdm.agent.data.database.MDMDatabase database;
    private com.mdm.agent.data.repository.DeviceRepository deviceRepository;
    private com.mdm.agent.data.repository.PolicyRepository policyRepository;
    private com.mdm.agent.network.ApiService apiService;
    private com.mdm.agent.utils.PreferenceManager preferenceManager;
    private android.app.admin.DevicePolicyManager devicePolicyManager;
    private android.content.ComponentName componentName;
    @org.jetbrains.annotations.NotNull
    public static final com.mdm.agent.MDMApplication.Companion Companion = null;
    
    public MDMApplication() {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final com.mdm.agent.data.database.MDMDatabase getDatabase() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final com.mdm.agent.data.repository.DeviceRepository getDeviceRepository() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final com.mdm.agent.data.repository.PolicyRepository getPolicyRepository() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final com.mdm.agent.network.ApiService getApiService() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final com.mdm.agent.utils.PreferenceManager getPreferenceManager() {
        return null;
    }
    
    @java.lang.Override
    public void onCreate() {
    }
    
    private final void initializeDatabase() {
    }
    
    private final void initializeRepositories() {
    }
    
    private final void initializeNetworking() {
    }
    
    private final void initializePreferences() {
    }
    
    private final void initializeDeviceAdmin() {
    }
    
    private final void startBackgroundServices() {
    }
    
    @org.jetbrains.annotations.NotNull
    public final android.app.admin.DevicePolicyManager getDevicePolicyManager() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final android.content.ComponentName getComponentName() {
        return null;
    }
    
    public final boolean isDeviceOwner() {
        return false;
    }
    
    public final boolean isAdminActive() {
        return false;
    }
    
    @java.lang.Override
    @org.jetbrains.annotations.NotNull
    public androidx.work.Configuration getWorkManagerConfiguration() {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0014\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0004\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u001e\u0010\u0005\u001a\u00020\u00042\u0006\u0010\u0003\u001a\u00020\u0004@BX\u0086.\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007\u00a8\u0006\b"}, d2 = {"Lcom/mdm/agent/MDMApplication$Companion;", "", "()V", "<set-?>", "Lcom/mdm/agent/MDMApplication;", "instance", "getInstance", "()Lcom/mdm/agent/MDMApplication;", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
        
        @org.jetbrains.annotations.NotNull
        public final com.mdm.agent.MDMApplication getInstance() {
            return null;
        }
    }
}