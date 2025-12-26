import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { syncOfflinePunches } from '../utils/syncOfflinePunches'

export default function RootLayout() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    syncOfflinePunches()
    AsyncStorage.getItem('employee').then(emp => {
      setLoggedIn(!!emp)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {loggedIn ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="index" />
        )}
      </Stack>
    </SafeAreaProvider>
  )
}
