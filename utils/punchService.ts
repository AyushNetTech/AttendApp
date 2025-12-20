import { supabase } from '../lib/supabase'
import * as Location from 'expo-location'
import * as ImageManipulator from 'expo-image-manipulator'
import NetInfo from '@react-native-community/netinfo'
import { saveOfflinePunch } from './offlineQueue'

type PunchType = 'IN' | 'OUT'

export async function punchAttendance(
  type: PunchType,
  photoUri: string
) {
  try {
    /* ================= USER ================= */
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not logged in')

    /* ================= EMPLOYEE ================= */
    const { data: employee } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!employee) throw new Error('Employee not found')

    /* ================= LOCATION ================= */
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      throw new Error('Location permission denied')
    }

    const location = await Location.getCurrentPositionAsync({})

    /* ================= IMAGE COMPRESSION ================= */
    const compressed = await ImageManipulator.manipulateAsync(
      photoUri,
      [],
      {
        compress: 0.4, // ~150–250 KB
        format: ImageManipulator.SaveFormat.JPEG
      }
    )

    const filePath = `${user.id}/${Date.now()}.jpg`

    /* ================= NETWORK CHECK ================= */
    const net = await NetInfo.fetch()

    /* ================= OFFLINE ================= */
    if (!net.isConnected) {
      await saveOfflinePunch({
        employee_id: employee.id,
        punch_type: type,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        photo_path: filePath,
        local_photo_uri: compressed.uri // 👈 save locally
      })
      return
    }

    /* ================= UPLOAD (CORRECT WAY) ================= */
    const formData = new FormData()
    formData.append('file', {
      uri: compressed.uri,
      name: 'photo.jpg',
      type: 'image/jpeg'
    } as any)

    const { error: uploadError } = await supabase.storage
      .from('attendance-photos')
      .upload(filePath, formData, {
        contentType: 'image/jpeg'
      })

    if (uploadError) throw uploadError

    /* ================= INSERT ATTENDANCE ================= */
    const { error: insertError } = await supabase
      .from('attendance_logs')
      .insert({
        employee_id: employee.id,
        punch_type: type,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        photo_path: filePath
      })

    if (insertError) throw insertError

  } catch (err) {
    console.error('Punch failed:', err)
    throw err
  }
}
