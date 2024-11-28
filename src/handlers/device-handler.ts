import AsyncStorage from '@react-native-async-storage/async-storage'

type DeviceInfo = {
  internalDeviceId: string
  isFirstSession: boolean
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  let id = await AsyncStorage.getItem('@advents:internal-device-id')

  const isFirstSession = !id

  if (!id) {
    id = crypto.randomUUID()
    await AsyncStorage.setItem('@advents:internal-device-id', id)
  }

  return {
    internalDeviceId: id,
    isFirstSession,
  }
}

export const updateInternalDeviceId = async (newId: string) => {
  await AsyncStorage.setItem('@advents:internal-device-id', newId)
}
