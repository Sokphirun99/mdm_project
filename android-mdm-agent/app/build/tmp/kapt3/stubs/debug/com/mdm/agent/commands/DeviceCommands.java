package com.mdm.agent.commands;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\b\u0007\u0018\u0000 \u00172\u00020\u0001:\u0001\u0017B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0011\u0010\u000b\u001a\u00020\fH\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\rJ%\u0010\u000e\u001a\u00020\f2\u0012\u0010\u000f\u001a\u000e\u0012\u0004\u0012\u00020\u0011\u0012\u0004\u0012\u00020\u00010\u0010H\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0012J%\u0010\u0013\u001a\u00020\f2\u0012\u0010\u000f\u001a\u000e\u0012\u0004\u0012\u00020\u0011\u0012\u0004\u0012\u00020\u00010\u0010H\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0012J\u0011\u0010\u0014\u001a\u00020\fH\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\rJ%\u0010\u0015\u001a\u00020\f2\u0012\u0010\u000f\u001a\u000e\u0012\u0004\u0012\u00020\u0011\u0012\u0004\u0012\u00020\u00010\u0010H\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0012J%\u0010\u0016\u001a\u00020\f2\u0012\u0010\u000f\u001a\u000e\u0012\u0004\u0012\u00020\u0011\u0012\u0004\u0012\u00020\u00010\u0010H\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0012R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u0082\u0002\u0004\n\u0002\b\u0019\u00a8\u0006\u0018"}, d2 = {"Lcom/mdm/agent/commands/DeviceCommands;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "app", "Lcom/mdm/agent/MDMApplication;", "componentName", "Landroid/content/ComponentName;", "devicePolicyManager", "Landroid/app/admin/DevicePolicyManager;", "getDeviceInfo", "Lcom/mdm/agent/commands/CommandResult;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "lockDevice", "parameters", "", "", "(Ljava/util/Map;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "rebootDevice", "takeScreenshot", "unlockDevice", "wipeDevice", "Companion", "app_debug"})
public final class DeviceCommands {
    @org.jetbrains.annotations.NotNull
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String TAG = "DeviceCommands";
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.MDMApplication app = null;
    @org.jetbrains.annotations.NotNull
    private final android.app.admin.DevicePolicyManager devicePolicyManager = null;
    @org.jetbrains.annotations.NotNull
    private final android.content.ComponentName componentName = null;
    @org.jetbrains.annotations.NotNull
    public static final com.mdm.agent.commands.DeviceCommands.Companion Companion = null;
    
    public DeviceCommands(@org.jetbrains.annotations.NotNull
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object lockDevice(@org.jetbrains.annotations.NotNull
    java.util.Map<java.lang.String, ? extends java.lang.Object> parameters, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object unlockDevice(@org.jetbrains.annotations.NotNull
    java.util.Map<java.lang.String, ? extends java.lang.Object> parameters, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object rebootDevice(@org.jetbrains.annotations.NotNull
    java.util.Map<java.lang.String, ? extends java.lang.Object> parameters, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object wipeDevice(@org.jetbrains.annotations.NotNull
    java.util.Map<java.lang.String, ? extends java.lang.Object> parameters, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object getDeviceInfo(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object takeScreenshot(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0005"}, d2 = {"Lcom/mdm/agent/commands/DeviceCommands$Companion;", "", "()V", "TAG", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}