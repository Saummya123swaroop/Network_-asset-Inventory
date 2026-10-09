package network_inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Device Name
    @NotBlank(message = "Device name is required")
    @Size(max = 100, message = "Device name must not exceed 100 characters")
    @Column(name = "device_name", nullable = false)
    private String deviceName;

    // IP Address
    @NotBlank(message = "IP address is required")
    @Pattern(
        regexp = "^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\\.){3}"
               + "(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$",
        message = "Enter a valid IPv4 address"
    )
    @Column(name = "ip_address", nullable = false, unique = true)
    private String ipAddress;

    // MAC Address
    @NotBlank(message = "MAC address is required")
    @Pattern(
        regexp = "^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$",
        message = "Enter a valid MAC address"
    )
    @Column(name = "mac_address", nullable = false, unique = true)
    private String macAddress;

    // Device Type
    @NotBlank(message = "Device type is required")
    @Column(name = "device_type")
    private String deviceType;

    // Location
    @NotBlank(message = "Location is required")
    @Size(max = 150, message = "Location must not exceed 150 characters")
    @Column(name = "location")
    private String location;

    // Last Maintenance Date
    @Column(name = "maintenance_date")
    private String maintenanceDate;

    // Status
    @NotBlank(message = "Status is required")
    @Column(name = "status")
    private String status;


    // ==========================
    // GETTERS AND SETTERS
    // ==========================

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getMaintenanceDate() {
        return maintenanceDate;
    }

    public void setMaintenanceDate(String maintenanceDate) {
        this.maintenanceDate = maintenanceDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}