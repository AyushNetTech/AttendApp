import { useState } from 'react'
import { Text, TextInput, Pressable } from 'react-native'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Login() {
  const [companyEmail, setCompanyEmail] = useState('')
  const [employeeCode, setEmployeeCode] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
    // 1️⃣ Find company by HR email
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_email', companyEmail)
      .maybeSingle()

    if (companyError || !company) {
      alert('Invalid company email')
      return
    }

    // 2️⃣ Find employee inside that company
    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('id, employee_code, password, is_active')
      .eq('company_id', company.id)
      .eq('employee_code', employeeCode)
      .maybeSingle()

    if (empError || !employee) {
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

    // 3️⃣ Save session
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

      {/* 🔑 Company Email */}
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

      {/* 👤 Employee Code */}
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

      {/* 🔐 Password */}
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
