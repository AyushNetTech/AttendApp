import { View, Pressable, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native'
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
      Alert.alert('Success', 'Punch recorded')
      router.replace('/home')
    } catch (e: any) {
      Alert.alert('Error', e.message)
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />
      <Pressable onPress={capture} style={{height:100, display:"flex", alignItems:"center", justifyContent:"center",
        
      }}>
        {loading ? <ActivityIndicator /> : <Text>Click Here</Text>}
      </Pressable>
    </View>
  )
}

const styles=StyleSheet.create({
  Capbtn:{
    height:200
  }
})
