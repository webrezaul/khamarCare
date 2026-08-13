// KhamarCare — Bluetooth Scale Service
// Wraps the Web Bluetooth API to connect to standard digital weighing scales

/**
 * Attempts to connect to a Bluetooth Weighing Scale
 * @param {Function} onWeightUpdate Callback when a new weight is received
 * @param {Function} onDisconnect Callback when device disconnects
 * @returns {Object} { device, server }
 */
export async function connectToBluetoothScale(onWeightUpdate, onDisconnect) {
  try {
    // Standard BLE Generic Attribute for Weight Scale is 0x181D
    // But many cheap scales use custom serial characteristics.
    // We will ask for any device to ensure compatibility in the MVP,
    // or specifically filter for Weight Scale service.
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['weight_scale'] }],
      optionalServices: ['battery_service', 'device_information']
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('weight_scale');
    const characteristic = await service.getCharacteristic('weight_measurement');

    characteristic.startNotifications();
    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const value = event.target.value;
      // Standard BLE Weight Measurement characteristic format:
      // Flags (1 byte), Weight (2 bytes, little-endian)
      // Note: This is highly simplified for standard GATT.
      const flags = value.getUint8(0);
      const isImperial = flags & 1; // bit 0: 0 = SI (kg), 1 = Imperial (lbs)
      
      const weightRaw = value.getUint16(1, true);
      // Resolution is typically 0.005 kg according to GATT spec
      let weightKg = weightRaw * 0.005;

      if (isImperial) {
        weightKg = weightKg * 0.453592; // Convert lbs to kg
      }

      onWeightUpdate(Number(weightKg.toFixed(2)));
    });

    device.addEventListener('gattserverdisconnected', onDisconnect);

    return { device, server };
  } catch (error) {
    console.error('Bluetooth Connection Error:', error);
    throw error;
  }
}
