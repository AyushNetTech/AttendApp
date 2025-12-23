import { View, Text, Pressable, ActivityIndicator } from 'react-native'
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

    // 1️⃣ Get employee name
    const { data: emp } = await supabase
      .from('employees')
      .select('name')
      .eq('id', session.id)
      .maybeSingle()

    // 2️⃣ Get company name
    const { data: comp } = await supabase
      .from('companies')
      .select('name')
      .eq('id', session.company_id)
      .maybeSingle()

    setEmployeeName(emp?.name || '')
    setCompanyName(comp?.name || '')
    setLoading(false)
  }

  const logout = async () => {
    await AsyncStorage.removeItem('employee')
    router.replace('/')
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ padding: 24, flex: 1 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ color: '#94a3b8', fontSize: 14 }}>Welcome</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>
            {employeeName}
          </Text>
          <Text style={{ color: '#cbd5f5', marginTop: 4 }}>
            {companyName}
          </Text>
        </View>

        {/* Punch Buttons */}
        <Pressable
          onPress={() => router.push('/punch?type=IN')}
          style={{
            backgroundColor: '#16a34a',
            padding: 20,
            borderRadius: 16,
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Punch In
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/punch?type=OUT')}
          style={{
            backgroundColor: '#dc2626',
            padding: 20,
            borderRadius: 16,
            alignItems: 'center',
            marginBottom: 28
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Punch Out
          </Text>
        </Pressable>

        {/* Secondary Actions */}
        <Pressable
          onPress={() => router.push('/history')}
          style={{
            borderColor: '#475569',
            borderWidth: 1,
            padding: 18,
            borderRadius: 16,
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <Text style={{ color: '#e2e8f0', fontSize: 15 }}>
            Attendance History
          </Text>
        </Pressable>

        <Pressable
          onPress={logout}
          style={{
            borderColor: '#ef4444',
            borderWidth: 1,
            padding: 18,
            borderRadius: 16,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#ef4444', fontSize: 15 }}>
            Sign Out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
