import { useState, useEffect, useCallback, useMemo } from 'react'
// ✅ Use the legacy import to stop the SDK 54 errors
import * as FileSystem from 'expo-file-system/legacy'
import { RemoteTrack } from './useSupabaseAudioList'

const AUDIO_DIR = `${FileSystem.documentDirectory}peppa_audio/`

export function useAudioDownload(track: RemoteTrack) {
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const localPath = useMemo(() => `${AUDIO_DIR}${track.fileName}`, [track.fileName])

  // Logic to ensure directory exists
  const ensureDir = async () => {
    const dirInfo = await FileSystem.getInfoAsync(AUDIO_DIR)
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true })
    }
  }

  const startDownload = useCallback(async () => {
    // Prevent double-downloading if already in progress or already finished
    if (isDownloading || isDownloaded) return
    
    setIsDownloading(true)
    setProgress(0)
    setError(null)

    try {
      await ensureDir()

      const downloadResumable = FileSystem.createDownloadResumable(
        track.audioUrl,
        localPath,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          if (totalBytesExpectedToWrite > 0) {
            setProgress(totalBytesWritten / totalBytesExpectedToWrite)
          }
        }
      )

      const result = await downloadResumable.downloadAsync()

      if (result?.uri) {
        setIsDownloaded(true)
        setProgress(1)
      }
    } catch (e: any) {
      setError(e?.message ?? 'Download failed')
      console.error('Download error:', e)
    } finally {
      setIsDownloading(false)
    }
  }, [track.audioUrl, localPath, isDownloading, isDownloaded])

  // ✅ AUTO-EXECUTION LOGIC
  useEffect(() => {
    let isMounted = true

    async function initializeFile() {
      try {
        const info = await FileSystem.getInfoAsync(localPath)
        
        if (info.exists) {
          if (isMounted) {
            setIsDownloaded(true)
            setProgress(1)
          }
        } else {
          // If it doesn't exist, start downloading IMMEDIATELY
          if (isMounted) {
            await startDownload()
          }
        }
      } catch (err) {
        // If check fails, try to download anyway
        if (isMounted) await startDownload()
      }
    }

    initializeFile()
    
    return () => { isMounted = false }
  }, [track.id, localPath, startDownload])

  return {
    isDownloaded,
    isDownloading,
    progress,
    error,
    // If downloaded, use local path; otherwise, fall back to remote URL
    audioUri: isDownloaded ? localPath : track.audioUrl,
  }
}