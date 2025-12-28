import { supabase } from '../lib/supabase'
import * as Location from 'expo-location'
import * as ImageManipulator from 'expo-image-manipulator'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { saveOfflinePunch } from './offlineQueue'

export async function punchAttendance(type: 'IN' | 'OUT', photoUri: string) {

  async function getLocationText(lat: number, lng: number): Promise<string> {
  try {
    const places = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng
    })

    if (!places.length) return 'Unknown location'

    const p = places[0]

    return [
      p.city,
    ]
      .filter(Boolean)
      .join(', ')
  } catch {
    return 'Unknown location'
  }
}

  const empRaw = await AsyncStorage.getItem('employee')
  if (!empRaw) throw new Error('Not logged in')

  const employee = JSON.parse(empRaw)

  // 🔹 Capture punch time immediately
  const punchTime = new Date().toISOString()

  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') throw new Error('Location denied')

  const location = await Location.getCurrentPositionAsync({})
  const { latitude, longitude } = location.coords

  const locationText = await getLocationText(latitude, longitude)


  const compressed = await ImageManipulator.manipulateAsync(
    photoUri,
    [],
    { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
  )

  const filePath = `${employee.id}/${Date.now()}.jpg`
  const net = await NetInfo.fetch()

  // 🔴 OFFLINE MODE
  if (!net.isConnected) {
    await saveOfflinePunch({
      employee_id: employee.id,
      company_id: employee.company_id,
      punch_type: type,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      location_text: locationText,
      punch_time: punchTime,        // ✅ STORE REAL TIME
      photo_path: filePath,
      local_photo_uri: compressed.uri // ✅ STORE PHOTO URI
    })
    return
  }

  // 🟢 ONLINE MODE
  const formData = new FormData()
  formData.append('file', {
    uri: compressed.uri,
    name: 'photo.jpg',
    type: 'image/jpeg'
  } as any)

  await supabase.storage
    .from('attendance-photos')
    .upload(filePath, formData, { contentType: 'image/jpeg' })

  await supabase.from('attendance').insert({
    employee_id: employee.id,
    company_id: employee.company_id,
    punch_type: type,
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    location_text: locationText,
    punch_time: punchTime, // ✅ USE REAL TIME
    photo_path: filePath
  })
}

