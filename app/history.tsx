import { View, Text, FlatList, Platform } from 'react-native'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'
import { SafeAreaView } from 'react-native-safe-area-context'

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

      if (!error) setRows(data || [])
    })()
  }, [])

  const renderItem = ({ item }: any) => {
    const isIn = item.punch_type === 'IN'

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={[styles.badge, isIn ? styles.in : styles.out]}>
            {isIn ? 'IN' : 'OUT'}
          </Text>

          <Text style={styles.typeText}>
            {isIn ? 'Punch In' : 'Punch Out'}
          </Text>
        </View>

        <Text style={styles.timeText}>
          {new Date(item.punch_time).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>

      {rows.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No attendance records found</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16
  },

  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },

    // Android shadow
    elevation: 4
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 10,
    overflow: 'hidden'
  },

  in: {
    backgroundColor: '#14532d',
    color: '#22c55e'
  },

  out: {
    backgroundColor: '#7f1d1d',
    color: '#ef4444'
  },

  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e5e7eb'
  },

  timeText: {
    marginTop: 6,
    color: '#94a3b8',
    fontSize: 14
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyText: {
    color: '#94a3b8',
    fontSize: 16
  }
}
