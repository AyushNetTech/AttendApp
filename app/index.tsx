import { useState } from 'react'
import { Text, TextInput, Pressable } from 'react-native'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login() {
  const [employeeCode, setEmployeeCode] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
  const { data: employee, error } = await supabase
    .from('employees')
    .select('id, company_id, employee_code, password, is_active')
    .eq('employee_code', employeeCode)
    .maybeSingle() // ✅ SAFE

  if (error) {
    alert(error.message)
    return
  }

  if (!employee) {
    alert('Invalid employee code')
    return
  }

  if (!employee.is_active) {
    alert('Employee is inactive')
    return
  }

  if (!employee.password) {
    alert('Password not set for this employee')
    return
  }

  if (employee.password !== password) {
    alert('Wrong password')
    return
  }

  await AsyncStorage.setItem(
    'employee',
    JSON.stringify({
      id: employee.id,
      company_id: employee.company_id,
      employee_code: employee.employee_code
    })
  )

  router.replace('/home')
}


  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#0f172a'
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          color: '#fff',
          marginBottom: 20
        }}
      >
        Employee Login
      </Text>

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
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          Login
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}
