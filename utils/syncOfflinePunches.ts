import NetInfo from '@react-native-community/netinfo'
import { supabase } from '../lib/supabase'
import { getOfflinePunches, clearOfflinePunches } from './offlineQueue'

export async function syncOfflinePunches() {
  const net = await NetInfo.fetch()
  if (!net.isConnected) return

  const punches = await getOfflinePunches()
  if (!punches.length) return

  for (const p of punches) {
    await supabase.from('attendance').insert(p)
  }

  await clearOfflinePunches()
}
