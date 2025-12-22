import { View, Text, FlatList } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from '../lib/api'

export default function History() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    AsyncStorage.getItem('employee_session').then(async s => {
      const session = JSON.parse(s!)
      const res = await fetch(
        `${api}/attendance/history?employee_id=${session.employee_id}`
      )
      const data = await res.json()
      setRows(data)
    })
  }, [])

  return (
    <FlatList
      data={rows}
      keyExtractor={i => i.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.punch_type}</Text>
          <Text>{new Date(item.punch_time).toLocaleString()}</Text>
        </View>
      )}
    />
  )
}
