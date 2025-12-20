import AsyncStorage from '@react-native-async-storage/async-storage'

const QUEUE_KEY = 'OFFLINE_PUNCH_QUEUE'

type OfflinePunch = {
  employee_id: string
  punch_type: 'IN' | 'OUT'
  latitude: number
  longitude: number
  photo_path: string
  local_photo_uri: string // 👈 REQUIRED
}


export async function saveOfflinePunch(punch: OfflinePunch) {
  const existing = await AsyncStorage.getItem(QUEUE_KEY)
  const queue: OfflinePunch[] = existing ? JSON.parse(existing) : []
  queue.push(punch)
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export async function getOfflinePunches(): Promise<OfflinePunch[]> {
  const data = await AsyncStorage.getItem(QUEUE_KEY)
  return data ? JSON.parse(data) : []
}

export async function clearOfflinePunches() {
  await AsyncStorage.removeItem(QUEUE_KEY)
}
