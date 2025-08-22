package com.mdm.agent.fcm;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000F\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0010$\n\u0002\b\u0007\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0000\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0002\b\u0007\u0018\u0000 #2\u00020\u0001:\u0001#B\u0005\u00a2\u0006\u0002\u0010\u0002J\u0010\u0010\u0007\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\nH\u0002J\u001c\u0010\u000b\u001a\u00020\b2\u0012\u0010\f\u001a\u000e\u0012\u0004\u0012\u00020\n\u0012\u0004\u0012\u00020\n0\rH\u0002J\"\u0010\u000e\u001a\u00020\b2\u0006\u0010\u000f\u001a\u00020\n2\b\u0010\u0010\u001a\u0004\u0018\u00010\n2\u0006\u0010\t\u001a\u00020\nH\u0002J\b\u0010\u0011\u001a\u00020\bH\u0002J\b\u0010\u0012\u001a\u00020\bH\u0016J\u0010\u0010\u0013\u001a\u00020\b2\u0006\u0010\u0014\u001a\u00020\u0015H\u0016J\u0010\u0010\u0016\u001a\u00020\b2\u0006\u0010\u0017\u001a\u00020\nH\u0016J\u001c\u0010\u0018\u001a\u000e\u0012\u0004\u0012\u00020\n\u0012\u0004\u0012\u00020\u00190\r2\u0006\u0010\u001a\u001a\u00020\nH\u0002J\"\u0010\u001b\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u001c\u001a\u00020\u001d2\b\u0010\u001e\u001a\u0004\u0018\u00010\nH\u0002J\u0010\u0010\u001f\u001a\u00020\b2\u0006\u0010\u0017\u001a\u00020\nH\u0002J\u001c\u0010 \u001a\u00020\b2\b\u0010!\u001a\u0004\u0018\u00010\n2\b\u0010\"\u001a\u0004\u0018\u00010\nH\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082.\u00a2\u0006\u0002\n\u0000\u00a8\u0006$"}, d2 = {"Lcom/mdm/agent/fcm/MDMFirebaseMessagingService;", "Lcom/google/firebase/messaging/FirebaseMessagingService;", "()V", "commandExecutor", "Lcom/mdm/agent/commands/CommandExecutor;", "preferenceManager", "Lcom/mdm/agent/utils/PreferenceManager;", "acknowledgeCommand", "", "commandId", "", "handleDataPayload", "data", "", "handleMDMCommand", "command", "params", "handleUnenrollment", "onCreate", "onMessageReceived", "remoteMessage", "Lcom/google/firebase/messaging/RemoteMessage;", "onNewToken", "token", "parseJsonToMap", "", "jsonString", "reportCommandResult", "success", "", "message", "sendTokenToServer", "showNotification", "title", "body", "Companion", "app_debug"})
public final class MDMFirebaseMessagingService extends com.google.firebase.messaging.FirebaseMessagingService {
    @org.jetbrains.annotations.NotNull
    private static final java.lang.String TAG = "MDMFirebaseMessaging";
    private com.mdm.agent.utils.PreferenceManager preferenceManager;
    private com.mdm.agent.commands.CommandExecutor commandExecutor;
    @org.jetbrains.annotations.NotNull
    public static final com.mdm.agent.fcm.MDMFirebaseMessagingService.Companion Companion = null;
    
    public MDMFirebaseMessagingService() {
        super();
    }
    
    @java.lang.Override
    public void onCreate() {
    }
    
    @java.lang.Override
    public void onMessageReceived(@org.jetbrains.annotations.NotNull
    com.google.firebase.messaging.RemoteMessage remoteMessage) {
    }
    
    @java.lang.Override
    public void onNewToken(@org.jetbrains.annotations.NotNull
    java.lang.String token) {
    }
    
    private final void handleDataPayload(java.util.Map<java.lang.String, java.lang.String> data) {
    }
    
    private final void handleMDMCommand(java.lang.String command, java.lang.String params, java.lang.String commandId) {
    }
    
    private final java.util.Map<java.lang.String, java.lang.Object> parseJsonToMap(java.lang.String jsonString) {
        return null;
    }
    
    private final void acknowledgeCommand(java.lang.String commandId) {
    }
    
    private final void reportCommandResult(java.lang.String commandId, boolean success, java.lang.String message) {
    }
    
    private final void sendTokenToServer(java.lang.String token) {
    }
    
    private final void showNotification(java.lang.String title, java.lang.String body) {
    }
    
    private final void handleUnenrollment() {
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u0012\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082T\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0005"}, d2 = {"Lcom/mdm/agent/fcm/MDMFirebaseMessagingService$Companion;", "", "()V", "TAG", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
    }
}