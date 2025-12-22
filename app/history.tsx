import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'

export default function History() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
  (async () => {
    const s = await AsyncStorage.getItem('employee')
    if (!s) return

    const session = JSON.parse(s)

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('employee_id', session.id)
      .order('punch_time', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setRows(data || [])
  })()
}, [])


  return (
    <FlatList
      data={rows}
      keyExtractor={i => i.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.punch_type}</Text>
          <Text>{new Date(item.punch_time).toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            }
            </Text>
        </View>
      )}
    />
  )
}
