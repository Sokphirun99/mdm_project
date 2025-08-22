package com.mdm.agent.network;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000*\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0005\n\u0002\u0010\b\n\u0002\b\u0006\n\u0002\u0010$\n\u0002\b \n\u0002\u0010\u000b\n\u0002\b\u0004\b\u0086\b\u0018\u00002\u00020\u0001B\u0087\u0001\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\b\u0010\u0005\u001a\u0004\u0018\u00010\u0003\u0012\b\u0010\u0006\u001a\u0004\u0018\u00010\u0003\u0012\b\u0010\u0007\u001a\u0004\u0018\u00010\u0003\u0012\b\u0010\b\u001a\u0004\u0018\u00010\t\u0012\b\u0010\n\u001a\u0004\u0018\u00010\u0003\u0012\b\u0010\u000b\u001a\u0004\u0018\u00010\u0003\u0012\b\u0010\f\u001a\u0004\u0018\u00010\u0003\u0012\b\b\u0002\u0010\r\u001a\u00020\u0003\u0012\b\u0010\u000e\u001a\u0004\u0018\u00010\u0003\u0012\u0016\b\u0002\u0010\u000f\u001a\u0010\u0012\u0004\u0012\u00020\u0003\u0012\u0006\u0012\u0004\u0018\u00010\u00010\u0010\u00a2\u0006\u0002\u0010\u0011J\t\u0010\"\u001a\u00020\u0003H\u00c6\u0003J\t\u0010#\u001a\u00020\u0003H\u00c6\u0003J\u000b\u0010$\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u0017\u0010%\u001a\u0010\u0012\u0004\u0012\u00020\u0003\u0012\u0006\u0012\u0004\u0018\u00010\u00010\u0010H\u00c6\u0003J\t\u0010&\u001a\u00020\u0003H\u00c6\u0003J\u000b\u0010\'\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010(\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010)\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u0010\u0010*\u001a\u0004\u0018\u00010\tH\u00c6\u0003\u00a2\u0006\u0002\u0010\u0015J\u000b\u0010+\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010,\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010-\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u00a4\u0001\u0010.\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\n\b\u0002\u0010\u0005\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u0007\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\b\u001a\u0004\u0018\u00010\t2\n\b\u0002\u0010\n\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u000b\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\f\u001a\u0004\u0018\u00010\u00032\b\b\u0002\u0010\r\u001a\u00020\u00032\n\b\u0002\u0010\u000e\u001a\u0004\u0018\u00010\u00032\u0016\b\u0002\u0010\u000f\u001a\u0010\u0012\u0004\u0012\u00020\u0003\u0012\u0006\u0012\u0004\u0018\u00010\u00010\u0010H\u00c6\u0001\u00a2\u0006\u0002\u0010/J\u0013\u00100\u001a\u0002012\b\u00102\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u00103\u001a\u00020\tH\u00d6\u0001J\t\u00104\u001a\u00020\u0003H\u00d6\u0001R\u0013\u0010\u0007\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013R\u0015\u0010\b\u001a\u0004\u0018\u00010\t\u00a2\u0006\n\n\u0002\u0010\u0016\u001a\u0004\b\u0014\u0010\u0015R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0017\u0010\u0013R\u001f\u0010\u000f\u001a\u0010\u0012\u0004\u0012\u00020\u0003\u0012\u0006\u0012\u0004\u0018\u00010\u00010\u0010\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0018\u0010\u0019R\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001a\u0010\u0013R\u0011\u0010\r\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001b\u0010\u0013R\u0013\u0010\f\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001c\u0010\u0013R\u0013\u0010\u000b\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001d\u0010\u0013R\u0013\u0010\u0006\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001e\u0010\u0013R\u0013\u0010\u0005\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u001f\u0010\u0013R\u0013\u0010\u000e\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b \u0010\u0013R\u0013\u0010\n\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b!\u0010\u0013\u00a8\u00065"}, d2 = {"Lcom/mdm/agent/network/EnrollRequest;", "", "deviceId", "", "deviceName", "model", "manufacturer", "androidVersion", "apiLevel", "", "serialNumber", "imei", "fcmToken", "enrollmentMethod", "organizationId", "deviceInfo", "", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/Integer;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/util/Map;)V", "getAndroidVersion", "()Ljava/lang/String;", "getApiLevel", "()Ljava/lang/Integer;", "Ljava/lang/Integer;", "getDeviceId", "getDeviceInfo", "()Ljava/util/Map;", "getDeviceName", "getEnrollmentMethod", "getFcmToken", "getImei", "getManufacturer", "getModel", "getOrganizationId", "getSerialNumber", "component1", "component10", "component11", "component12", "component2", "component3", "component4", "component5", "component6", "component7", "component8", "component9", "copy", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/Integer;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/util/Map;)Lcom/mdm/agent/network/EnrollRequest;", "equals", "", "other", "hashCode", "toString", "app_debug"})
public final class EnrollRequest {
    @org.jetbrains.annotations.NotNull
    private final java.lang.String deviceId = null;
    @org.jetbrains.annotations.NotNull
    private final java.lang.String deviceName = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String model = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String manufacturer = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String androidVersion = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.Integer apiLevel = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String serialNumber = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String imei = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String fcmToken = null;
    @org.jetbrains.annotations.NotNull
    private final java.lang.String enrollmentMethod = null;
    @org.jetbrains.annotations.Nullable
    private final java.lang.String organizationId = null;
    @org.jetbrains.annotations.NotNull
    private final java.util.Map<java.lang.String, java.lang.Object> deviceInfo = null;
    
    public EnrollRequest(@org.jetbrains.annotations.NotNull
    java.lang.String deviceId, @org.jetbrains.annotations.NotNull
    java.lang.String deviceName, @org.jetbrains.annotations.Nullable
    java.lang.String model, @org.jetbrains.annotations.Nullable
    java.lang.String manufacturer, @org.jetbrains.annotations.Nullable
    java.lang.String androidVersion, @org.jetbrains.annotations.Nullable
    java.lang.Integer apiLevel, @org.jetbrains.annotations.Nullable
    java.lang.String serialNumber, @org.jetbrains.annotations.Nullable
    java.lang.String imei, @org.jetbrains.annotations.Nullable
    java.lang.String fcmToken, @org.jetbrains.annotations.NotNull
    java.lang.String enrollmentMethod, @org.jetbrains.annotations.Nullable
    java.lang.String organizationId, @org.jetbrains.annotations.NotNull
    java.util.Map<java.lang.String, ? extends java.lang.Object> deviceInfo) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String getDeviceId() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String getDeviceName() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getModel() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getManufacturer() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getAndroidVersion() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Integer getApiLevel() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getSerialNumber() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getImei() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getFcmToken() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String getEnrollmentMethod() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String getOrganizationId() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.util.Map<java.lang.String, java.lang.Object> getDeviceInfo() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String component1() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String component10() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component11() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.util.Map<java.lang.String, java.lang.Object> component12() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String component2() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component3() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component4() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component5() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Integer component6() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component7() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component8() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.String component9() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final com.mdm.agent.network.EnrollRequest copy(@org.jetbrains.annotations.NotNull
    java.lang.String deviceId, @org.jetbrains.annotations.NotNull
    java.lang.String deviceName, @org.jetbrains.annotations.Nullable
    java.lang.String model, @org.jetbrains.annotations.Nullable
    java.lang.String manufacturer, @org.jetbrains.annotations.Nullable
    java.lang.String androidVersion, @org.jetbrains.annotations.Nullable
    java.lang.Integer apiLevel, @org.jetbrains.annotations.Nullable
    java.lang.String serialNumber, @org.jetbrains.annotations.Nullable
    java.lang.String imei, @org.jetbrains.annotations.Nullable
    java.lang.String fcmToken, @org.jetbrains.annotations.NotNull
    java.lang.String enrollmentMethod, @org.jetbrains.annotations.Nullable
    java.lang.String organizationId, @org.jetbrains.annotations.NotNull
    java.util.Map<java.lang.String, ? extends java.lang.Object> deviceInfo) {
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