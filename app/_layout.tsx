import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { syncOfflinePunches } from '../utils/syncOfflinePunches'

export default function RootLayout() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    syncOfflinePunches()
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
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
      {session ? (
        <Stack.Screen name="home" />
      ) : (
        <Stack.Screen name="index" />
      )}
    </Stack>
    </SafeAreaProvider>
  )

}
