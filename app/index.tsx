import { useState } from 'react'
import {
  Text,
  TextInput,
  Pressable,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
    } else {
      router.replace('/home')
    }
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
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
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
