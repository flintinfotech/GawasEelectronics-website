// STATIC DATA HOOK: load() bulane par hi API call hoti hai (jaise menu par click), data/loading/error milta hai
import { useCallback, useState } from 'react'
import { getStaticData, type StaticData } from '../services/staticDataService'

export function useStaticData() {
  const [data, setData] = useState<StaticData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(() => {
    if (data) return // pehle se aa chuka hai
    setLoading(true)
    setError(false)
    getStaticData()
      .then(setData)
      .catch(e => { console.error('Static data load failed:', e); setError(true) }) // console me asli error dikhega
      .finally(() => setLoading(false))
  }, [data])

  return { data, loading, error, load }
}