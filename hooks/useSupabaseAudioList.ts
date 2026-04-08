// hooks/useSupabaseAudioList.ts

import { useState, useEffect } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUCKET_NAME, CATEGORY_FOLDERS } from '@/constants/supabaseConfig'

export type RemoteTrack = {
  id: string
  categoryId: string
  categoryTitle: string
  title: string
  fileName: string
  audioUrl: string
  fileSizeBytes: number
}

// Converts filename like "Peppa_Pig_Bedtime_Story_Mix_02.mp3"
// into readable title "Peppa Pig Bedtime Story Mix 02"
function toReadableTitle(fileName: string): string {
  return fileName
    .replace(/\.[^/.]+$/, '')   
    .replace(/converted by soundandgo\.com/gi, '')         // remove extension
    .replace(/[_-]/g, ' ')              // underscores/dashes → spaces
    .replace(/\s+/g, ' ')
    .trim()
}

export function useSupabaseAudioList() {
  const [tracks, setTracks] = useState<RemoteTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllTracks()
  }, [])

  async function fetchAllTracks() {
    setLoading(true)
    setError(null)
    try {
      const allTracks: RemoteTrack[] = []

      for (const cat of CATEGORY_FOLDERS) {
        const url = `${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            prefix: `${cat.folder}/`,
            limit: 200,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          }),
        })

        if (!res.ok) throw new Error(`Failed to list ${cat.folder}: ${res.status}`)

        const files: any[] = await res.json()
        // console.log(`[${cat.folder}] response:`, JSON.stringify(files))
        if (!Array.isArray(files)) continue

        for (const file of files) {
          // Skip folders or zero-byte placeholders
          if (!file.name || file.metadata?.size === 0) continue
          // Only audio files
          if (!file.name.match(/\.(mp3|wav|m4a|aac)$/i)) continue

          const fileName = file.name  // e.g. "Peppa_Pig_Bedtime_Story_Mix_02.mp3"
          const audioUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${cat.folder}/${fileName}`

          allTracks.push({
            id: `${cat.id}-${fileName}`,
            categoryId: cat.id,
            categoryTitle: cat.title,
            title: toReadableTitle(fileName),
            fileName: `${cat.id}_${fileName}`,  // local unique filename
            audioUrl,
            fileSizeBytes: file.metadata?.size ?? 0,
          })
        }
      }

      setTracks(allTracks)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load audio list')
      console.error('useSupabaseAudioList error:', e)
    } finally {
      setLoading(false)
    }
  }

  return { tracks, loading, error, refetch: fetchAllTracks }
}