import { View, Alert, Pressable, Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRef, useEffect, useState } from 'react'
import { punchAttendance } from '../utils/punchService'

export default function Punch() {
  const { type } = useLocalSearchParams<{ type: 'IN' | 'OUT' }>()
  const router = useRouter()
  const cameraRef = useRef<CameraView | null>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [permission?.granted, requestPermission])

  const takePhoto = async () => {
    // 🛑 HARD GUARD (prevents double tap)
    if (loading) return

    try {
      setLoading(true)

      if (!cameraRef.current) {
        throw new Error('Camera not ready')
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true
      })

      await punchAttendance(type!, photo.uri)

      Alert.alert('Success', 'Punch recorded')

      // ⏳ Small delay so user sees feedback
      setTimeout(() => {
        router.replace('/home')
      }, 400)

    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Punch failed')
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />

      <View style={{ padding: 20 }}>
        <Pressable
          disabled={loading}
          onPress={takePhoto}
          style={{
            backgroundColor: loading ? '#666' : '#000',
            padding: 14,
            borderRadius: 10,
            opacity: loading ? 0.8 : 1
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>
              Capture & Punch
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}
