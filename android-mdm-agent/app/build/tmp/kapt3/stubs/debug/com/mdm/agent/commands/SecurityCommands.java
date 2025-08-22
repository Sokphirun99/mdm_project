package com.mdm.agent.commands;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000,\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0006\u0018\u0000 \u00112\u00020\u0001:\u0001\u0011B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0011\u0010\u000b\u001a\u00020\fH\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\rJ\u0011\u0010\u000e\u001a\u00020\fH\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\rJ\u0011\u0010\u000f\u001a\u00020\fH\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\rJ\u0011\u0010\u0010\u001a\u00020\fH\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\rR\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u0082\u0002\u0004\n\u0002\b\u0019\u00a8\u0006\u0012"}, d2 = {"Lcom/mdm/agent/commands/SecurityCommands;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "app", "Lcom/mdm/agent/MDMApplication;", "componentName", "Landroid/content/ComponentName;", "devicePolicyManager", "Landroid/app/admin/DevicePolicyManager;", "disableCamera", "Lcom/mdm/agent/commands/CommandResult;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "disableUsb", "enableCamera", "enableUsb", "Companion", "app_debug"})
public final class SecurityCommands {
    @org.jetbrains.annotations.NotNull
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String TAG = "SecurityCommands";
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.MDMApplication app = null;
    @org.jetbrains.annotations.NotNull
    private final android.app.admin.DevicePolicyManager devicePolicyManager = null;
    @org.jetbrains.annotations.NotNull
    private final android.content.ComponentName componentName = null;
    @org.jetbrains.annotations.NotNull
    public static final com.mdm.agent.commands.SecurityCommands.Companion Companion = null;
    
    public SecurityCommands(@org.jetbrains.annotations.NotNull
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object disableCamera(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object enableCamera(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object disableUsb(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object enableUsb(@org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0005"}, d2 = {"Lcom/mdm/agent/commands/SecurityCommands$Companion;", "", "()V", "TAG", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}