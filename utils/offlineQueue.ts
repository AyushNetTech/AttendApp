import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'OFFLINE_QUEUE'

export async function saveOfflinePunch(punch: any) {
  const data = await AsyncStorage.getItem(KEY)
  const queue = data ? JSON.parse(data) : []
  queue.push(punch)
  await AsyncStorage.setItem(KEY, JSON.stringify(queue))
}

export async function getOfflinePunches() {
  const data = await AsyncStorage.getItem(KEY)
  return data ? JSON.parse(data) : []
}

export async function clearOfflinePunches() {
  await AsyncStorage.removeItem(KEY)
}
