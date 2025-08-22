package com.mdm.agent.network;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000$\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\t\n\u0002\b&\b\u0086\b\u0018\u00002\u00020\u0001B}\u0012\n\b\u0002\u0010\u0002\u001a\u0004\u0018\u00010\u0003\u0012\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u0012\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u0012\n\b\u0002\u0010\b\u001a\u0004\u0018\u00010\t\u0012\n\b\u0002\u0010\n\u001a\u0004\u0018\u00010\t\u0012\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\t\u0012\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\t\u0012\n\b\u0002\u0010\r\u001a\u0004\u0018\u00010\u0005\u0012\n\b\u0002\u0010\u000e\u001a\u0004\u0018\u00010\u0005\u0012\n\b\u0002\u0010\u000f\u001a\u0004\u0018\u00010\u0007\u00a2\u0006\u0002\u0010\u0010J\u0010\u0010\u001f\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003\u00a2\u0006\u0002\u0010\u0016J\u000b\u0010 \u001a\u0004\u0018\u00010\u0007H\u00c6\u0003J\u0010\u0010!\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003\u00a2\u0006\u0002\u0010\u0018J\u000b\u0010\"\u001a\u0004\u0018\u00010\u0007H\u00c6\u0003J\u0010\u0010#\u001a\u0004\u0018\u00010\tH\u00c6\u0003\u00a2\u0006\u0002\u0010\u0012J\u0010\u0010$\u001a\u0004\u0018\u00010\tH\u00c6\u0003\u00a2\u0006\u0002\u0010\u0012J\u0010\u0010%\u001a\u0004\u0018\u00010\tH\u00c6\u0003\u00a2\u0006\u0002\u0010\u0012J\u0010\u0010&\u001a\u0004\u0018\u00010\tH\u00c6\u0003\u00a2\u0006\u0002\u0010\u0012J\u0010\u0010\'\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003\u00a2\u0006\u0002\u0010\u0018J\u0010\u0010(\u001a\u0004\u0018\u00010\u0005H\u00c6\u0003\u00a2\u0006\u0002\u0010\u0018J\u0086\u0001\u0010)\u001a\u00020\u00002\n\b\u0002\u0010\u0002\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u00072\n\b\u0002\u0010\b\u001a\u0004\u0018\u00010\t2\n\b\u0002\u0010\n\u001a\u0004\u0018\u00010\t2\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\t2\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\t2\n\b\u0002\u0010\r\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\u000e\u001a\u0004\u0018\u00010\u00052\n\b\u0002\u0010\u000f\u001a\u0004\u0018\u00010\u0007H\u00c6\u0001\u00a2\u0006\u0002\u0010*J\u0013\u0010+\u001a\u00020\u00052\b\u0010,\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010-\u001a\u00020\u0003H\u00d6\u0001J\t\u0010.\u001a\u00020\u0007H\u00d6\u0001R\u0015\u0010\u000b\u001a\u0004\u0018\u00010\t\u00a2\u0006\n\n\u0002\u0010\u0013\u001a\u0004\b\u0011\u0010\u0012R\u0015\u0010\b\u001a\u0004\u0018\u00010\t\u00a2\u0006\n\n\u0002\u0010\u0013\u001a\u0004\b\u0014\u0010\u0012R\u0015\u0010\u0002\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\n\n\u0002\u0010\u0017\u001a\u0004\b\u0015\u0010\u0016R\u0015\u0010\u0004\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\n\n\u0002\u0010\u0019\u001a\u0004\b\u0004\u0010\u0018R\u0015\u0010\r\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\n\n\u0002\u0010\u0019\u001a\u0004\b\r\u0010\u0018R\u0015\u0010\u000e\u001a\u0004\u0018\u00010\u0005\u00a2\u0006\n\n\u0002\u0010\u0019\u001a\u0004\b\u000e\u0010\u0018R\u0013\u0010\u000f\u001a\u0004\u0018\u00010\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001a\u0010\u001bR\u0013\u0010\u0006\u001a\u0004\u0018\u00010\u0007\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001c\u0010\u001bR\u0015\u0010\f\u001a\u0004\u0018\u00010\t\u00a2\u0006\n\n\u0002\u0010\u0013\u001a\u0004\b\u001d\u0010\u0012R\u0015\u0010\n\u001a\u0004\u0018\u00010\t\u00a2\u0006\n\n\u0002\u0010\u0013\u001a\u0004\b\u001e\u0010\u0012\u00a8\u0006/"}, d2 = {"Lcom/mdm/agent/network/CheckInRequest;", "", "batteryLevel", "", "isCharging", "", "networkType", "", "availableStorage", "", "totalStorage", "availableRam", "totalRam", "isRooted", "isScreenLocked", "lastBoot", "(Ljava/lang/Integer;Ljava/lang/Boolean;Ljava/lang/String;Ljava/lang/Long;Ljava/lang/Long;Ljava/lang/Long;Ljava/lang/Long;Ljava/lang/Boolean;Ljava/lang/Boolean;Ljava/lang/String;)V", "getAvailableRam", "()Ljava/lang/Long;", "Ljava/lang/Long;", "getAvailableStorage", "getBatteryLevel", "()Ljava/lang/Integer;", "Ljava/lang/Integer;", "()Ljava/lang/Boolean;", "Ljava/lang/Boolean;", "getLastBoot", "()Ljava/lang/String;", "getNetworkType", "getTotalRam", "getTotalStorage", "component1", "component10", "component2", "component3", "component4", "component5", "component6", "component7", "component8", "component9", "copy", "(Ljava/lang/Integer;Ljava/lang/Boolean;Ljava/lang/String;Ljava/lang/Long;Ljava/lang/Long;Ljava/lang/Long;Ljava/lang/Long;Ljava/lang/Boolean;Ljava/lang/Boolean;Ljava/lang/String;)Lcom/mdm/agent/network/CheckInRequest;", "equals", "other", "hashCode", "toString", "app_debug"})
public final class CheckInRequest {
    @org.jetbrains.annotations.Nullable
    private final java.lang.Integer batteryLevel = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Boolean isCharging = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String networkType = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Long availableStorage = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Long totalStorage = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Long availableRam = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Long totalRam = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Boolean isRooted = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Boolean isScreenLocked = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String lastBoot = null;
    
    public CheckInRequest(@org.jetbrains.annotations.Nullable
    java.lang.Integer batteryLevel, @org.jetbrains.annotations.Nullable
    java.lang.Boolean isCharging, @org.jetbrains.annotations.Nullable
    java.lang.String networkType, @org.jetbrains.annotations.Nullable
    java.lang.Long availableStorage, @org.jetbrains.annotations.Nullable
    java.lang.Long totalStorage, @org.jetbrains.annotations.Nullable
    java.lang.Long availableRam, @org.jetbrains.annotations.Nullable
    java.lang.Long totalRam, @org.jetbrains.annotations.Nullable
    java.lang.Boolean isRooted, @org.jetbrains.annotations.Nullable
    java.lang.Boolean isScreenLocked, @org.jetbrains.annotations.Nullable
    java.lang.String lastBoot) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Integer getBatteryLevel() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Boolean isCharging() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getNetworkType() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long getAvailableStorage() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long getTotalStorage() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long getAvailableRam() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long getTotalRam() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Boolean isRooted() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Boolean isScreenLocked() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getLastBoot() {
        return null;
    }
    
    public CheckInRequest() {
        super();
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Integer component1() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component10() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Boolean component2() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component3() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long component4() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long component5() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long component6() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Long component7() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Boolean component8() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Boolean component9() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final com.mdm.agent.network.CheckInRequest copy(@org.jetbrains.annotations.Nullable
    java.lang.Integer batteryLevel, @org.jetbrains.annotations.Nullable
    java.lang.Boolean isCharging, @org.jetbrains.annotations.Nullable
    java.lang.String networkType, @org.jetbrains.annotations.Nullable
    java.lang.Long availableStorage, @org.jetbrains.annotations.Nullable
    java.lang.Long totalStorage, @org.jetbrains.annotations.Nullable
    java.lang.Long availableRam, @org.jetbrains.annotations.Nullable
    java.lang.Long totalRam, @org.jetbrains.annotations.Nullable
    java.lang.Boolean isRooted, @org.jetbrains.annotations.Nullable
    java.lang.Boolean isScreenLocked, @org.jetbrains.annotations.Nullable
    java.lang.String lastBoot) {
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