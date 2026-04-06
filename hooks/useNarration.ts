// hooks/useNarration.ts

import { useMemo } from 'react'

export type NarrationLine = {
  start: number
  end: number
  text: string
}

export function useNarration(narrationFile: any): NarrationLine[] {
  return useMemo(() => {
    try {
      // Whisper JSON has a "segments" array — map it cleanly
      return (narrationFile?.segments ?? []).map((seg: any) => ({
        start: seg.start,  // seconds
        end: seg.end,
        text: seg.text.trim(),
      }))
    } catch {
      return []
    }
  }, [narrationFile])
}