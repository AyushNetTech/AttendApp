import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [employeeName, setEmployeeName] = useState('')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const s = await AsyncStorage.getItem('employee')
    if (!s) {
      router.replace('/')
      return
    }

    const session = JSON.parse(s)

    const { data: emp } = await supabase
      .from('employees')
      .select('name')
      .eq('id', session.id)
      .maybeSingle()

    const { data: comp } = await supabase
      .from('companies')
      .select('name')
      .eq('id', session.company_id)
      .maybeSingle()

    setEmployeeName(emp?.name || '')
    setCompanyName(comp?.name || '')
    setLoading(false)
  }

  const confirmLogout = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('employee')
            router.replace('/')
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', backgroundColor: '#020617' }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
      <View style={{ flex: 1, padding: 20 }}>

        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <View>
            <Text style={{ color: '#94a3b8', fontSize: 15 }}>
              {companyName}
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 26,
                fontWeight: '700',
                marginTop: 2,
              }}
            >
              {employeeName}
            </Text>
          </View>

          {/* SIGN OUT BUTTON */}
          <Pressable
            onPress={confirmLogout}
            style={{
              borderColor: '#ef4444',
              borderWidth: 1,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: '#ef4444',
                fontSize: 13,
                fontWeight: '600',
              }}
            >
              Sign out
            </Text>
          </Pressable>
        </View>

        {/* CENTER ACTIONS */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Pressable
            onPress={() => router.push('/punch?type=IN')}
            style={{
              backgroundColor: '#16a34a',
              padding: 22,
              borderRadius: 18,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '700',
              }}
            >
              Punch In
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/punch?type=OUT')}
            style={{
              backgroundColor: '#dc2626',
              padding: 22,
              borderRadius: 18,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '700',
              }}
            >
              Punch Out
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
