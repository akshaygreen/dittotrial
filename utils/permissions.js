async function requestPermissions() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ]);

    Object.entries(granted).forEach(([permission, result]) => {
      console.log(
        `${permission} ${
          result === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied'
        }`,
      );
    });
  }
}

export {requestPermissions};
