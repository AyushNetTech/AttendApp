import { useEffect, useState } from 'react'
import { Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login() {
  const router = useRouter()

  const [companyEmail, setCompanyEmail] = useState('')
  const [employeeCode, setEmployeeCode] = useState('')
  const [password, setPassword] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  // 🔐 CHECK LOGIN ON APP OPEN
  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem('employee')
      if (session) {
        router.replace('/home') // ✅ already logged in
      }
      setCheckingSession(false)
    }

    checkSession()
  }, [])

  const login = async () => {
    // 1️⃣ Find company
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_email', companyEmail.trim())
      .maybeSingle()

    if (!company) {
      alert('Invalid company email')
      return
    }

    // 2️⃣ Find employee
    const { data: employee } = await supabase
      .from('employees')
      .select('id, employee_code, password, is_active')
      .eq('company_id', company.id)
      .eq('employee_code', employeeCode.trim())
      .maybeSingle()

    if (!employee) {
      alert('Invalid employee code')
      return
    }

    if (!employee.is_active) {
      alert('Employee is inactive')
      return
    }

    if (employee.password !== password) {
      alert('Wrong password')
      return
    }

    // 3️⃣ Save session (PERSISTENT)
    await AsyncStorage.setItem(
      'employee',
      JSON.stringify({
        id: employee.id,
        company_id: company.id,
        employee_code: employee.employee_code
      })
    )

    router.replace('/home')
  }

  // ⏳ Loader while checking session
  if (checkingSession) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    )
  }

  // 🔐 Login UI
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#0f172a'
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 20 }}>
        Employee Login
      </Text>

      <TextInput
        placeholder="Company Email (HR)"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        value={companyEmail}
        onChangeText={setCompanyEmail}
        style={{
          backgroundColor: '#1e293b',
          color: '#fff',
          padding: 14,
          borderRadius: 10,
          marginBottom: 12
        }}
      />

      <TextInput
        placeholder="Employee Code"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        value={employeeCode}
        onChangeText={setEmployeeCode}
        style={{
          backgroundColor: '#1e293b',
          color: '#fff',
          padding: 14,
          borderRadius: 10,
          marginBottom: 12
        }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: '#1e293b',
          color: '#fff',
          padding: 14,
          borderRadius: 10,
          marginBottom: 20
        }}
      />

      <Pressable
        onPress={login}
        style={{
          backgroundColor: '#2563eb',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Login</Text>
      </Pressable>
    </SafeAreaView>
  )
}
