import { View, Text, FlatList} from 'react-native'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function History() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('attendance_logs')
      .select('punched_at, punch_type')
      .order('punched_at', { ascending: false })
      .then(res => setData(res.data ?? []))
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 16
      }}
    >
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: '600',
          marginBottom: 12
        }}
      >
        Punch History
      </Text>

      <FlatList
        data={data}
        keyExtractor={(_, i) => i.toString()}
        ItemSeparatorComponent={() => (
          <View style={{ height: 12 }} />
        )}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#020617',
              padding: 16,
              borderRadius: 12
            }}
          >
            <Text style={{ color: '#38bdf8', fontSize: 14 }}>
              {item.punch_type}
            </Text>

            <Text style={{ color: '#e5e7eb', marginTop: 4 }}>
              {new Date(item.punched_at).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}
