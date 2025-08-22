package com.mdm.agent.ui;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00004\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\u0018\u00002\u00020\u0001:\u0001\u0014B\u0005\u00a2\u0006\u0002\u0010\u0002J\u0010\u0010\u0007\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\nH\u0002J\n\u0010\u000b\u001a\u0004\u0018\u00010\nH\u0003J\b\u0010\f\u001a\u00020\bH\u0002J\b\u0010\r\u001a\u00020\nH\u0003J\u0012\u0010\u000e\u001a\u00020\b2\b\u0010\u000f\u001a\u0004\u0018\u00010\u0010H\u0014J\u0010\u0010\u0011\u001a\u00020\u00122\u0006\u0010\t\u001a\u00020\nH\u0002J\b\u0010\u0013\u001a\u00020\bH\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082.\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082.\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0015"}, d2 = {"Lcom/mdm/agent/ui/EnrollmentActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "()V", "prefs", "Lcom/mdm/agent/utils/PreferenceManager;", "tv", "Landroid/widget/TextView;", "enrollFromQr", "", "content", "", "getSerialNumberSafe", "immediateCheckIn", "obtainDeviceId", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "parseQr", "Lcom/mdm/agent/ui/EnrollmentActivity$ParsedQr;", "scheduleCheckIn", "ParsedQr", "app_debug"})
public final class EnrollmentActivity extends androidx.appcompat.app.AppCompatActivity {
    private android.widget.TextView tv;
    private com.mdm.agent.utils.PreferenceManager prefs;
    
    public EnrollmentActivity() {
        super();
    }
    
    @java.lang.Override
    protected void onCreate(@org.jetbrains.annotations.Nullable
    android.os.Bundle savedInstanceState) {
    }
    
    private final void enrollFromQr(java.lang.String content) {
    }
    
    private final com.mdm.agent.ui.EnrollmentActivity.ParsedQr parseQr(java.lang.String content) {
        return null;
    }
    
    @android.annotation.SuppressLint(value = {"HardwareIds"})
    private final java.lang.String obtainDeviceId() {
        return null;
    }
    
    @android.annotation.SuppressLint(value = {"HardwareIds"})
    private final java.lang.String getSerialNumberSafe() {
        return null;
    }
    
    private final void scheduleCheckIn() {
    }
    
    private final void immediateCheckIn() {
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\"\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0002\b\t\n\u0002\u0010\u000b\n\u0002\b\u0002\n\u0002\u0010\b\n\u0002\b\u0002\b\u0082\b\u0018\u00002\u00020\u0001B\u0019\u0012\b\u0010\u0002\u001a\u0004\u0018\u00010\u0003\u0012\b\u0010\u0004\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\u0002\u0010\u0005J\u000b\u0010\t\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010\n\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J!\u0010\u000b\u001a\u00020\u00002\n\b\u0002\u0010\u0002\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0003H\u00c6\u0001J\u0013\u0010\f\u001a\u00020\r2\b\u0010\u000e\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010\u000f\u001a\u00020\u0010H\u00d6\u0001J\t\u0010\u0011\u001a\u00020\u0003H\u00d6\u0001R\u0013\u0010\u0004\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007R\u0013\u0010\u0002\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\b\u0010\u0007\u00a8\u0006\u0012"}, d2 = {"Lcom/mdm/agent/ui/EnrollmentActivity$ParsedQr;", "", "serverUrl", "", "organizationId", "(Ljava/lang/String;Ljava/lang/String;)V", "getOrganizationId", "()Ljava/lang/String;", "getServerUrl", "component1", "component2", "copy", "equals", "", "other", "hashCode", "", "toString", "app_debug"})
    static final class ParsedQr {
        @org.jetbrains.annotations.Nullable
        private final java.lang.String serverUrl = null;
        @org.jetbrains.annotations.Nullable
        private final java.lang.String organizationId = null;
        
        public ParsedQr(@org.jetbrains.annotations.Nullable
        java.lang.String serverUrl, @org.jetbrains.annotations.Nullable
        java.lang.String organizationId) {
            super();
        }
        
        @org.jetbrains.annotations.Nullable
        public final java.lang.String getServerUrl() {
            return null;
        }
        
        @org.jetbrains.annotations.Nullable
        public final java.lang.String getOrganizationId() {
            return null;
        }
        
        @org.jetbrains.annotations.Nullable
        public final java.lang.String component1() {
            return null;
        }
        
        @org.jetbrains.annotations.Nullable
        public final java.lang.String component2() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull
        public final com.mdm.agent.ui.EnrollmentActivity.ParsedQr copy(@org.jetbrains.annotations.Nullable
        java.lang.String serverUrl, @org.jetbrains.annotations.Nullable
        java.lang.String organizationId) {
            return null;
        }
        
        @java.lang.Override
        public boolean equals(@org.jetbrains.annotations.Nullable
        java.lang.Object other) {
            return false;
        }
        
        @java.lang.Override
        public int hashCode() {
            return 0;
        }
        
        @java.lang.Override
        @org.jetbrains.annotations.NotNull
        public java.lang.String toString() {
            return null;
        }
    }
}