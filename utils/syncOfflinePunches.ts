import NetInfo from '@react-native-community/netinfo'
import { supabase } from '../lib/supabase'
import * as Location from 'expo-location'
import { getOfflinePunches, clearOfflinePunches } from './offlineQueue'

export async function syncOfflinePunches() {
  const net = await NetInfo.fetch()
  if (!net.isConnected) return

  const punches = await getOfflinePunches()
  if (!punches.length) return

  for (const p of punches) {
    // 1️⃣ Upload image
    const formData = new FormData()
    formData.append('file', {
      uri: p.local_photo_uri,
      name: 'photo.jpg',
      type: 'image/jpeg'
    } as any)

    await supabase.storage
      .from('attendance-photos')
      .upload(p.photo_path, formData, { contentType: 'image/jpeg' })

    // 2️⃣ Reverse geocode NOW (online)
    const places = await Location.reverseGeocodeAsync({
      latitude: p.latitude,
      longitude: p.longitude
    })

    const locationText =
      places.length
        ? [places[0].name,places[0].city].filter(Boolean).join(', ')
        : 'Unknown location'

    // 3️⃣ Insert attendance
    await supabase.from('attendance').insert({
      employee_id: p.employee_id,
      company_id: p.company_id,
      punch_type: p.punch_type,
      latitude: p.latitude,
      longitude: p.longitude,
      location_text: locationText,
      punch_time: p.punch_time,
      photo_path: p.photo_path
    })
  }

  await clearOfflinePunches()
}
