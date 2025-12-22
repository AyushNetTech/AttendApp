import { supabase } from '../lib/supabase'
import * as Location from 'expo-location'
import * as ImageManipulator from 'expo-image-manipulator'
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { saveOfflinePunch } from './offlineQueue'

export async function punchAttendance(type: 'IN' | 'OUT', photoUri: string) {
  const empRaw = await AsyncStorage.getItem('employee')
  if (!empRaw) throw new Error('Not logged in')

  const employee = JSON.parse(empRaw)

  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') throw new Error('Location denied')

  const location = await Location.getCurrentPositionAsync({})

  const compressed = await ImageManipulator.manipulateAsync(
    photoUri,
    [],
    { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG }
  )

  const filePath = `${employee.id}/${Date.now()}.jpg`

  const net = await NetInfo.fetch()

  if (!net.isConnected) {
    await saveOfflinePunch({
      employee_id: employee.id,
      company_id: employee.company_id,
      punch_type: type,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      photo_path: filePath
    })
    return
  }

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
    photo_path: filePath
  })
}
