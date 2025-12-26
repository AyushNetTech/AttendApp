import { View, Pressable, Text, ActivityIndicator, Alert } from 'react-native'
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
    if (!permission?.granted) requestPermission()
  }, [permission])

  const capture = async () => {
    if (loading) return

    try {
      setLoading(true)
      const photo = await cameraRef.current!.takePictureAsync()
      await punchAttendance(type!, photo.uri)
      Alert.alert('Success', `Punch ${type} recorded`)
      router.replace('/home')
    } catch (e: any) {
      Alert.alert('Error', e.message)
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />

      {/* TOP LABEL */}
      <View
        style={{
          position: 'absolute',
          top: 60,
          alignSelf: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 999
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '700'
          }}
        >
          Punch {type}
        </Text>
      </View>

      {/* BOTTOM BAR */}
      <View
        style={{
          position: 'absolute',
          bottom: 70,
          width: '100%',
          alignItems: 'center'
        }}
      >
        <Pressable
          onPress={capture}
          disabled={loading}
          style={{
            height: 80,
            width: 140,
            borderRadius: 30,
            backgroundColor: type === 'IN' ? '#16a34a' : '#dc2626',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: '#fff'
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              CAPTURE
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}
