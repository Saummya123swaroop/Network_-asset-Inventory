package network_inventory;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;

    // GET ALL DEVICES
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    // ADD DEVICE
    @PostMapping
    public Device addDevice(@RequestBody Device device) {
        return deviceRepository.save(device);
    }

    // UPDATE DEVICE
    @PutMapping("/{id}")
    public Device updateDevice(
            @PathVariable Integer id,
            @RequestBody Device updatedDevice) {

        Device existingDevice = deviceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Device not found"));

        existingDevice.setDeviceName(updatedDevice.getDeviceName());
        existingDevice.setIpAddress(updatedDevice.getIpAddress());
        existingDevice.setMacAddress(updatedDevice.getMacAddress());
        existingDevice.setDeviceType(updatedDevice.getDeviceType());
        existingDevice.setLocation(updatedDevice.getLocation());
        existingDevice.setMaintenanceDate(updatedDevice.getMaintenanceDate());
        existingDevice.setStatus(updatedDevice.getStatus());

        return deviceRepository.save(existingDevice);
    }

    // DELETE DEVICE
    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable Integer id) {
        deviceRepository.deleteById(id);
    }
}