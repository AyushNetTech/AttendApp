import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function History() {
  const [sections, setSections] = useState<any[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const s = await AsyncStorage.getItem('employee')
    if (!s) return

    const session = JSON.parse(s)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', session.id)
      .gte('punch_time', sevenDaysAgo.toISOString())
      .order('punch_time', { ascending: false })

    if (!data) return

    const grouped: Record<string, any[]> = {}

    data.forEach(item => {
      const date = new Date(item.punch_time).toDateString()
      grouped[date] = grouped[date] || []
      grouped[date].push(item)
    })

    setSections(Object.entries(grouped))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 16 }}>
        Last 7 Days
      </Text>

      <FlatList
        data={sections}
        keyExtractor={item => item[0]}
        renderItem={({ item }) => {
          const [date, rows] = item
          return (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#93c5fd', marginBottom: 8 }}>
                {date}
              </Text>

              {rows.map((r: any) => (
                <View
                  key={r.id}
                  style={{
                    backgroundColor: '#1e293b',
                    padding: 14,
                    borderRadius: 14,
                    marginBottom: 10
                  }}
                >
                  {/* Punch Type */}
                  <Text
                    style={{
                      color: r.punch_type === 'IN' ? '#22c55e' : '#ef4444',
                      fontWeight: '700',
                      fontSize: 16
                    }}
                  >
                    {r.punch_type}
                  </Text>

                  {/* Time */}
                  <Text style={{ color: '#94a3b8', marginTop: 4 }}>
                    {new Date(r.punch_time).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>

                  {/* 📍 Location */}
                  <Text
                    style={{
                      color: '#cbd5f5',
                      marginTop: 6,
                      fontSize: 13
                    }}
                    numberOfLines={2}
                  >
                    📍 {r.location_text || 'Location unavailable'}
                  </Text>
                </View>
              ))}

            </View>
          )
        }}
      />
    </SafeAreaView>
  )
}
