import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  const router = useRouter()

  return (
    <SafeAreaView style={{ flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#0f172a'}}>
    <View
      
    >
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>
        Attendance
      </Text>

      <Pressable
        onPress={() => router.push('/punch?type=IN')}
        style={{
          backgroundColor: '#16a34a',
          padding: 18,
          borderRadius: 14,
          marginTop: 30,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Punch In</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/punch?type=OUT')}
        style={{
          backgroundColor: '#dc2626',
          padding: 18,
          borderRadius: 14,
          marginTop: 14,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Punch Out</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/history')}
        style={{
          borderColor: '#fff',
          borderWidth: 1,
          padding: 18,
          borderRadius: 14,
          marginTop: 30,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#fff' }}>Punch History</Text>
      </Pressable>
    </View>
    </SafeAreaView>
  )
}
