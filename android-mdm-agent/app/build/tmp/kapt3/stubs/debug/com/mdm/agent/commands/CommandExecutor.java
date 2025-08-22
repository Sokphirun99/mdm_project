package com.mdm.agent.commands;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000D\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010$\n\u0002\b\u0006\u0018\u0000 \u00192\u00020\u0001:\u0001\u0019B\r\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J5\u0010\u000f\u001a\u00020\u00102\u0006\u0010\u0011\u001a\u00020\u00122\u0012\u0010\u0013\u001a\u000e\u0012\u0004\u0012\u00020\u0012\u0012\u0004\u0012\u00020\u00010\u00142\u0006\u0010\u0015\u001a\u00020\u0012H\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0016J%\u0010\u0017\u001a\u00020\u00102\u0012\u0010\u0013\u001a\u000e\u0012\u0004\u0012\u00020\u0012\u0012\u0004\u0012\u00020\u00010\u0014H\u0082@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0018R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u000b\u001a\u00020\fX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\r\u001a\u00020\u000eX\u0082\u0004\u00a2\u0006\u0002\n\u0000\u0082\u0002\u0004\n\u0002\b\u0019\u00a8\u0006\u001a"}, d2 = {"Lcom/mdm/agent/commands/CommandExecutor;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "appCommands", "Lcom/mdm/agent/commands/AppCommands;", "deviceCommands", "Lcom/mdm/agent/commands/DeviceCommands;", "monitoringCommands", "Lcom/mdm/agent/commands/MonitoringCommands;", "policyCommands", "Lcom/mdm/agent/commands/PolicyCommands;", "securityCommands", "Lcom/mdm/agent/commands/SecurityCommands;", "executeCommand", "Lcom/mdm/agent/commands/CommandResult;", "command", "", "parameters", "", "commandId", "(Ljava/lang/String;Ljava/util/Map;Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "executeCustomCommand", "(Ljava/util/Map;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "Companion", "app_debug"})
public final class CommandExecutor {
    @org.jetbrains.annotations.NotNull
    private final android.content.Context context = null;
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String TAG = "CommandExecutor";
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.commands.DeviceCommands deviceCommands = null;
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.commands.AppCommands appCommands = null;
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.commands.PolicyCommands policyCommands = null;
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.commands.SecurityCommands securityCommands = null;
    @org.jetbrains.annotations.NotNull
    private final com.mdm.agent.commands.MonitoringCommands monitoringCommands = null;
    @org.jetbrains.annotations.NotNull
    public static final com.mdm.agent.commands.CommandExecutor.Companion Companion = null;
    
    public CommandExecutor(@org.jetbrains.annotations.NotNull
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object executeCommand(@org.jetbrains.annotations.NotNull
    java.lang.String command, @org.jetbrains.annotations.NotNull
    java.util.Map<java.lang.String, ? extends java.lang.Object> parameters, @org.jetbrains.annotations.NotNull
    java.lang.String commandId, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    private final java.lang.Object executeCustomCommand(java.util.Map<java.lang.String, ? extends java.lang.Object> parameters, kotlin.coroutines.Continuation<? super com.mdm.agent.commands.CommandResult> $completion) {
        return null;
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0005"}, d2 = {"Lcom/mdm/agent/commands/CommandExecutor$Companion;", "", "()V", "TAG", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}